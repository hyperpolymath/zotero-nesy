/**
 * FogbinderInterface.res - Fogbinder Integration Types
 * "Whereof one cannot speak, thereof one must be silent." - Tractatus 7
 *
 * This module defines the handoff protocol between NSAI and Fogbinder.
 * NSAI validates what can be said clearly; Fogbinder explores the rest.
 */

open Atomic

/** Uncertainty region types */
type uncertaintyType = [
  | #noPersistentIdentifiers  // No DOI, ISBN, or URL
  | #temporalAmbiguity        // Date inconsistencies
  | #authorshipQuestion       // Author attribution unclear
  | #lowCertainty             // Below threshold certainty
]

/** An uncertainty region for Fogbinder exploration */
type uncertaintyRegion = {
  id: string,
  @as("type") regionType: uncertaintyType,
  citationIds: array<string>,
  description: string,
  suggestedExploration: string,
}

/** Contradiction hint types */
type contradictionType = [
  | #metadata     // Conflicting metadata
  | #temporal     // Date conflicts
  | #authorship   // Author attribution conflicts
]

/** A hint about potential contradictions */
type contradictionHint = {
  @as("type") hintType: contradictionType,
  citationIds: array<string>,
  description: string,
  requiresSemanticAnalysis: bool,
}

/** Epistemic gap types */
type epistemicGapType = [
  | #incompleteMetadata   // Missing fields
  | #missingIdentifiers   // No persistent IDs
  | #temporalUncertainty  // Date issues
  | #authorshipAmbiguity  // Author unclear
]

/** An epistemic gap identified by validation */
type epistemicGap = {
  @as("type") gapType: epistemicGapType,
  affectedCitations: int,
  description: string,
  explorableInFogbinder: bool,
}

/** Summary of epistemic state */
type epistemicSummary = {
  totalCitations: int,
  validatedCount: int,
  uncertainCount: int,
  invalidCount: int,
  overallCertainty: float,
  epistemicGaps: array<epistemicGap>,
  recommendation: string,
}

/** Fogbinder handoff configuration */
type handoffConfig = {
  useContradictionDetection: bool,
  useMoodScoring: bool,
  useMysteryClustering: bool,  // Fixed: camelCase
  useFogTrail: bool,
  customExplorationPaths: array<string>,
}

/** Default handoff configuration */
let defaultHandoffConfig: handoffConfig = {
  useContradictionDetection: true,
  useMoodScoring: true,
  useMysteryClustering: false,
  useFogTrail: true,
  customExplorationPaths: [],
}

/** Invalid citation entry for Fogbinder */
type invalidCitationEntry = {
  citation: atomicCitation,
  reason: string,
  certaintyScore: float,
}

/** Complete Fogbinder payload */
type fogbinderPayload = {
  version: string,
  timestamp: Js.Date.t,
  validatedCitations: array<validationResult>,
  invalidCitations: array<invalidCitationEntry>,
  uncertaintyRegions: array<uncertaintyRegion>,
  contradictionHints: array<contradictionHint>,
  epistemicSummary: epistemicSummary,
  handoffConfig: handoffConfig,
}

/** Certainty boundary - what NSAI can and cannot validate */
type certaintyBoundary = {
  validated: array<string>,      // Things NSAI can verify
  beyondValidation: array<string>,  // Things requiring Fogbinder
  handoffRecommendation: string,
}

/** Export package format */
type fogbinderExport = {
  format: string,
  formatVersion: string,
  exported: Js.Date.t,
  payload: fogbinderPayload,
}
