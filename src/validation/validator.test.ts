/**
 * Tests for Tractarian Validator
 */

import { describe, it, expect } from 'vitest';
import { TractarianValidator, validateCitation } from './validator';
import type { AtomicCitation } from '../types/atomic';

describe('TractarianValidator', () => {
  const validator = new TractarianValidator();

  describe('Structural Validation', () => {
    it('validates a complete book citation', () => {
      const citation: AtomicCitation = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        itemType: 'book',
        title: 'Tractatus Logico-Philosophicus',
        creators: [
          { creatorType: 'author', firstName: 'Ludwig', lastName: 'Wittgenstein' }
        ],
        date: '1921',
        publisher: 'Routledge',
        place: 'London',
        tags: [],
      };

      const result = validator.validate(citation);

      expect(result.state).toBe('VALID');
      // May have warning about missing DOI/ISBN, but no errors
      expect(result.issues.filter(i => i.severity === 'error')).toHaveLength(0);
      expect(result.certainty.score).toBeGreaterThan(0.7);
    });

    it('detects missing required fields', () => {
      const citation: AtomicCitation = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        itemType: 'book',
        title: 'Incomplete Book',
        creators: [
          { creatorType: 'author', lastName: 'Author' }
        ],
        // Missing publisher and date
        tags: [],
      };

      const result = validator.validate(citation);

      expect(result.state).toBe('INCOMPLETE');
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.issues.some(i => i.field === 'publisher')).toBe(true);
      expect(result.issues.some(i => i.field === 'date')).toBe(true);
    });

    it('validates journal article with required fields', () => {
      const citation: AtomicCitation = {
        id: '123e4567-e89b-12d3-a456-426614174002',
        itemType: 'journalArticle',
        title: 'On Certainty',
        creators: [
          { creatorType: 'author', firstName: 'Ludwig', lastName: 'Wittgenstein' }
        ],
        publicationTitle: 'Philosophy Journal',
        date: '1969',
        DOI: '10.1234/example',
        tags: [],
      };

      const result = validator.validate(citation);

      expect(result.state).toBe('VALID');
      expect(result.certainty.factors.referential).toBeGreaterThan(0.7);
    });
  });

  describe('Consistency Validation', () => {
    it('detects invalid date format', () => {
      const citation: AtomicCitation = {
        id: '123e4567-e89b-12d3-a456-426614174003',
        itemType: 'book',
        title: 'Test Book',
        creators: [{ creatorType: 'author', lastName: 'Author' }],
        date: 'invalid-date',
        publisher: 'Publisher',
        tags: [],
      };

      const result = validator.validate(citation);

      expect(result.issues.some(i => i.field === 'date' && i.severity === 'error')).toBe(true);
    });

    it('warns about unusual publication year', () => {
      const citation: AtomicCitation = {
        id: '123e4567-e89b-12d3-a456-426614174004',
        itemType: 'book',
        title: 'Ancient Text',
        creators: [{ creatorType: 'author', lastName: 'Plato' }],
        date: '0380',  // 380 BCE (unusual)
        publisher: 'Ancient Press',
        tags: [],
      };

      const result = validator.validate(citation);

      expect(result.issues.some(i =>
        i.field === 'date' &&
        i.severity === 'warning' &&
        i.requiresUncertaintyNavigation
      )).toBe(true);
    });

    it('detects invalid URL format', () => {
      const citation: AtomicCitation = {
        id: '123e4567-e89b-12d3-a456-426614174005',
        itemType: 'webpage',
        title: 'Test Page',
        creators: [{ creatorType: 'author', lastName: 'Author' }],
        url: 'not-a-valid-url',
        date: '2024',
        tags: [],
      };

      const result = validator.validate(citation);

      expect(result.issues.some(i => i.field === 'url' && i.severity === 'error')).toBe(true);
    });
  });

  describe('Referential Validation', () => {
    it('validates DOI format', () => {
      const citation: AtomicCitation = {
        id: '123e4567-e89b-12d3-a456-426614174006',
        itemType: 'journalArticle',
        title: 'Research Paper',
        creators: [{ creatorType: 'author', lastName: 'Researcher' }],
        publicationTitle: 'Journal',
        date: '2024',
        DOI: '10.1234/valid.doi.2024',
        tags: [],
      };

      const result = validator.validate(citation);

      expect(result.state).toBe('VALID');
      expect(result.certainty.factors.referential).toBeGreaterThan(0.7);
    });

    it('warns about missing persistent identifier', () => {
      const citation: AtomicCitation = {
        id: '123e4567-e89b-12d3-a456-426614174007',
        itemType: 'book',
        title: 'Book Without Identifiers',
        creators: [{ creatorType: 'author', lastName: 'Author' }],
        publisher: 'Publisher',
        date: '2024',
        tags: [],
        // No DOI, ISBN, or URL
      };

      const result = validator.validate(citation);

      // In standard mode, missing identifiers is a warning but doesn't require
      // uncertainty navigation. Use strict mode to flag for Fogbinder.
      expect(result.issues.some(i =>
        i.field === 'identifiers' &&
        i.severity === 'warning'
      )).toBe(true);
    });
  });

  describe('Certainty Scoring', () => {
    it('assigns high certainty to complete citations', () => {
      const citation: AtomicCitation = {
        id: '123e4567-e89b-12d3-a456-426614174008',
        itemType: 'book',
        title: 'Complete Book',
        creators: [{ creatorType: 'author', firstName: 'First', lastName: 'Author' }],
        publisher: 'Publisher',
        date: '2024',
        DOI: '10.1234/complete',
        ISBN: '978-3-16-148410-0',
        tags: [],
      };

      const result = validator.validate(citation);

      expect(result.certainty.score).toBeGreaterThan(0.85);
      expect(result.certainty.factors.structural).toBeGreaterThan(0.9);
      expect(result.certainty.factors.consistency).toBeGreaterThan(0.9);
      expect(result.certainty.factors.referential).toBeGreaterThan(0.8);
    });

    it('assigns lower certainty to incomplete citations', () => {
      const citation: AtomicCitation = {
        id: '123e4567-e89b-12d3-a456-426614174009',
        itemType: 'book',
        title: 'Incomplete',
        creators: [{ creatorType: 'author', lastName: 'Unknown' }],
        tags: [],
        // Missing required fields (publisher, date)
      };

      const result = validator.validate(citation);

      // Incomplete citations should have lower certainty and INCOMPLETE state
      expect(result.certainty.score).toBeLessThan(0.7);  // Below Fogbinder threshold
      expect(result.state).toBe('INCOMPLETE');
    });
  });

  describe('Batch Validation', () => {
    it('validates multiple citations', () => {
      const citations: AtomicCitation[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174010',
          itemType: 'book',
          title: 'Book 1',
          creators: [{ creatorType: 'author', lastName: 'Author1' }],
          publisher: 'Publisher',
          date: '2024',
          tags: [],
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174011',
          itemType: 'book',
          title: 'Book 2',
          creators: [{ creatorType: 'author', lastName: 'Author2' }],
          publisher: 'Publisher',
          date: '2024',
          tags: [],
        },
      ];

      const results = validator.validateBatch(citations);

      expect(results).toHaveLength(2);
      expect(results.every(r => r.state === 'VALID')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty creator list', () => {
      const citation: AtomicCitation = {
        id: '123e4567-e89b-12d3-a456-426614174012',
        itemType: 'book',
        title: 'No Authors',
        creators: [],
        publisher: 'Publisher',
        date: '2024',
        tags: [],
      };

      const result = validator.validate(citation);

      expect(result.issues.some(i => i.field === 'creators')).toBe(true);
    });

    it('handles missing lastName in creator', () => {
      const citation: AtomicCitation = {
        id: '123e4567-e89b-12d3-a456-426614174013',
        itemType: 'book',
        title: 'Bad Creator',
        creators: [{ creatorType: 'author', lastName: '' }],
        publisher: 'Publisher',
        date: '2024',
        tags: [],
      };

      const result = validator.validate(citation);

      expect(result.issues.some(i =>
        i.field === 'creators' &&
        i.message.includes('missing lastName')
      )).toBe(true);
    });
  });
});

describe('validateCitation convenience function', () => {
  it('validates a citation', () => {
    const citation: AtomicCitation = {
      id: '123e4567-e89b-12d3-a456-426614174014',
      itemType: 'book',
      title: 'Test',
      creators: [{ creatorType: 'author', lastName: 'Author' }],
      publisher: 'Publisher',
      date: '2024',
      tags: [],
    };

    const result = validateCitation(citation);

    expect(result).toBeDefined();
    expect(result.citation).toBe(citation);
  });
});
