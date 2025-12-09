/**
 * NSAI → Fogbinder Handoff Module
 *
 * "The ladder must be thrown away after one has climbed up it."
 * (Tractatus 6.54)
 *
 * NSAI validates what can be validated, then hands the rest
 * to Fogbinder for exploration.
 */

import type { ValidationResult, AtomicCitation, CitationRelation } from '../types/atomic';
import type {
  FogbinderPayload,
  ValidatedCitation,
  InvalidCitation,
  UncertaintyRegion,
  ContradictionHint,
  EpistemicSummary,
  EpistemicGap,
  CertaintyBoundary,
  NSAIExport,
} from '../types/fogbinder-interface';

/**
 * Certainty threshold configuration
 */
const CERTAINTY_THRESHOLDS = {
  HIGH: 0.7,    // >= 0.7: NSAI handles
  MEDIUM: 0.4,  // 0.4-0.7: Ambiguous
  LOW: 0.4,     // < 0.4: Hand to Fogbinder
};

/**
 * Fogbinder Handoff Manager
 *
 * Decides what NSAI keeps and what goes to Fogbinder
 */
export class FogbinderHandoffManager {
  /**
   * Create a complete Fogbinder payload from validation results
   */
  createPayload(
    validationResults: ValidationResult[],
    relations?: CitationRelation[]
  ): FogbinderPayload {
    // Partition by certainty
    const validated: ValidatedCitation[] = [];
    const invalid: InvalidCitation[] = [];

    for (const result of validationResults) {
      if (result.certainty.score >= CERTAINTY_THRESHOLDS.HIGH &&
          result.state === 'VALID') {
        validated.push(this.createValidatedCitation(result));
      } else {
        invalid.push(this.createInvalidCitation(result));
      }
    }

    // Identify uncertainty regions
    const uncertaintyRegions = this.identifyUncertaintyRegions(
      validationResults,
      relations
    );

    // Detect potential contradictions
    const contradictionHints = this.detectContradictions(
      validationResults,
      relations
    );

    // Generate epistemic summary
    const epistemicSummary = this.createEpistemicSummary(
      validationResults,
      uncertaintyRegions
    );

    return {
      version: '1.0.0',
      timestamp: new Date(),
      validatedCitations: validated,
      invalidCitations: invalid,
      uncertaintyRegions,
      contradictionHints,
      epistemicSummary,
    };
  }

  /**
   * Create a validated citation entry
   */
  private createValidatedCitation(result: ValidationResult): ValidatedCitation {
    const certainties: string[] = [];

    // What can we say with certainty?
    if (result.certainty.factors.structural >= 0.9) {
      certainties.push('Structurally complete');
    }

    if (result.certainty.factors.consistency >= 0.9) {
      certainties.push('Internally consistent');
    }

    if (result.certainty.factors.referential >= 0.7) {
      certainties.push('Has persistent identifier');
    }

    if (result.citation.DOI) {
      certainties.push(`DOI: ${result.citation.DOI}`);
    }

    return {
      citation: result.citation,
      validationResult: result,
      certainty: result.certainty.score,
      certainties,
    };
  }

  /**
   * Create an invalid/uncertain citation entry
   */
  private createInvalidCitation(result: ValidationResult): InvalidCitation {
    const uncertainties: string[] = [];

    // What's uncertain?
    const uncertainIssues = result.issues.filter(
      i => i.requiresUncertaintyNavigation
    );

    for (const issue of uncertainIssues) {
      uncertainties.push(issue.message);
    }

    if (result.certainty.score < CERTAINTY_THRESHOLDS.LOW) {
      uncertainties.push('Low confidence in validation');
    }

    if (result.state === 'UNCERTAIN') {
      uncertainties.push('Contains ambiguities');
    }

    let reason = result.state;
    if (result.issues.length > 0) {
      reason += `: ${result.issues[0].message}`;
    }

    return {
      citation: result.citation,
      validationResult: result,
      reason,
      uncertainties,
    };
  }

  /**
   * Identify regions of uncertainty for Fogbinder exploration
   */
  private identifyUncertaintyRegions(
    results: ValidationResult[],
    relations?: CitationRelation[]
  ): UncertaintyRegion[] {
    const regions: UncertaintyRegion[] = [];

    // Region 1: Citations missing persistent identifiers
    const noPersistentId = results.filter(r =>
      !r.citation.DOI && !r.citation.ISBN && !r.citation.url
    );

    if (noPersistentId.length > 0) {
      regions.push({
        id: 'no-persistent-identifiers',
        type: 'structural',
        citationIds: noPersistentId.map(r => r.citation.id),
        description: `${noPersistentId.length} citations lack persistent identifiers`,
        suggestedExploration: {
          useMysteryClustering: true,
        },
        uncertaintyLevel: 0.6,
      });
    }

    // Region 2: Temporal uncertainties (unusual dates)
    const temporalUncertain = results.filter(r => {
      const year = r.citation.date
        ? parseInt(r.citation.date.substring(0, 4))
        : null;
      return year && (year < 1800 || year > new Date().getFullYear());
    });

    if (temporalUncertain.length > 0) {
      regions.push({
        id: 'temporal-uncertainties',
        type: 'temporal',
        citationIds: temporalUncertain.map(r => r.citation.id),
        description: 'Citations with unusual publication dates',
        suggestedExploration: {
          useMoodScoring: true,
          useFogTrailVisualization: true,
        },
        uncertaintyLevel: 0.5,
      });
    }

    // Region 3: Low certainty scores
    const lowCertainty = results.filter(r =>
      r.certainty.score < CERTAINTY_THRESHOLDS.LOW
    );

    if (lowCertainty.length > 0) {
      regions.push({
        id: 'low-certainty-region',
        type: 'semantic',
        citationIds: lowCertainty.map(r => r.citation.id),
        description: `${lowCertainty.length} citations with low validation certainty`,
        suggestedExploration: {
          useContradictionDetection: true,
          useMoodScoring: true,
          useMysteryClustering: true,
          useFogTrailVisualization: true,
        },
        uncertaintyLevel: 0.8,
      });
    }

    // Region 4: Relational uncertainties
    if (relations) {
      const contradictoryRelations = relations.filter(r => r.isContradiction);
      if (contradictoryRelations.length > 0) {
        const involvedIds = new Set<string>();
        contradictoryRelations.forEach(r => {
          involvedIds.add(r.source);
          involvedIds.add(r.target);
        });

        regions.push({
          id: 'contradictory-relations',
          type: 'relational',
          citationIds: Array.from(involvedIds),
          description: 'Citations with contradictory relationships',
          suggestedExploration: {
            useContradictionDetection: true,
            useFogTrailVisualization: true,
          },
          uncertaintyLevel: 0.9,
        });
      }
    }

    return regions;
  }

  /**
   * Detect potential contradictions (structural only)
   *
   * NSAI detects *metadata* contradictions.
   * Fogbinder detects *semantic* contradictions.
   */
  private detectContradictions(
    results: ValidationResult[],
    relations?: CitationRelation[]
  ): ContradictionHint[] {
    const hints: ContradictionHint[] = [];

    // Check for duplicate titles with different authors
    const titleMap = new Map<string, ValidationResult[]>();
    for (const result of results) {
      const title = result.citation.title.toLowerCase().trim();
      if (!titleMap.has(title)) {
        titleMap.set(title, []);
      }
      titleMap.get(title)!.push(result);
    }

    for (const [title, citations] of titleMap) {
      if (citations.length > 1) {
        // Check if authors differ
        for (let i = 0; i < citations.length; i++) {
          for (let j = i + 1; j < citations.length; j++) {
            const authorsA = citations[i].citation.creators
              .map(c => c.lastName)
              .join(',');
            const authorsB = citations[j].citation.creators
              .map(c => c.lastName)
              .join(',');

            if (authorsA !== authorsB) {
              hints.push({
                citationA: citations[i].citation.id,
                citationB: citations[j].citation.id,
                type: 'authorship',
                description: `Same title "${title}" but different authors`,
                confidence: 0.7,
                requiresSemanticAnalysis: true,
              });
            }
          }
        }
      }
    }

    // Check for same author + title but different years
    const authorTitleMap = new Map<string, ValidationResult[]>();
    for (const result of results) {
      const key = result.citation.creators
        .map(c => c.lastName)
        .join(',') + '::' + result.citation.title.toLowerCase();

      if (!authorTitleMap.has(key)) {
        authorTitleMap.set(key, []);
      }
      authorTitleMap.get(key)!.push(result);
    }

    for (const [key, citations] of authorTitleMap) {
      if (citations.length > 1) {
        const years = citations
          .map(c => c.citation.date?.substring(0, 4))
          .filter(Boolean);

        if (new Set(years).size > 1) {
          for (let i = 0; i < citations.length; i++) {
            for (let j = i + 1; j < citations.length; j++) {
              hints.push({
                citationA: citations[i].citation.id,
                citationB: citations[j].citation.id,
                type: 'temporal',
                description: 'Same author and title but different publication years',
                confidence: 0.8,
                requiresSemanticAnalysis: false,  // Likely metadata error
              });
            }
          }
        }
      }
    }

    // Add relation-based contradictions
    if (relations) {
      for (const rel of relations) {
        if (rel.isContradiction) {
          hints.push({
            citationA: rel.source,
            citationB: rel.target,
            type: 'semantic-hint',
            description: 'Marked as contradictory in citation graph',
            confidence: rel.confidence,
            requiresSemanticAnalysis: true,
          });
        }
      }
    }

    return hints;
  }

  /**
   * Create epistemic summary of the corpus
   */
  private createEpistemicSummary(
    results: ValidationResult[],
    uncertaintyRegions: UncertaintyRegion[]
  ): EpistemicSummary {
    const totalCitations = results.length;
    const validatedCount = results.filter(r =>
      r.certainty.score >= CERTAINTY_THRESHOLDS.HIGH && r.state === 'VALID'
    ).length;
    const uncertainCount = totalCitations - validatedCount;

    const overallCertainty = validatedCount / Math.max(totalCitations, 1);

    // Identify epistemic gaps
    const gaps: EpistemicGap[] = [];

    // Gap 1: Missing metadata
    const incompleteMetadata = results.filter(r => r.state === 'INCOMPLETE');
    if (incompleteMetadata.length > 0) {
      gaps.push({
        type: 'incomplete-metadata',
        severity: incompleteMetadata.length > totalCitations * 0.3 ? 'high' : 'medium',
        description: `${incompleteMetadata.length} citations have incomplete metadata`,
        suggestion: 'Add missing required fields (authors, dates, publishers)',
        explorableInFogbinder: false,
      });
    }

    // Gap 2: No persistent identifiers
    const noPersistentId = results.filter(r =>
      !r.citation.DOI && !r.citation.ISBN
    );
    if (noPersistentId.length > totalCitations * 0.5) {
      gaps.push({
        type: 'missing-citations',
        severity: 'medium',
        description: `${noPersistentId.length} citations lack persistent identifiers`,
        suggestion: 'Add DOIs or ISBNs where possible for better tracking',
        explorableInFogbinder: true,
      });
    }

    // Gap 3: High uncertainty regions
    const highUncertainty = uncertaintyRegions.filter(r =>
      r.uncertaintyLevel > 0.7
    );
    if (highUncertainty.length > 0) {
      gaps.push({
        type: 'ambiguous-sources',
        severity: 'high',
        description: `${highUncertainty.length} uncertainty regions detected`,
        suggestion: 'Explore these regions in Fogbinder',
        explorableInFogbinder: true,
      });
    }

    // Generate recommendation
    let recommendation: string;
    if (overallCertainty >= 0.8) {
      recommendation = 'Bibliography is well-structured. Minor uncertainties can be explored in Fogbinder.';
    } else if (overallCertainty >= 0.5) {
      recommendation = 'Bibliography needs improvement. Address incomplete citations, then explore uncertainties in Fogbinder.';
    } else {
      recommendation = 'Bibliography requires significant work. Complete missing metadata before exploring in Fogbinder.';
    }

    return {
      totalCitations,
      validatedCount,
      uncertainCount,
      overallCertainty: Math.round(overallCertainty * 100) / 100,
      epistemicGaps: gaps,
      recommendation,
    };
  }

  /**
   * Determine the certainty boundary: what NSAI can vs cannot validate
   */
  determineCertaintyBoundary(results: ValidationResult[]): CertaintyBoundary {
    const validated: string[] = [
      'Structural completeness of citations',
      'Metadata format consistency',
      'Required field presence',
      'Date format validation',
      'URL format validation',
      'DOI/ISBN format checking',
    ];

    const beyondValidation: string[] = [
      'Semantic meaning of citation content',
      'Contradictions between source claims',
      'Epistemic quality of sources',
      'Mood/tone of source material',
      'Mystery clustering of uncertain regions',
      'FogTrail visualization of ambiguity',
    ];

    const uncertainCount = results.filter(r =>
      r.certainty.score < CERTAINTY_THRESHOLDS.HIGH
    ).length;

    let handoffRecommendation: string;
    if (uncertainCount === 0) {
      handoffRecommendation = 'All citations validated. No Fogbinder exploration required.';
    } else if (uncertainCount < results.length * 0.2) {
      handoffRecommendation = `${uncertainCount} citations require Fogbinder exploration for uncertainty resolution.`;
    } else {
      handoffRecommendation = `Significant uncertainty detected (${uncertainCount} citations). Recommend comprehensive Fogbinder analysis.`;
    }

    return {
      validated,
      beyondValidation,
      handoffRecommendation,
    };
  }

  /**
   * Export complete NSAI→Fogbinder package
   */
  exportToFogbinder(
    results: ValidationResult[],
    relations?: CitationRelation[]
  ): NSAIExport {
    return {
      format: 'nsai-to-fogbinder',
      formatVersion: '1.0.0',
      exported: new Date(),
      payload: this.createPayload(results, relations),
    };
  }
}

/**
 * Convenience function for creating Fogbinder export
 */
export function createFogbinderExport(
  validationResults: ValidationResult[],
  relations?: CitationRelation[]
): NSAIExport {
  const manager = new FogbinderHandoffManager();
  return manager.exportToFogbinder(validationResults, relations);
}
