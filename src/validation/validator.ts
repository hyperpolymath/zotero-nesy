/**
 * Core Validation Engine: Truth-Functional Analysis
 *
 * Implements Tractarian logical validation:
 * "A proposition is a truth-function of elementary propositions."
 * (Tractatus 5)
 *
 * We validate the logical structure of citations, not their semantic truth.
 */

import type {
  AtomicCitation,
  ValidationResult,
  ValidationState,
  ValidationIssue,
  CertaintyScore,
} from '../types/atomic';

/**
 * Validation strictness levels
 *
 * - 'strict': Require persistent identifiers, harsh certainty scoring
 * - 'standard': Default behavior, balanced validation
 * - 'lenient': Accept more incomplete data, generous scoring
 */
export type StrictnessLevel = 'strict' | 'standard' | 'lenient';

/**
 * Validator configuration
 */
export interface ValidatorConfig {
  /** Strictness level for validation (default: 'standard') */
  strictness: StrictnessLevel;

  /** Certainty threshold for Fogbinder handoff (default: 0.7) */
  fogbinderThreshold: number;

  /** Require persistent identifiers for VALID state (default: false) */
  requirePersistentIdentifiers: boolean;

  /** Minimum certainty for VALID state (default: 0.0) */
  minimumValidCertainty: number;
}

/**
 * Default configuration
 */
export const DEFAULT_CONFIG: ValidatorConfig = {
  strictness: 'standard',
  fogbinderThreshold: 0.7,
  requirePersistentIdentifiers: false,
  minimumValidCertainty: 0.0,
};

/**
 * Strictness presets
 */
export const STRICTNESS_PRESETS: Record<StrictnessLevel, Partial<ValidatorConfig>> = {
  strict: {
    requirePersistentIdentifiers: true,
    fogbinderThreshold: 0.8,
    minimumValidCertainty: 0.5,
  },
  standard: {
    requirePersistentIdentifiers: false,
    fogbinderThreshold: 0.7,
    minimumValidCertainty: 0.0,
  },
  lenient: {
    requirePersistentIdentifiers: false,
    fogbinderThreshold: 0.5,
    minimumValidCertainty: 0.0,
  },
};

/**
 * Required fields by item type (logical completeness requirements)
 */
const REQUIRED_FIELDS: Record<string, string[]> = {
  book: ['title', 'creators', 'publisher', 'date'],
  bookSection: ['title', 'creators', 'publicationTitle', 'date'],
  journalArticle: ['title', 'creators', 'publicationTitle', 'date'],
  conferencePaper: ['title', 'creators', 'date'],
  thesis: ['title', 'creators', 'date'],
  webpage: ['title', 'url', 'date'],
  manuscript: ['title', 'creators'],
  report: ['title', 'creators', 'date'],
  patent: ['title', 'creators', 'date'],
};

/**
 * Main validator class
 *
 * Supports configurable strictness levels for different use cases.
 */
export class TractarianValidator {
  private config: ValidatorConfig;

  constructor(config: Partial<ValidatorConfig> = {}) {
    // Apply strictness preset first, then user overrides
    const strictness = config.strictness || DEFAULT_CONFIG.strictness;
    const preset = STRICTNESS_PRESETS[strictness];

    this.config = {
      ...DEFAULT_CONFIG,
      ...preset,
      ...config,
    };
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<ValidatorConfig> {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<ValidatorConfig>): void {
    if (config.strictness && config.strictness !== this.config.strictness) {
      const preset = STRICTNESS_PRESETS[config.strictness];
      this.config = { ...this.config, ...preset, ...config };
    } else {
      this.config = { ...this.config, ...config };
    }
  }

  /**
   * Validate an atomic citation
   *
   * Tractatus 4.2: "The sense of a proposition is its agreement and
   * disagreement with possibilities of existence and non-existence
   * of states of affairs."
   */
  validate(citation: AtomicCitation): ValidationResult {
    const issues: ValidationIssue[] = [];

    // 1. Structural validation (logical form)
    const structuralIssues = this.validateStructure(citation);
    issues.push(...structuralIssues);

    // 2. Consistency validation (internal coherence)
    const consistencyIssues = this.validateConsistency(citation);
    issues.push(...consistencyIssues);

    // 3. Referential validation (external identifiers)
    const referentialIssues = this.validateReferences(citation);
    issues.push(...referentialIssues);

    // 4. Determine validation state
    const state = this.determineState(issues);

    // 5. Calculate certainty score
    const certainty = this.calculateCertainty(citation, issues);

    return {
      citation,
      state,
      certainty,
      issues,
      timestamp: new Date(),
    };
  }

  /**
   * Validate structural completeness
   *
   * Does this citation have the required logical components?
   */
  private validateStructure(citation: AtomicCitation): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const required = REQUIRED_FIELDS[citation.itemType] || [];

    for (const field of required) {
      const value = citation[field as keyof AtomicCitation];

      if (!value || (Array.isArray(value) && value.length === 0)) {
        issues.push({
          severity: 'error',
          field,
          message: `Required field "${field}" is missing`,
          suggestion: `Add ${field} to complete citation structure`,
          requiresUncertaintyNavigation: false,
        });
      }
    }

    // Creators validation (must have at least one)
    if (!citation.creators || citation.creators.length === 0) {
      issues.push({
        severity: 'error',
        field: 'creators',
        message: 'Citation must have at least one creator',
        suggestion: 'Add author, editor, or contributor',
        requiresUncertaintyNavigation: false,
      });
    }

    // Title validation
    if (!citation.title || citation.title.trim().length === 0) {
      issues.push({
        severity: 'error',
        field: 'title',
        message: 'Title cannot be empty',
        suggestion: 'Add a title for this citation',
        requiresUncertaintyNavigation: false,
      });
    }

    return issues;
  }

  /**
   * Validate internal consistency
   *
   * Are the citation's components logically coherent?
   */
  private validateConsistency(citation: AtomicCitation): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // Date consistency
    if (citation.date) {
      const datePattern = /^(\d{4})(-\d{2}(-\d{2})?)?$/;
      if (!datePattern.test(citation.date)) {
        issues.push({
          severity: 'error',
          field: 'date',
          message: `Invalid date format: "${citation.date}"`,
          suggestion: 'Use ISO 8601 format (YYYY, YYYY-MM, or YYYY-MM-DD)',
          requiresUncertaintyNavigation: false,
        });
      } else {
        // Check year is reasonable (1000-2100)
        const year = parseInt(citation.date.substring(0, 4));
        if (year < 1000 || year > 2100) {
          issues.push({
            severity: 'warning',
            field: 'date',
            message: `Unusual publication year: ${year}`,
            suggestion: 'Verify publication date is correct',
            requiresUncertaintyNavigation: true,  // Hand to Fogbinder
          });
        }
      }
    }

    // Creator consistency
    for (const creator of citation.creators) {
      if (!creator.lastName || creator.lastName.trim().length === 0) {
        issues.push({
          severity: 'error',
          field: 'creators',
          message: 'Creator missing lastName',
          suggestion: 'Add lastName for all creators',
          requiresUncertaintyNavigation: false,
        });
      }
    }

    // URL consistency
    if (citation.url) {
      try {
        new URL(citation.url);
      } catch {
        issues.push({
          severity: 'error',
          field: 'url',
          message: 'Invalid URL format',
          suggestion: 'Use valid URL (https://example.com)',
          requiresUncertaintyNavigation: false,
        });
      }
    }

    // Pages consistency
    if (citation.pages) {
      const pagesPattern = /^\d+(-\d+)?$/;
      if (!pagesPattern.test(citation.pages.replace(/\s/g, ''))) {
        issues.push({
          severity: 'warning',
          field: 'pages',
          message: 'Unusual page format',
          suggestion: 'Use format like "123" or "123-456"',
          requiresUncertaintyNavigation: false,
        });
      }
    }

    return issues;
  }

  /**
   * Validate referential integrity
   *
   * Do external identifiers (DOI, ISBN) exist and are they valid?
   */
  private validateReferences(citation: AtomicCitation): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // DOI format validation
    if (citation.DOI) {
      const doiPattern = /^10\.\d{4,}\/\S+$/;
      if (!doiPattern.test(citation.DOI)) {
        issues.push({
          severity: 'warning',
          field: 'DOI',
          message: 'DOI format may be invalid',
          suggestion: 'DOI should start with "10." followed by registrant/suffix',
          requiresUncertaintyNavigation: false,
        });
      }
    }

    // ISBN validation (basic)
    if (citation.ISBN) {
      const isbnClean = citation.ISBN.replace(/[-\s]/g, '');
      if (isbnClean.length !== 10 && isbnClean.length !== 13) {
        issues.push({
          severity: 'warning',
          field: 'ISBN',
          message: 'ISBN should be 10 or 13 digits',
          suggestion: 'Verify ISBN is correct',
          requiresUncertaintyNavigation: false,
        });
      }
    }

    // If no persistent identifier (DOI, ISBN), that's a warning
    // Behavior depends on config.requirePersistentIdentifiers:
    // - true (strict mode): Mark as requiring uncertainty navigation
    // - false (standard/lenient): Lowers certainty but stays VALID
    if (!citation.DOI && !citation.ISBN && !citation.url &&
        citation.itemType !== 'manuscript') {
      issues.push({
        severity: this.config.requirePersistentIdentifiers ? 'error' : 'warning',
        field: 'identifiers',
        message: 'No persistent identifier (DOI, ISBN, or URL)',
        suggestion: 'Add DOI or ISBN if available',
        requiresUncertaintyNavigation: this.config.requirePersistentIdentifiers,
      });
    }

    return issues;
  }

  /**
   * Determine overall validation state
   */
  private determineState(issues: ValidationIssue[]): ValidationState {
    const errors = issues.filter(i => i.severity === 'error');
    const uncertainties = issues.filter(i => i.requiresUncertaintyNavigation);

    if (errors.length > 0) {
      // Check if errors are consistency issues
      const consistencyErrors = errors.filter(e =>
        e.message.includes('Invalid') || e.message.includes('inconsistent')
      );

      if (consistencyErrors.length > 0) {
        return 'INCONSISTENT';
      }

      return 'INCOMPLETE';
    }

    if (uncertainties.length > 0) {
      return 'UNCERTAIN';
    }

    return 'VALID';
  }

  /**
   * Calculate certainty score
   *
   * High certainty (> 0.7): NSAI confidently validates
   * Low certainty (< 0.3): Hand to Fogbinder for exploration
   */
  private calculateCertainty(
    citation: AtomicCitation,
    issues: ValidationIssue[]
  ): CertaintyScore {
    // Start with structural completeness
    const required = REQUIRED_FIELDS[citation.itemType] || [];
    const present = required.filter(field => {
      const value = citation[field as keyof AtomicCitation];
      return value && (!Array.isArray(value) || value.length > 0);
    });

    const structural = required.length > 0
      ? present.length / required.length
      : 1.0;

    // Consistency: ratio of non-error issues
    const errors = issues.filter(i => i.severity === 'error');
    const totalChecks = issues.length + 10;  // Assume 10 implicit checks passed
    const consistency = 1.0 - (errors.length / totalChecks);

    // Referential: boost if has DOI/ISBN
    let referential = 0.5;  // Base score
    if (citation.DOI) referential += 0.3;
    if (citation.ISBN) referential += 0.2;
    if (citation.url) referential += 0.1;
    referential = Math.min(referential, 1.0);

    // Overall score (weighted average)
    const score = (
      structural * 0.5 +
      consistency * 0.3 +
      referential * 0.2
    );

    // Generate reasoning
    const reasoning = this.generateCertaintyReasoning(
      structural,
      consistency,
      referential,
      issues
    );

    return {
      score: Math.round(score * 100) / 100,
      factors: {
        structural: Math.round(structural * 100) / 100,
        consistency: Math.round(consistency * 100) / 100,
        referential: Math.round(referential * 100) / 100,
      },
      reasoning,
    };
  }

  /**
   * Generate human-readable certainty reasoning
   */
  private generateCertaintyReasoning(
    structural: number,
    consistency: number,
    referential: number,
    issues: ValidationIssue[]
  ): string {
    const parts: string[] = [];

    if (structural >= 0.9) {
      parts.push('Structurally complete');
    } else if (structural >= 0.7) {
      parts.push('Mostly complete structure');
    } else {
      parts.push('Missing required fields');
    }

    if (consistency >= 0.9) {
      parts.push('internally consistent');
    } else if (consistency >= 0.7) {
      parts.push('minor inconsistencies');
    } else {
      parts.push('significant inconsistencies');
    }

    if (referential >= 0.8) {
      parts.push('strong referential integrity');
    } else if (referential >= 0.5) {
      parts.push('some referential identifiers');
    } else {
      parts.push('weak referential integrity');
    }

    const uncertaintyIssues = issues.filter(i => i.requiresUncertaintyNavigation);
    if (uncertaintyIssues.length > 0) {
      parts.push(`${uncertaintyIssues.length} uncertainties require Fogbinder exploration`);
    }

    return parts.join(', ') + '.';
  }

  /**
   * Batch validate multiple citations
   */
  validateBatch(citations: AtomicCitation[]): ValidationResult[] {
    return citations.map(c => this.validate(c));
  }
}

/**
 * Convenience function for single citation validation
 */
export function validateCitation(citation: AtomicCitation): ValidationResult {
  const validator = new TractarianValidator();
  return validator.validate(citation);
}
