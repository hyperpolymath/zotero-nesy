/**
 * Validator.res - Tractarian Validation Engine
 * "A proposition is a truth-function of elementary propositions." - Tractatus 5
 *
 * The validator applies truth-functional analysis to citations,
 * determining what can be said clearly about their validity.
 */

open Atomic

/** Check if a string is empty or whitespace only */
let isEmpty = (str: option<string>): bool => {
  switch str {
  | None => true
  | Some(s) => Js.String2.trim(s) == ""
  }
}

/** Get required fields for an item type */
let getRequiredFields = (itemType: itemType): array<string> => {
  switch itemType {
  | #book => ["title", "creators", "publisher", "date"]
  | #bookSection => ["title", "creators", "bookTitle", "publisher", "date"]
  | #journalArticle => ["title", "creators", "publicationTitle", "date"]
  | #conferencePaper => ["title", "creators", "conferenceName", "date"]
  | #thesis => ["title", "creators", "university", "date"]
  | #report => ["title", "creators", "institution", "date"]
  | #webpage => ["title", "url", "accessDate"]
  | #document => ["title", "creators"]
  | #preprint => ["title", "creators", "date"]
  }
}

/** Validate date format - accepts YYYY, YYYY-MM, YYYY-MM-DD */
let isValidDate = (dateStr: option<string>): bool => {
  switch dateStr {
  | None => false
  | Some(d) => {
      let yearPattern = %re("/^\d{4}$/")
      let yearMonthPattern = %re("/^\d{4}-\d{2}$/")
      let fullDatePattern = %re("/^\d{4}-\d{2}-\d{2}$/")

      Js.Re.test_(yearPattern, d) ||
      Js.Re.test_(yearMonthPattern, d) ||
      Js.Re.test_(fullDatePattern, d)
    }
  }
}

/** Check if date is unusual (very old or future) */
let isUnusualDate = (dateStr: option<string>): bool => {
  switch dateStr {
  | None => false
  | Some(d) => {
      let year = Js.String2.slice(d, ~from=0, ~to_=4)->Belt.Int.fromString
      switch year {
      | None => false
      | Some(y) => y < 1000 || y > 2100
      }
    }
  }
}

/** Validate DOI format */
let isValidDoi = (doi: option<string>): bool => {
  switch doi {
  | None => false
  | Some(d) => {
      let doiPattern = %re("/^10\.\d{4,}\/[^\s]+$/")
      Js.Re.test_(doiPattern, d)
    }
  }
}

/** Validate ISBN format */
let isValidIsbn = (isbn: option<string>): bool => {
  switch isbn {
  | None => false
  | Some(i) => {
      let cleaned = Js.String2.replaceByRe(i, %re("/[-\s]/g"), "")
      let isbn10 = %re("/^\d{10}$/")
      let isbn13 = %re("/^\d{13}$/")
      Js.Re.test_(isbn10, cleaned) || Js.Re.test_(isbn13, cleaned)
    }
  }
}

/** Validate URL format */
let isValidUrl = (url: option<string>): bool => {
  switch url {
  | None => false
  | Some(u) => {
      let urlPattern = %re("/^https?:\/\/[^\s]+$/")
      Js.Re.test_(urlPattern, u)
    }
  }
}

/** Check if citation has any persistent identifier */
let hasPersistentIdentifier = (citation: atomicCitation): bool => {
  isValidDoi(citation.doi) ||
  isValidIsbn(citation.isbn) ||
  isValidUrl(citation.url)
}

/** Validate structural completeness */
let validateStructure = (
  citation: atomicCitation,
  config: validatorConfig
): (float, array<validationIssue>) => {
  let issues: ref<array<validationIssue>> = ref([])
  let score = ref(1.0)

  // Check creators
  if Js.Array2.length(citation.creators) == 0 {
    issues := Js.Array2.concat(issues.contents, [{
      field: "creators",
      message: "Citation has no creators",
      severity: #error,
      requiresUncertaintyNavigation: false,
    }])
    score := score.contents -. 0.3
  } else {
    // Check each creator has a lastName
    citation.creators->Js.Array2.forEach(creator => {
      if creator.lastName == "" {
        issues := Js.Array2.concat(issues.contents, [{
          field: "creators",
          message: "Creator missing lastName",
          severity: #error,
          requiresUncertaintyNavigation: false,
        }])
        score := score.contents -. 0.1
      }
    })
  }

  // Check required fields based on item type
  switch citation.itemType {
  | #book | #bookSection => {
      if isEmpty(citation.publisher) {
        issues := Js.Array2.concat(issues.contents, [{
          field: "publisher",
          message: "Book missing publisher",
          severity: #warning,
          requiresUncertaintyNavigation: false,
        }])
        score := score.contents -. 0.15
      }
    }
  | #journalArticle => {
      if isEmpty(citation.publicationTitle) {
        issues := Js.Array2.concat(issues.contents, [{
          field: "publicationTitle",
          message: "Journal article missing publication title",
          severity: #warning,
          requiresUncertaintyNavigation: false,
        }])
        score := score.contents -. 0.15
      }
    }
  | #webpage => {
      if !isValidUrl(citation.url) {
        issues := Js.Array2.concat(issues.contents, [{
          field: "url",
          message: "Webpage missing or invalid URL",
          severity: #error,
          requiresUncertaintyNavigation: false,
        }])
        score := score.contents -. 0.3
      }
    }
  | _ => ()
  }

  // Check date for non-webpage items
  if citation.itemType != #webpage {
    if isEmpty(citation.date) {
      issues := Js.Array2.concat(issues.contents, [{
        field: "date",
        message: "Missing publication date",
        severity: #warning,
        requiresUncertaintyNavigation: false,
      }])
      score := score.contents -. 0.1
    }
  }

  (Js.Math.max_float(0.0, score.contents), issues.contents)
}

/** Validate data consistency */
let validateConsistency = (
  citation: atomicCitation,
  _config: validatorConfig
): (float, array<validationIssue>) => {
  let issues: ref<array<validationIssue>> = ref([])
  let score = ref(1.0)

  // Validate date format and range
  switch citation.date {
  | None => ()
  | Some(_) => {
      if !isValidDate(citation.date) {
        issues := Js.Array2.concat(issues.contents, [{
          field: "date",
          message: "Invalid date format",
          severity: #error,
          requiresUncertaintyNavigation: false,
        }])
        score := score.contents -. 0.2
      } else if isUnusualDate(citation.date) {
        issues := Js.Array2.concat(issues.contents, [{
          field: "date",
          message: "Unusual publication year - verify manually",
          severity: #warning,
          requiresUncertaintyNavigation: true,
        }])
        score := score.contents -. 0.1
      }
    }
  }

  // Validate URL if present
  switch citation.url {
  | None => ()
  | Some(_) => {
      if !isValidUrl(citation.url) {
        issues := Js.Array2.concat(issues.contents, [{
          field: "url",
          message: "Invalid URL format",
          severity: #error,
          requiresUncertaintyNavigation: false,
        }])
        score := score.contents -. 0.15
      }
    }
  }

  // Validate DOI if present
  switch citation.doi {
  | None => ()
  | Some(_) => {
      if !isValidDoi(citation.doi) {
        issues := Js.Array2.concat(issues.contents, [{
          field: "DOI",
          message: "Invalid DOI format",
          severity: #error,
          requiresUncertaintyNavigation: false,
        }])
        score := score.contents -. 0.15
      }
    }
  }

  (Js.Math.max_float(0.0, score.contents), issues.contents)
}

/** Validate referential integrity (persistent identifiers) */
let validateReferential = (
  citation: atomicCitation,
  config: validatorConfig
): (float, array<validationIssue>) => {
  let issues: ref<array<validationIssue>> = ref([])
  let score = ref(0.5) // Start at baseline

  // Check for persistent identifiers
  if isValidDoi(citation.doi) {
    score := score.contents +. 0.3
  }

  if isValidIsbn(citation.isbn) {
    score := score.contents +. 0.2
  }

  if isValidUrl(citation.url) {
    score := score.contents +. 0.1
  }

  // Warn if no persistent identifiers (in strict mode, this is an error)
  if !hasPersistentIdentifier(citation) {
    let (severity, requiresNav) = switch config.strictness {
    | #strict => (#error, true)
    | #standard => (#warning, false)
    | #lenient => (#info, false)
    }

    issues := Js.Array2.concat(issues.contents, [{
      field: "identifiers",
      message: "No persistent identifier (DOI, ISBN, or URL)",
      severity,
      requiresUncertaintyNavigation: requiresNav,
    }])

    if config.strictness == #strict {
      score := score.contents -. 0.2
    }
  }

  (Js.Math.min_float(1.0, Js.Math.max_float(0.0, score.contents)), issues.contents)
}

/** Calculate overall certainty score */
let calculateCertainty = (
  structural: float,
  consistency: float,
  referential: float
): certaintyScore => {
  // Weighted average: structural most important, then consistency, then referential
  let score = structural *. 0.4 +. consistency *. 0.35 +. referential *. 0.25

  {
    score,
    factors: {
      structural,
      consistency,
      referential,
    },
    calculatedAt: Js.Date.make(),
  }
}

/** Determine validation state from score and issues */
let determineState = (
  certainty: certaintyScore,
  issues: array<validationIssue>,
  config: validatorConfig
): validationState => {
  let hasErrors = issues->Js.Array2.some(i => i.severity == #error)
  let hasUncertainty = issues->Js.Array2.some(i => i.requiresUncertaintyNavigation)

  if hasErrors {
    if certainty.score < config.minimumValidCertainty {
      #INCOMPLETE
    } else {
      #INVALID
    }
  } else if hasUncertainty && certainty.score < config.fogbinderThreshold {
    #UNCERTAIN
  } else if certainty.score >= config.minimumValidCertainty {
    #VALID
  } else {
    #INCOMPLETE
  }
}

/** Validate a single citation */
let validate = (
  citation: atomicCitation,
  ~config: validatorConfig=defaultConfig,
  ()
): validationResult => {
  let (structuralScore, structuralIssues) = validateStructure(citation, config)
  let (consistencyScore, consistencyIssues) = validateConsistency(citation, config)
  let (referentialScore, referentialIssues) = validateReferential(citation, config)

  let allIssues = Js.Array2.concat(
    Js.Array2.concat(structuralIssues, consistencyIssues),
    referentialIssues
  )

  let certainty = calculateCertainty(structuralScore, consistencyScore, referentialScore)
  let state = determineState(certainty, allIssues, config)

  {
    citation,
    state,
    issues: allIssues,
    certainty,
    validatedAt: Js.Date.make(),
  }
}

/** Validate multiple citations */
let validateBatch = (
  citations: array<atomicCitation>,
  ~config: validatorConfig=defaultConfig,
  ()
): array<validationResult> => {
  citations->Js.Array2.map(c => validate(c, ~config, ()))
}

/** Convenience function for single validation with default config */
let validateCitation = (citation: atomicCitation): validationResult => {
  validate(citation, ~config=defaultConfig, ())
}
