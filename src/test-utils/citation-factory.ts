/**
 * Citation Factory for Testing
 *
 * Provides helper functions to create test citations
 */

import type { AtomicCitation } from '../types/atomic';

/**
 * Generate a random UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Create a complete, valid book citation
 */
export function createValidBook(overrides?: Partial<AtomicCitation>): AtomicCitation {
  return {
    id: generateUUID(),
    itemType: 'book',
    title: 'Tractatus Logico-Philosophicus',
    creators: [
      { creatorType: 'author', firstName: 'Ludwig', lastName: 'Wittgenstein' }
    ],
    date: '1921',
    publisher: 'Routledge',
    place: 'London',
    ISBN: '978-0-415-05186-7',
    tags: ['philosophy', 'logic'],
    ...overrides,
  };
}

/**
 * Create a complete, valid journal article
 */
export function createValidJournalArticle(overrides?: Partial<AtomicCitation>): AtomicCitation {
  return {
    id: generateUUID(),
    itemType: 'journalArticle',
    title: 'On Denoting',
    creators: [
      { creatorType: 'author', firstName: 'Bertrand', lastName: 'Russell' }
    ],
    date: '1905',
    publicationTitle: 'Mind',
    volume: '14',
    issue: '56',
    pages: '479-493',
    DOI: '10.1093/mind/XIV.56.479',
    tags: ['philosophy', 'logic'],
    ...overrides,
  };
}

/**
 * Create an incomplete book citation (missing required fields)
 */
export function createIncompleteBook(overrides?: Partial<AtomicCitation>): AtomicCitation {
  return {
    id: generateUUID(),
    itemType: 'book',
    title: 'Incomplete Book',
    creators: [{ creatorType: 'author', lastName: 'Unknown' }],
    tags: [],
    // Missing: publisher, date
    ...overrides,
  };
}

/**
 * Create a citation with invalid date
 */
export function createInvalidDateCitation(overrides?: Partial<AtomicCitation>): AtomicCitation {
  return {
    id: generateUUID(),
    itemType: 'book',
    title: 'Invalid Date Book',
    creators: [{ creatorType: 'author', lastName: 'Author' }],
    date: 'not-a-date',
    publisher: 'Publisher',
    tags: [],
    ...overrides,
  };
}

/**
 * Create a citation with unusual (ancient) date
 */
export function createAncientCitation(overrides?: Partial<AtomicCitation>): AtomicCitation {
  return {
    id: generateUUID(),
    itemType: 'book',
    title: 'The Republic',
    creators: [{ creatorType: 'author', lastName: 'Plato' }],
    date: '0380',  // 380 BCE
    publisher: 'Ancient Press',
    tags: ['philosophy', 'ancient'],
    ...overrides,
  };
}

/**
 * Create a citation without persistent identifier
 */
export function createNoPersistentIdCitation(overrides?: Partial<AtomicCitation>): AtomicCitation {
  return {
    id: generateUUID(),
    itemType: 'book',
    title: 'No Identifier Book',
    creators: [{ creatorType: 'author', lastName: 'Author' }],
    publisher: 'Publisher',
    date: '2024',
    tags: [],
    // No DOI, ISBN, or URL
    ...overrides,
  };
}

/**
 * Create a webpage citation
 */
export function createWebpage(overrides?: Partial<AtomicCitation>): AtomicCitation {
  return {
    id: generateUUID(),
    itemType: 'webpage',
    title: 'Stanford Encyclopedia of Philosophy',
    creators: [{ creatorType: 'author', lastName: 'Stanford' }],
    url: 'https://plato.stanford.edu',
    date: '2024',
    tags: ['reference'],
    ...overrides,
  };
}

/**
 * Create a batch of diverse citations for testing
 */
export function createBatchCitations(count: number = 10): AtomicCitation[] {
  const citations: AtomicCitation[] = [];

  for (let i = 0; i < count; i++) {
    const type = i % 3;

    if (type === 0) {
      citations.push(createValidBook({ title: `Book ${i}` }));
    } else if (type === 1) {
      citations.push(createValidJournalArticle({ title: `Article ${i}` }));
    } else {
      citations.push(createWebpage({ title: `Webpage ${i}` }));
    }
  }

  return citations;
}

/**
 * Create citations with potential contradictions
 */
export function createContradictoryCitations(): AtomicCitation[] {
  const baseId1 = generateUUID();
  const baseId2 = generateUUID();

  return [
    // Same title, different authors (authorship contradiction)
    {
      id: baseId1,
      itemType: 'book',
      title: 'Shared Title',
      creators: [{ creatorType: 'author', lastName: 'AuthorA' }],
      publisher: 'Publisher',
      date: '2024',
      tags: [],
    },
    {
      id: baseId2,
      itemType: 'book',
      title: 'Shared Title',
      creators: [{ creatorType: 'author', lastName: 'AuthorB' }],
      publisher: 'Publisher',
      date: '2024',
      tags: [],
    },
  ];
}

/**
 * Create the Tractatus citation (Wittgenstein's actual work)
 */
export function createTractatus(): AtomicCitation {
  return {
    id: generateUUID(),
    itemType: 'book',
    title: 'Tractatus Logico-Philosophicus',
    creators: [
      { creatorType: 'author', firstName: 'Ludwig', lastName: 'Wittgenstein' },
      { creatorType: 'translator', firstName: 'C.K.', lastName: 'Ogden' },
    ],
    date: '1922',
    publisher: 'Routledge & Kegan Paul',
    place: 'London',
    ISBN: '978-0-415-05186-7',
    abstractNote: 'A treatise on the limits of language and logic.',
    tags: ['philosophy', 'logic', 'language'],
  };
}

/**
 * Create Philosophical Investigations (late Wittgenstein)
 */
export function createPhilosophicalInvestigations(): AtomicCitation {
  return {
    id: generateUUID(),
    itemType: 'book',
    title: 'Philosophical Investigations',
    creators: [
      { creatorType: 'author', firstName: 'Ludwig', lastName: 'Wittgenstein' },
      { creatorType: 'translator', firstName: 'G.E.M.', lastName: 'Anscombe' },
    ],
    date: '1953',
    publisher: 'Blackwell',
    place: 'Oxford',
    ISBN: '978-0-631-23127-1',
    abstractNote: 'An exploration of language games and meaning as use.',
    tags: ['philosophy', 'language', 'late-wittgenstein'],
  };
}
