/**
 * Handoff.res - Fogbinder Handoff Manager
 * "Whereof one cannot speak, thereof one must be silent." - Tractatus 7
 *
 * This module manages the certainty boundary between NSAI and Fogbinder.
 * When validation reaches its limits, we hand off to uncertainty exploration.
 */

open Atomic
open FogbinderInterface

/** Configuration for the handoff manager */
type handoffManagerConfig = {
  certaintyThreshold: float,
  autoDetectContradictions: bool,
  includeMysteryClustering: bool,
}

/** Default handoff configuration */
let defaultHandoffConfig: handoffManagerConfig = {
  certaintyThreshold: 0.7,
  autoDetectContradictions: true,
  includeMysteryClustering: false,
}

/** Check if a citation lacks persistent identifiers */
let lacksPersistentIdentifiers = (citation: atomicCitation): bool => {
  switch (citation.doi, citation.isbn, citation.url) {
  | (None, None, None) => true
  | (Some(d), _, _) if Js.String2.trim(d) == "" => true
  | (_, Some(i), _) if Js.String2.trim(i) == "" => true
  | (_, _, Some(u)) if Js.String2.trim(u) == "" => true
  | _ => false
  }
}

/** Check if date is temporally uncertain (very old or missing) */
let hasTemporalUncertainty = (citation: atomicCitation): bool => {
  switch citation.date {
  | None => true
  | Some(d) => {
      let year = Js.String2.slice(d, ~from=0, ~to_=4)->Belt.Int.fromString
      switch year {
      | None => true
      | Some(y) => y < 1000 || y > 2100
      }
    }
  }
}

/** Detect uncertainty regions from validation results */
let detectUncertaintyRegions = (
  results: array<validationResult>
): array<uncertaintyRegion> => {
  let regions: ref<array<uncertaintyRegion>> = ref([])

  // 1. No persistent identifiers
  let noPersistentIds = results->Js.Array2.filter(r =>
    lacksPersistentIdentifiers(r.citation)
  )

  if Js.Array2.length(noPersistentIds) > 0 {
    regions := Js.Array2.concat(regions.contents, [{
      id: "no-persistent-identifiers",
      regionType: #noPersistentIdentifiers,
      citationIds: noPersistentIds->Js.Array2.map(r => r.citation.id),
      description: "Citations without DOI, ISBN, or URL",
      suggestedExploration: "Use Fogbinder to search external databases for identifiers",
    }])
  }

  // 2. Temporal uncertainties
  let temporalUncertain = results->Js.Array2.filter(r =>
    hasTemporalUncertainty(r.citation)
  )

  if Js.Array2.length(temporalUncertain) > 0 {
    regions := Js.Array2.concat(regions.contents, [{
      id: "temporal-uncertainties",
      regionType: #temporalAmbiguity,
      citationIds: temporalUncertain->Js.Array2.map(r => r.citation.id),
      description: "Citations with unusual or missing dates",
      suggestedExploration: "Use Fogbinder timeline analysis to investigate temporal claims",
    }])
  }

  // 3. Low certainty citations
  let lowCertainty = results->Js.Array2.filter(r =>
    r.certainty.score < 0.4
  )

  if Js.Array2.length(lowCertainty) > 0 {
    regions := Js.Array2.concat(regions.contents, [{
      id: "low-certainty-citations",
      regionType: #lowCertainty,
      citationIds: lowCertainty->Js.Array2.map(r => r.citation.id),
      description: "Citations with very low validation certainty",
      suggestedExploration: "Use Fogbinder mood analysis to understand uncertainty sources",
    }])
  }

  regions.contents
}

/** Get normalized title for comparison */
let normalizeTitle = (title: string): string => {
  title
  ->Js.String2.toLowerCase
  ->Js.String2.trim
}

/** Get primary author last name */
let getPrimaryAuthor = (creators: array<creator>): option<string> => {
  creators
  ->Js.Array2.find(c => c.creatorType == #author)
  ->Belt.Option.map(c => c.lastName)
}

/** Detect potential contradictions between citations */
let detectContradictions = (
  results: array<validationResult>
): array<contradictionHint> => {
  let hints: ref<array<contradictionHint>> = ref([])

  // Group citations by normalized title
  let titleGroups: Js.Dict.t<array<validationResult>> = Js.Dict.empty()

  results->Js.Array2.forEach(r => {
    let key = normalizeTitle(r.citation.title)
    let existing = Js.Dict.get(titleGroups, key)->Belt.Option.getWithDefault([])
    Js.Dict.set(titleGroups, key, Js.Array2.concat(existing, [r]))
  })

  // Check for contradictions within groups
  Js.Dict.entries(titleGroups)->Js.Array2.forEach(((_, group)) => {
    if Js.Array2.length(group) > 1 {
      // Check for different authors with same title
      let authors = group->Js.Array2.filterMap(r =>
        getPrimaryAuthor(r.citation.creators)
      )
      let uniqueAuthors = authors->Js.Array2.reduce((acc, a) => {
        if Js.Array2.includes(acc, a) { acc } else { Js.Array2.concat(acc, [a]) }
      }, [])

      if Js.Array2.length(uniqueAuthors) > 1 {
        hints := Js.Array2.concat(hints.contents, [{
          hintType: #authorship,
          citationIds: group->Js.Array2.map(r => r.citation.id),
          description: "Same title with different authors - possible editions or co-authorship",
          requiresSemanticAnalysis: true,
        }])
      }

      // Check for different years with same author/title
      let years = group->Js.Array2.filterMap(r => r.citation.date)
      let uniqueYears = years->Js.Array2.reduce((acc, y) => {
        if Js.Array2.includes(acc, y) { acc } else { Js.Array2.concat(acc, [y]) }
      }, [])

      if Js.Array2.length(uniqueYears) > 1 {
        hints := Js.Array2.concat(hints.contents, [{
          hintType: #temporal,
          citationIds: group->Js.Array2.map(r => r.citation.id),
          description: "Same work with different publication years - possible editions",
          requiresSemanticAnalysis: true,
        }])
      }
    }
  })

  hints.contents
}

/** Generate epistemic summary from validation results */
let generateEpistemicSummary = (
  results: array<validationResult>,
  uncertaintyRegions: array<uncertaintyRegion>
): epistemicSummary => {
  let validCount = results->Js.Array2.filter(r => r.state == #VALID)->Js.Array2.length
  let uncertainCount = results->Js.Array2.filter(r =>
    r.state == #UNCERTAIN || r.state == #INCOMPLETE
  )->Js.Array2.length
  let invalidCount = results->Js.Array2.filter(r => r.state == #INVALID)->Js.Array2.length

  let totalCertainty = results->Js.Array2.reduce((acc, r) =>
    acc +. r.certainty.score, 0.0
  )
  let overallCertainty = if Js.Array2.length(results) > 0 {
    totalCertainty /. Belt.Int.toFloat(Js.Array2.length(results))
  } else {
    0.0
  }

  // Generate epistemic gaps from uncertainty regions
  let gaps = uncertaintyRegions->Js.Array2.map(region => {
    let gapType = switch region.regionType {
    | #noPersistentIdentifiers => #missingIdentifiers
    | #temporalAmbiguity => #temporalUncertainty
    | #authorshipQuestion => #authorshipAmbiguity
    | #lowCertainty => #incompleteMetadata
    }

    {
      gapType,
      affectedCitations: Js.Array2.length(region.citationIds),
      description: region.description,
      explorableInFogbinder: region.regionType != #incompleteMetadata,
    }
  })

  // Generate recommendation
  let recommendation = if overallCertainty > 0.8 {
    "Collection is well-structured. Minor refinements may improve certainty."
  } else if overallCertainty > 0.5 {
    "Consider using Fogbinder to explore uncertainty regions."
  } else {
    "Significant uncertainty detected. Fogbinder exploration recommended."
  }

  {
    totalCitations: Js.Array2.length(results),
    validatedCount: validCount,
    uncertainCount,
    invalidCount,
    overallCertainty,
    epistemicGaps: gaps,
    recommendation,
  }
}

/** Create the full Fogbinder payload */
let createPayload = (
  results: array<validationResult>,
  ~config: handoffManagerConfig=defaultHandoffConfig,
  ()
): fogbinderPayload => {
  let validatedCitations = results->Js.Array2.filter(r =>
    r.state == #VALID && r.certainty.score >= config.certaintyThreshold
  )

  let invalidCitations = results
    ->Js.Array2.filter(r =>
      r.state != #VALID || r.certainty.score < config.certaintyThreshold
    )
    ->Js.Array2.map(r => {
      citation: r.citation,
      reason: switch r.state {
      | #INCOMPLETE => "INCOMPLETE: Missing required fields"
      | #INVALID => "INVALID: Contains validation errors"
      | #UNCERTAIN => "UNCERTAIN: Requires Fogbinder exploration"
      | #VALID => "Below certainty threshold"
      },
      certaintyScore: r.certainty.score,
    })

  let uncertaintyRegions = detectUncertaintyRegions(results)
  let contradictionHints = if config.autoDetectContradictions {
    detectContradictions(results)
  } else {
    []
  }

  let epistemicSummary = generateEpistemicSummary(results, uncertaintyRegions)

  {
    version: "1.0.0",
    timestamp: Js.Date.make(),
    validatedCitations,
    invalidCitations,
    uncertaintyRegions,
    contradictionHints,
    epistemicSummary,
    handoffConfig: {
      useContradictionDetection: config.autoDetectContradictions,
      useMoodScoring: true,
      useMysteryClustering: config.includeMysteryClustering,
      useFogTrail: true,
      customExplorationPaths: [],
    },
  }
}

/** Determine what NSAI can and cannot validate */
let determineCertaintyBoundary = (
  _results: array<validationResult>
): certaintyBoundary => {
  {
    validated: [
      "Structural completeness of citations",
      "Format consistency (dates, DOIs, URLs, ISBNs)",
      "Presence of required fields per item type",
      "Basic data integrity checks",
    ],
    beyondValidation: [
      "Semantic meaning of citation content",
      "Factual accuracy of claims",
      "Cross-reference verification",
      "Author intent and context",
      "Historical accuracy of dates",
    ],
    handoffRecommendation:
      "NSAI validates structure and consistency. " ++
      "For semantic analysis and uncertainty exploration, use Fogbinder.",
  }
}

/** Export validation results to Fogbinder format */
let exportToFogbinder = (
  results: array<validationResult>,
  ~config: handoffManagerConfig=defaultHandoffConfig,
  ()
): fogbinderExport => {
  {
    format: "nsai-to-fogbinder",
    formatVersion: "1.0.0",
    exported: Js.Date.make(),
    payload: createPayload(results, ~config, ()),
  }
}

/** Convenience function for quick export */
let createFogbinderExport = (results: array<validationResult>): fogbinderExport => {
  exportToFogbinder(results, ~config=defaultHandoffConfig, ())
}
