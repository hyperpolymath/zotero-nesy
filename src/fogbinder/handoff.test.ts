/**
 * Tests for Fogbinder Handoff Manager
 */

import { describe, it, expect } from 'vitest';
import { FogbinderHandoffManager, createFogbinderExport } from './handoff';
import { TractarianValidator } from '../validation/validator';
import type { AtomicCitation } from '../types/atomic';

describe('FogbinderHandoffManager', () => {
  const manager = new FogbinderHandoffManager();
  const validator = new TractarianValidator();

  describe('Payload Creation', () => {
    it('creates a valid Fogbinder payload', () => {
      const citations: AtomicCitation[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          itemType: 'book',
          title: 'Complete Book',
          creators: [{ creatorType: 'author', lastName: 'Author' }],
          publisher: 'Publisher',
          date: '2024',
          DOI: '10.1234/test',
          tags: [],
        },
      ];

      const results = validator.validateBatch(citations);
      const payload = manager.createPayload(results);

      expect(payload.version).toBe('1.0.0');
      expect(payload.timestamp).toBeInstanceOf(Date);
      expect(payload.validatedCitations).toBeDefined();
      expect(payload.invalidCitations).toBeDefined();
      expect(payload.uncertaintyRegions).toBeDefined();
      expect(payload.contradictionHints).toBeDefined();
      expect(payload.epistemicSummary).toBeDefined();
    });

    it('partitions citations by certainty', () => {
      const citations: AtomicCitation[] = [
        // High certainty
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          itemType: 'book',
          title: 'Valid Book',
          creators: [{ creatorType: 'author', lastName: 'Author' }],
          publisher: 'Publisher',
          date: '2024',
          DOI: '10.1234/valid',
          tags: [],
        },
        // Low certainty
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          itemType: 'book',
          title: 'Incomplete',
          creators: [{ creatorType: 'author', lastName: 'Unknown' }],
          tags: [],
          // Missing required fields
        },
      ];

      const results = validator.validateBatch(citations);
      const payload = manager.createPayload(results);

      expect(payload.validatedCitations.length).toBeGreaterThan(0);
      expect(payload.invalidCitations.length).toBeGreaterThan(0);
    });
  });

  describe('Uncertainty Region Detection', () => {
    it('detects citations without persistent identifiers', () => {
      const citations: AtomicCitation[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174003',
          itemType: 'book',
          title: 'No Identifier',
          creators: [{ creatorType: 'author', lastName: 'Author' }],
          publisher: 'Publisher',
          date: '2024',
          tags: [],
          // No DOI, ISBN, or URL
        },
      ];

      const results = validator.validateBatch(citations);
      const payload = manager.createPayload(results);

      const noPersistentIdRegion = payload.uncertaintyRegions.find(
        r => r.id === 'no-persistent-identifiers'
      );

      expect(noPersistentIdRegion).toBeDefined();
      expect(noPersistentIdRegion?.citationIds).toContain(citations[0].id);
    });

    it('detects temporal uncertainties', () => {
      const citations: AtomicCitation[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174004',
          itemType: 'book',
          title: 'Ancient Text',
          creators: [{ creatorType: 'author', lastName: 'Plato' }],
          date: '0380',  // Unusual year
          publisher: 'Ancient Press',
          tags: [],
        },
      ];

      const results = validator.validateBatch(citations);
      const payload = manager.createPayload(results);

      const temporalRegion = payload.uncertaintyRegions.find(
        r => r.id === 'temporal-uncertainties'
      );

      expect(temporalRegion).toBeDefined();
      expect(temporalRegion?.type).toBe('temporal');
    });

    it('detects low certainty regions', () => {
      const citations: AtomicCitation[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174005',
          itemType: 'book',
          title: 'Very Incomplete',
          creators: [],  // Missing creators
          tags: [],
        },
      ];

      const results = validator.validateBatch(citations);
      const payload = manager.createPayload(results);

      const lowCertaintyRegion = payload.uncertaintyRegions.find(
        r => r.id === 'low-certainty-region'
      );

      expect(lowCertaintyRegion).toBeDefined();
      expect(lowCertaintyRegion?.suggestedExploration.useMystery Clustering).toBe(true);
    });
  });

  describe('Contradiction Detection', () => {
    it('detects same title with different authors', () => {
      const citations: AtomicCitation[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174006',
          itemType: 'book',
          title: 'Shared Title',
          creators: [{ creatorType: 'author', lastName: 'AuthorA' }],
          publisher: 'Publisher',
          date: '2024',
          tags: [],
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174007',
          itemType: 'book',
          title: 'Shared Title',
          creators: [{ creatorType: 'author', lastName: 'AuthorB' }],
          publisher: 'Publisher',
          date: '2024',
          tags: [],
        },
      ];

      const results = validator.validateBatch(citations);
      const payload = manager.createPayload(results);

      const authorshipContradiction = payload.contradictionHints.find(
        h => h.type === 'authorship'
      );

      expect(authorshipContradiction).toBeDefined();
      expect(authorshipContradiction?.requiresSemanticAnalysis).toBe(true);
    });

    it('detects same author/title with different years', () => {
      const citations: AtomicCitation[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174008',
          itemType: 'book',
          title: 'Book',
          creators: [{ creatorType: 'author', lastName: 'Author' }],
          publisher: 'Publisher',
          date: '2023',
          tags: [],
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174009',
          itemType: 'book',
          title: 'Book',
          creators: [{ creatorType: 'author', lastName: 'Author' }],
          publisher: 'Publisher',
          date: '2024',
          tags: [],
        },
      ];

      const results = validator.validateBatch(citations);
      const payload = manager.createPayload(results);

      const temporalContradiction = payload.contradictionHints.find(
        h => h.type === 'temporal'
      );

      expect(temporalContradiction).toBeDefined();
    });
  });

  describe('Epistemic Summary', () => {
    it('generates accurate summary statistics', () => {
      const citations: AtomicCitation[] = [
        // Valid
        {
          id: '123e4567-e89b-12d3-a456-426614174010',
          itemType: 'book',
          title: 'Valid',
          creators: [{ creatorType: 'author', lastName: 'Author' }],
          publisher: 'Publisher',
          date: '2024',
          DOI: '10.1234/valid',
          tags: [],
        },
        // Invalid
        {
          id: '123e4567-e89b-12d3-a456-426614174011',
          itemType: 'book',
          title: 'Invalid',
          creators: [],
          tags: [],
        },
      ];

      const results = validator.validateBatch(citations);
      const payload = manager.createPayload(results);

      expect(payload.epistemicSummary.totalCitations).toBe(2);
      expect(payload.epistemicSummary.validatedCount).toBeGreaterThan(0);
      expect(payload.epistemicSummary.uncertainCount).toBeGreaterThan(0);
      expect(payload.epistemicSummary.overallCertainty).toBeGreaterThanOrEqual(0);
      expect(payload.epistemicSummary.overallCertainty).toBeLessThanOrEqual(1);
    });

    it('identifies epistemic gaps', () => {
      const citations: AtomicCitation[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174012',
          itemType: 'book',
          title: 'Incomplete',
          creators: [{ creatorType: 'author', lastName: 'Author' }],
          // Missing publisher, date
          tags: [],
        },
      ];

      const results = validator.validateBatch(citations);
      const payload = manager.createPayload(results);

      const incompleteMetadataGap = payload.epistemicSummary.epistemicGaps.find(
        g => g.type === 'incomplete-metadata'
      );

      expect(incompleteMetadataGap).toBeDefined();
      expect(incompleteMetadataGap?.explorableInFogbinder).toBe(false);
    });

    it('generates appropriate recommendations', () => {
      const goodCitations: AtomicCitation[] = Array(10).fill(null).map((_, i) => ({
        id: `123e4567-e89b-12d3-a456-42661417${String(i).padStart(4, '0')}`,
        itemType: 'book' as const,
        title: `Book ${i}`,
        creators: [{ creatorType: 'author' as const, lastName: `Author${i}` }],
        publisher: 'Publisher',
        date: '2024',
        DOI: `10.1234/book${i}`,
        tags: [],
      }));

      const results = validator.validateBatch(goodCitations);
      const payload = manager.createPayload(results);

      expect(payload.epistemicSummary.recommendation).toContain('well-structured');
    });
  });

  describe('Certainty Boundary', () => {
    it('determines what NSAI can and cannot validate', () => {
      const citations: AtomicCitation[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174100',
          itemType: 'book',
          title: 'Test',
          creators: [{ creatorType: 'author', lastName: 'Author' }],
          publisher: 'Publisher',
          date: '2024',
          tags: [],
        },
      ];

      const results = validator.validateBatch(citations);
      const boundary = manager.determineCertaintyBoundary(results);

      expect(boundary.validated).toContain('Structural completeness of citations');
      expect(boundary.beyondValidation).toContain('Semantic meaning of citation content');
      expect(boundary.handoffRecommendation).toBeDefined();
    });
  });

  describe('Export Generation', () => {
    it('creates a valid export package', () => {
      const citations: AtomicCitation[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174101',
          itemType: 'book',
          title: 'Export Test',
          creators: [{ creatorType: 'author', lastName: 'Author' }],
          publisher: 'Publisher',
          date: '2024',
          tags: [],
        },
      ];

      const results = validator.validateBatch(citations);
      const exportPackage = manager.exportToFogbinder(results);

      expect(exportPackage.format).toBe('nsai-to-fogbinder');
      expect(exportPackage.formatVersion).toBe('1.0.0');
      expect(exportPackage.exported).toBeInstanceOf(Date);
      expect(exportPackage.payload).toBeDefined();
    });
  });
});

describe('createFogbinderExport convenience function', () => {
  it('creates an export', () => {
    const validator = new TractarianValidator();
    const citations: AtomicCitation[] = [
      {
        id: '123e4567-e89b-12d3-a456-426614174102',
        itemType: 'book',
        title: 'Test',
        creators: [{ creatorType: 'author', lastName: 'Author' }],
        publisher: 'Publisher',
        date: '2024',
        tags: [],
      },
    ];

    const results = validator.validateBatch(citations);
    const exportPackage = createFogbinderExport(results);

    expect(exportPackage.format).toBe('nsai-to-fogbinder');
  });
});
