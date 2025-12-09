/**
 * Atomic.res - Tractarian Data Models
 * "The world is the totality of facts, not of things." - Tractatus 1.1
 *
 * These types represent atomic facts in the Tractarian sense:
 * the smallest units of meaning that can be validated.
 */

/** Creator types following Zotero schema */
type creatorType = [
  | #author
  | #editor
  | #translator
  | #contributor
  | #bookAuthor
  | #seriesEditor
]

/** A creator entry - individual contributor to a work */
type creator = {
  creatorType: creatorType,
  firstName: option<string>,
  lastName: string,
  name: option<string>, // For institutional authors
}

/** Supported item types from Zotero */
type itemType = [
  | #book
  | #bookSection
  | #journalArticle
  | #conferencePaper
  | #thesis
  | #report
  | #webpage
  | #document
  | #preprint
]

/** Tag entry */
type tag = {
  tag: string,
  @as("type") tagType: option<int>,
}

/**
 * AtomicCitation - The fundamental unit of bibliographic data
 * Represents a single, atomic fact about a source.
 */
type atomicCitation = {
  id: string,
  itemType: itemType,
  title: string,
  creators: array<creator>,
  @as("abstract") abstractText: option<string>,
  date: option<string>,
  publisher: option<string>,
  place: option<string>,
  publicationTitle: option<string>,
  volume: option<string>,
  issue: option<string>,
  pages: option<string>,
  @as("DOI") doi: option<string>,
  @as("ISBN") isbn: option<string>,
  @as("ISSN") issn: option<string>,
  url: option<string>,
  accessDate: option<string>,
  tags: array<tag>,
  extra: option<string>,
}

/** Validation state - the epistemic status of a citation */
type validationState = [
  | #VALID       // Structurally complete and consistent
  | #INCOMPLETE  // Missing required fields
  | #INVALID     // Contains errors
  | #UNCERTAIN   // Requires Fogbinder exploration
]

/** Issue severity levels */
type severity = [
  | #error    // Must be fixed
  | #warning  // Should be reviewed
  | #info     // Informational note
]

/** A single validation issue */
type validationIssue = {
  field: string,
  message: string,
  severity: severity,
  requiresUncertaintyNavigation: bool,
}

/** Certainty factors - breakdown of confidence */
type certaintyFactors = {
  structural: float,   // Completeness of required fields
  consistency: float,  // Internal consistency of data
  referential: float,  // Presence of persistent identifiers
}

/** Overall certainty assessment */
type certaintyScore = {
  score: float,               // 0.0 to 1.0
  factors: certaintyFactors,
  calculatedAt: Js.Date.t,
}

/** Complete validation result */
type validationResult = {
  citation: atomicCitation,
  state: validationState,
  issues: array<validationIssue>,
  certainty: certaintyScore,
  validatedAt: Js.Date.t,
}

/** Strictness levels for validation */
type strictnessLevel = [
  | #strict    // Require all fields and identifiers
  | #standard  // Balanced validation
  | #lenient   // Accept imperfect data
]

/** Validator configuration */
type validatorConfig = {
  strictness: strictnessLevel,
  fogbinderThreshold: float,
  requirePersistentIdentifiers: bool,
  minimumValidCertainty: float,
}

/** Default configuration */
let defaultConfig: validatorConfig = {
  strictness: #standard,
  fogbinderThreshold: 0.7,
  requirePersistentIdentifiers: false,
  minimumValidCertainty: 0.5,
}

/** Strict configuration for systematic reviews */
let strictConfig: validatorConfig = {
  strictness: #strict,
  fogbinderThreshold: 0.8,
  requirePersistentIdentifiers: true,
  minimumValidCertainty: 0.7,
}

/** Lenient configuration for grey literature */
let lenientConfig: validatorConfig = {
  strictness: #lenient,
  fogbinderThreshold: 0.5,
  requirePersistentIdentifiers: false,
  minimumValidCertainty: 0.3,
}
