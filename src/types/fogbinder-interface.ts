/**
 * NSAI → Fogbinder Interface
 *
 * "Whereof one cannot validate, thereof one must explore."
 *
 * This defines the shared ontology between NSAI (certainty) and
 * Fogbinder (uncertainty). NSAI validates what can be validated
 * formally; everything else goes to Fogbinder for exploration.
 */

import type { AtomicCitation, ValidationResult, CitationRelation } from './atomic';

/**
 * The complete payload NSAI sends to Fogbinder
 */
export interface FogbinderPayload {
  /** Format version for compatibility */
  version: '1.0.0';

  /** When this payload was generated */
  timestamp: Date;

  /** Validated citations: the certain foundation */
  validatedCitations: ValidatedCitation[];

  /** Citations that failed validation */
  invalidCitations: InvalidCitation[];

  /** Regions of uncertainty requiring Fogbinder exploration */
  uncertaintyRegions: UncertaintyRegion[];

  /** Potential contradictions detected */
  contradictionHints: ContradictionHint[];

  /** Overall epistemic assessment */
  epistemicSummary: EpistemicSummary;
}

/**
 * A citation that passed NSAI validation
 */
export interface ValidatedCitation {
  citation: AtomicCitation;
  validationResult: ValidationResult;

  /** Certainty score (should be > 0.7 for validated citations) */
  certainty: number;

  /** What NSAI can say with certainty about this citation */
  certainties: string[];
}

/**
 * A citation that failed validation or is ambiguous
 */
export interface InvalidCitation {
  citation: AtomicCitation;
  validationResult: ValidationResult;

  /** Why it failed */
  reason: string;

  /** What's uncertain or incomplete */
  uncertainties: string[];
}

/**
 * A region of epistemic uncertainty that Fogbinder should explore
 *
 * This corresponds to Fogbinder's "mystery clustering" feature
 */
export interface UncertaintyRegion {
  id: string;
  type: 'structural' | 'semantic' | 'relational' | 'temporal';

  /** Citations involved in this uncertain region */
  citationIds: string[];

  /** Why is this uncertain? */
  description: string;

  /** Suggested Fogbinder features to use */
  suggestedExploration: {
    useContradictionDetection?: boolean;
    useMoodScoring?: boolean;
    useMystery Clustering?: boolean;
    useFogTrailVisualization?: boolean;
  };

  /** Uncertainty score (0.0 = certain, 1.0 = complete fog) */
  uncertaintyLevel: number;
}

/**
 * A potential contradiction between citations
 *
 * NSAI can detect *structural* contradictions (e.g., same author,
 * different publication years for same title). Fogbinder detects
 * *semantic* contradictions (conflicting claims).
 */
export interface ContradictionHint {
  citationA: string;  // ID
  citationB: string;  // ID

  /** Type of contradiction */
  type: 'metadata' | 'temporal' | 'authorship' | 'semantic-hint';

  /** What contradicts? */
  description: string;

  /** Confidence that this is a real contradiction (0.0-1.0) */
  confidence: number;

  /** Should Fogbinder investigate further? */
  requiresSemanticAnalysis: boolean;
}

/**
 * Overall epistemic summary of the research corpus
 */
export interface EpistemicSummary {
  /** Total citations analyzed */
  totalCitations: number;

  /** How many passed validation */
  validatedCount: number;

  /** How many failed or are uncertain */
  uncertainCount: number;

  /** Overall certainty ratio (0.0-1.0) */
  overallCertainty: number;

  /** Epistemic gaps: what's missing or unknown? */
  epistemicGaps: EpistemicGap[];

  /** Recommendation for researcher */
  recommendation: string;
}

/**
 * An epistemic gap in the research corpus
 *
 * This tells the researcher (and Fogbinder) what's missing or unclear
 */
export interface EpistemicGap {
  type: 'missing-citations' | 'incomplete-metadata' | 'temporal-gap' |
        'contradictory-claims' | 'ambiguous-sources';

  severity: 'low' | 'medium' | 'high' | 'critical';

  description: string;

  /** What would fill this gap? */
  suggestion: string;

  /** Should this be explored in Fogbinder? */
  explorableInFogbinder: boolean;
}

/**
 * NSAI's certainty boundary: what we can and cannot validate
 *
 * This is the "ladder" from Tractatus 6.54:
 * NSAI shows what can be validated, then points beyond itself
 * to what requires Fogbinder exploration.
 */
export interface CertaintyBoundary {
  /** What NSAI confidently validated */
  validated: string[];  // List of validated aspects

  /** What NSAI cannot validate (requires Fogbinder) */
  beyondValidation: string[];  // List of uncertain aspects

  /** The handoff point */
  handoffRecommendation: string;
}

/**
 * Mood hint: NSAI can detect *formal* tone indicators
 * (e.g., abstract sentiment words), but Fogbinder performs
 * full mood scoring
 */
export interface MoodHint {
  citationId: string;

  /** Formal indicators of mood/tone */
  indicators: {
    abstractSentiment?: 'positive' | 'negative' | 'neutral';
    titleTone?: 'assertive' | 'questioning' | 'exploratory';
  };

  /** Confidence in these hints (usually low - Fogbinder does better) */
  confidence: number;

  /** Should Fogbinder perform full mood analysis? */
  requiresFogbinderMoodScoring: boolean;
}

/**
 * Export format: NSAI → Fogbinder
 */
export interface NSAIExport {
  format: 'nsai-to-fogbinder';
  formatVersion: '1.0.0';
  exported: Date;
  payload: FogbinderPayload;
}

/**
 * Import format: Fogbinder → NSAI
 * (For future bidirectional communication)
 */
export interface FogbinderFeedback {
  format: 'fogbinder-to-nsai';
  formatVersion: '1.0.0';
  timestamp: Date;

  /** What Fogbinder discovered about uncertainties */
  discoveries: {
    resolvedContradictions?: ContradictionHint[];
    mysteriesClustered?: string[];  // Mystery IDs
    moodAnalysis?: MoodHint[];
  };

  /** Should NSAI re-validate anything based on Fogbinder findings? */
  revalidationRequests?: string[];  // Citation IDs
}
