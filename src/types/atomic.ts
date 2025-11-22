/**
 * Tractarian Atomic Facts: Core data structures for NSAI
 *
 * Based on Wittgenstein's Tractatus Logico-Philosophicus:
 * "The world is the totality of facts, not of things." (1.1)
 *
 * Each citation is an atomic fact with logical structure.
 */

import { z } from 'zod';

/**
 * Atomic Citation: The fundamental unit of bibliographic reality
 *
 * A citation "pictures" a source (Tractatus 2.1-2.2)
 * It has logical form that can be validated
 */
export const AtomicCitationSchema = z.object({
  // Essential properties (required for logical completeness)
  id: z.string().uuid().describe('Unique identifier'),
  itemType: z.enum([
    'book', 'bookSection', 'journalArticle', 'conferencePaper',
    'thesis', 'webpage', 'manuscript', 'report', 'patent'
  ]).describe('The kind of thing this citation is'),

  // Core bibliographic atoms
  title: z.string().min(1).describe('What is said'),
  creators: z.array(z.object({
    creatorType: z.enum(['author', 'editor', 'contributor', 'translator']),
    firstName: z.string().optional(),
    lastName: z.string(),
  })).min(1).describe('Who says it'),

  date: z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/).optional()
    .describe('When it was said (ISO 8601 partial)'),

  // Publication context
  publicationTitle: z.string().optional().describe('Where it was said'),
  publisher: z.string().optional().describe('Who published it'),
  place: z.string().optional().describe('Where it was published'),

  // Unique identifiers (referential integrity)
  DOI: z.string().optional().describe('Digital Object Identifier'),
  ISBN: z.string().optional().describe('International Standard Book Number'),
  ISSN: z.string().optional().describe('International Standard Serial Number'),
  url: z.string().url().optional().describe('Web location'),

  // Additional metadata
  pages: z.string().optional().describe('Page range'),
  volume: z.string().optional().describe('Volume number'),
  issue: z.string().optional().describe('Issue number'),
  edition: z.string().optional().describe('Edition'),

  // Abstract/notes (what it's about)
  abstractNote: z.string().optional().describe('Summary of content'),
  tags: z.array(z.string()).default([]).describe('Subject classifications'),

  // Extra field for additional data
  extra: z.string().optional().describe('Additional information'),
});

export type AtomicCitation = z.infer<typeof AtomicCitationSchema>;

/**
 * Validation State: Truth-functional analysis
 *
 * Tractatus 4.2: "The sense of a proposition is its agreement
 * and disagreement with possibilities of existence and non-existence
 * of states of affairs."
 */
export enum ValidationState {
  /** Structurally complete and logically consistent */
  VALID = 'VALID',

  /** Missing required fields */
  INCOMPLETE = 'INCOMPLETE',

  /** Contains logical inconsistencies */
  INCONSISTENT = 'INCONSISTENT',

  /** Ambiguous - cannot determine validity formally */
  UNCERTAIN = 'UNCERTAIN',
}

/**
 * Certainty Score: How confident are we in validation?
 *
 * High certainty (0.8-1.0): NSAI can validate this
 * Low certainty (0.0-0.3): Hand to Fogbinder for exploration
 */
export interface CertaintyScore {
  score: number;  // 0.0 to 1.0
  factors: {
    structural: number;    // Field completeness
    consistency: number;   // Internal coherence
    referential: number;   // External identifiers (DOI, ISBN)
  };
  reasoning: string;  // Why this score?
}

/**
 * Validation Result: The output of formal verification
 */
export interface ValidationResult {
  citation: AtomicCitation;
  state: ValidationState;
  certainty: CertaintyScore;
  issues: ValidationIssue[];
  timestamp: Date;
}

/**
 * Validation Issue: What's wrong with this citation?
 */
export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  field?: string;
  message: string;
  suggestion?: string;

  /** Does this issue require Fogbinder exploration? */
  requiresUncertaintyNavigation: boolean;
}

/**
 * Molecular Fact: Multiple citations related logically
 *
 * Tractatus 4.27: "Concerning the existence and non-existence
 * of n states of affairs, there are K_n = Σ(n over v) possibilities"
 */
export interface Bibliography {
  citations: AtomicCitation[];
  relationships: CitationRelation[];
  metadata: {
    created: Date;
    updated: Date;
    source: string;  // Where did this bibliography come from?
  };
}

/**
 * Citation Relation: Logical connections between citations
 */
export interface CitationRelation {
  type: 'cites' | 'citedBy' | 'relatedTo' | 'contradicts' | 'supports';
  source: string;  // Citation ID
  target: string;  // Citation ID
  confidence: number;  // 0.0 to 1.0

  /** If contradiction detected, hand to Fogbinder */
  isContradiction: boolean;
}
