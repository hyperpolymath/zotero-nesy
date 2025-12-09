;; STATE.scm - Checkpoint/Restore for AI Conversations
;; Project: zotero-nsai (NSAI: Neurosymbolic Research Validator for Zotero)
;; "What can be said at all can be said clearly." - Tractatus

;;; ===================================================================
;;; METADATA
;;; ===================================================================
(metadata
  (format-version . "2.0")
  (schema-version . "2025-12-08")
  (created-at . "2025-12-08T20:20:00Z")
  (last-updated . "2025-12-08T20:20:00Z")
  (generator . "Claude/STATE-system"))

;;; ===================================================================
;;; PROJECT CONTEXT
;;; ===================================================================
(project
  (name . "zotero-nsai")
  (repository . "https://github.com/Hyperpolymath/zotero-nsai")
  (version . "0.1.0-alpha")
  (license . "AGPL-3.0-or-later")
  (status . "mvp-alpha")
  (philosophy . "Tractarian logical atomism")
  (companion-project . "Fogbinder")
  (branch . "claude/create-state-scm-012At6ReVBvB7N2UJ1RUQbZn"))

;;; ===================================================================
;;; CURRENT POSITION
;;; ===================================================================
(current-position
  (summary . "MVP implementation complete with minor test failures")

  (completed-components
    ("Core Validation Engine" .
      "TractarianValidator with structural, consistency, referential validation")
    ("Certainty Scoring" .
      "0.0-1.0 scale with structural/consistency/referential factors")
    ("Fogbinder Handoff" .
      "FogbinderHandoffManager with UncertaintyRegions and ContradictionHints")
    ("Type System" .
      "TypeScript strict mode + Zod schemas for runtime validation")
    ("UI Foundation" .
      "NCIS-themed popup with accessibility (ARIA, keyboard nav)")
    ("Documentation" .
      "README, PHILOSOPHY.md, FOGBINDER-HANDOFF.md, CLAUDE.md")
    ("Build System" .
      "Vite + Vitest configured"))

  (test-status
    (total-tests . 14)
    (passing . 11)
    (failing . 3)
    (syntax-errors . 1))

  (key-files
    ("src/validation/validator.ts" . "Core validation engine")
    ("src/fogbinder/handoff.ts" . "Fogbinder integration manager")
    ("src/types/atomic.ts" . "Tractarian data models")
    ("src/types/fogbinder-interface.ts" . "Handoff payload types")
    ("src/ui/popup.ts" . "Popup controller")
    ("PHILOSOPHY.md" . "Tractarian philosophical foundation")))

;;; ===================================================================
;;; ROUTE TO MVP v1
;;; ===================================================================
(route-to-mvp-v1
  (phase-1-immediate
    (name . "Fix Test Failures")
    (priority . "critical")
    (tasks
      ("Fix syntax error in handoff.test.ts" .
        "Line 142: 'useMystery Clustering' has space in property name")
      ("Fix handoff.ts syntax error" .
        "Same issue: 'useMystery Clustering' property names have spaces")
      ("Adjust validator test expectations or logic" .
        "3 tests fail: UNCERTAIN vs VALID state, certainty thresholds")))

  (phase-2-integration
    (name . "Zotero API Integration")
    (priority . "high")
    (tasks
      ("Connect to Zotero library API" .
        "Read citations from actual Zotero library")
      ("Implement selection handling" .
        "Get selected items from Zotero UI")
      ("Wire up validation trigger" .
        "Right-click context menu or toolbar button")
      ("Display results in Zotero" .
        "Show validation popup with results")))

  (phase-3-polish
    (name . "Distribution Preparation")
    (priority . "medium")
    (tasks
      ("Create NSAI icon/logo" .
        "Navy/cyan investigative theme")
      ("Build XPI package" .
        "Zotero plugin distribution format")
      ("Settings panel" .
        "User configuration for thresholds")
      ("Localization skeleton" .
        "i18n infrastructure for future translation")))

  (phase-4-release
    (name . "v1.0.0 Release")
    (priority . "low")
    (tasks
      ("Real-world testing" .
        "Test with actual research libraries")
      ("Performance optimization" .
        "Batch validation for large libraries")
      ("Documentation update" .
        "User guide and API docs")
      ("Release to Zotero plugin repo" .
        "Make available for installation"))))

;;; ===================================================================
;;; KNOWN ISSUES
;;; ===================================================================
(issues
  (critical
    (issue-001
      (summary . "Syntax error: Property name with space")
      (location . "src/fogbinder/handoff.ts:176,218")
      (problem . "'useMystery Clustering' is invalid JavaScript property name")
      (fix . "Rename to 'useMysteryClustering' (camelCase)")
      (affects . "handoff.ts and handoff.test.ts")))

  (high
    (issue-002
      (summary . "Test expectation mismatch: UNCERTAIN vs VALID")
      (location . "src/validation/validator.test.ts:29")
      (problem . "Complete citation returns UNCERTAIN, test expects VALID")
      (analysis . "Citation without DOI/ISBN triggers 'no persistent identifier' warning with requiresUncertaintyNavigation=true, causing UNCERTAIN state")
      (options .
        ("Option A: Update test to expect UNCERTAIN for citations without DOI")
        ("Option B: Add DOI/ISBN to test citation to make it VALID")
        ("Option C: Adjust logic - don't flag uncertainty for missing identifiers alone")))

    (issue-003
      (summary . "Certainty threshold test failure")
      (location . "src/validation/validator.test.ts:204")
      (problem . "Expects score < 0.5 for incomplete citations, gets 0.6")
      (analysis . "Certainty calculation weights may need adjustment")
      (fix . "Review certainty formula or adjust test threshold"))

    (issue-004
      (summary . "Batch validation test failure")
      (location . "src/validation/validator.test.ts:234")
      (problem . "Expects all citations VALID, some return UNCERTAIN")
      (analysis . "Related to issue-002 - missing persistent identifiers")))

  (medium
    (issue-005
      (summary . "npm dependencies have deprecation warnings")
      (details . "inflight, glob, rimraf, humanwhocodes packages deprecated")
      (fix . "Update eslint to v9+ and related dependencies"))

    (issue-006
      (summary . "4 moderate security vulnerabilities")
      (fix . "Run npm audit fix --force (may have breaking changes)"))))

;;; ===================================================================
;;; QUESTIONS FOR OWNER
;;; ===================================================================
(questions
  (architecture
    (q1
      (topic . "Validation strictness")
      (question . "Should citations without persistent identifiers (DOI/ISBN/URL) be marked UNCERTAIN or just receive a lower certainty score while remaining VALID?")
      (context . "Current logic flags 'no persistent identifier' as requiring uncertainty navigation, which changes state to UNCERTAIN")
      (options
        ("Strict: Missing identifiers → UNCERTAIN (current behavior)")
        ("Lenient: Missing identifiers → VALID with lower score")
        ("Configurable: User chooses strictness level")))

    (q2
      (topic . "Certainty threshold")
      (question . "What should the certainty score be for citations missing required fields?")
      (context . "Current: ~0.6 for citations missing date/publisher. Test expects < 0.5")
      (options
        ("Adjust formula to be harsher on missing fields")
        ("Adjust test expectations to match current formula"))))

  (integration
    (q3
      (topic . "Zotero version support")
      (question . "Target Zotero 6.x, 7.x, or both?")
      (context . "Zotero 7 has different plugin architecture")
      (options
        ("Zotero 6 only - Bootstrap extension")
        ("Zotero 7 only - WebExtension")
        ("Both - dual-format plugin")))

    (q4
      (topic . "Fogbinder coordination")
      (question . "Should NSAI and Fogbinder share a neurosymbolic core?")
      (context . "PHILOSOPHY.md mentions shared Lean 4 WASM / ONNX")
      (options
        ("Separate implementations")
        ("Shared core library")
        ("Defer decision until v1.0"))))

  (philosophy
    (q5
      (topic . "Tractarian boundary")
      (question . "Is the current certainty threshold (0.7) correct for the NSAI/Fogbinder boundary?")
      (context . "Citations >= 0.7 stay in NSAI, < 0.7 flagged for Fogbinder")
      (options
        ("0.7 is appropriate")
        ("Should be higher (0.8) for stricter handoff")
        ("Should be configurable per-user")))))

;;; ===================================================================
;;; LONG-TERM ROADMAP
;;; ===================================================================
(roadmap
  (v0-1-0-alpha
    (status . "current")
    (features
      ("Core validation engine" . "complete")
      ("Certainty scoring" . "complete")
      ("Fogbinder handoff interface" . "complete")
      ("NCIS-themed UI" . "complete")
      ("Accessibility" . "complete"))
    (remaining
      ("Fix test failures" . "pending")
      ("Zotero integration" . "pending")))

  (v0-2-0
    (status . "planned")
    (features
      ("Batch validation optimization" . "planned")
      ("Custom validation rules" . "planned")
      ("Export formats: CSV, BibTeX" . "planned")
      ("Settings panel" . "planned")
      ("Localization infrastructure" . "planned")))

  (v1-0-0
    (status . "future")
    (features
      ("Lean 4 WASM integration" . "formal verification")
      ("ONNX Runtime" . "ML-based validation")
      ("GraphQL API" . "backend communication")
      ("Fogbinder bidirectional sync" . "two-way handoff")
      ("Real-time validation" . "as-you-type")
      ("Optional cloud sync" . "privacy-respecting")))

  (v2-0-0
    (status . "vision")
    (features
      ("Semantic validation" . "content analysis beyond structure")
      ("Citation recommendation" . "suggest missing sources")
      ("Research graph visualization" . "citation network")
      ("Cross-library validation" . "multiple Zotero libraries")
      ("Plugin ecosystem" . "extensible validation rules"))))

;;; ===================================================================
;;; TECHNOLOGY STACK
;;; ===================================================================
(stack
  (current
    (language . "TypeScript 5.3")
    (runtime . "Node.js 18+")
    (build . "Vite 5.0")
    (test . "Vitest 1.0")
    (validation . "Zod 3.22")
    (lint . "ESLint 8.x"))

  (planned
    (formal-verification . "Lean 4 WASM")
    (ml-inference . "ONNX Runtime Web")
    (type-safety-optional . "ReScript")
    (backend-optional . "Elixir + Absinthe GraphQL")))

;;; ===================================================================
;;; COMPANION PROJECTS
;;; ===================================================================
(companions
  (fogbinder
    (repository . "https://github.com/Hyperpolymath/fogbinder")
    (purpose . "Navigate epistemic ambiguity")
    (philosophy . "Late Wittgenstein - language games, forms of life")
    (theme . "Dark mystery - purple/black")
    (integration-format . "nsai-to-fogbinder v1.0.0")
    (features
      ("Contradiction detection" . "semantic conflicts")
      ("Mood scoring" . "epistemic stance")
      ("Mystery clustering" . "uncertainty patterns")
      ("FogTrail visualization" . "certainty gradient"))))

;;; ===================================================================
;;; SESSION NOTES
;;; ===================================================================
(session
  (date . "2025-12-08")
  (accomplishments
    ("Created STATE.scm" . "Project state documentation")
    ("Analyzed test failures" . "Identified 3 test issues + 1 syntax error")
    ("Documented issues" . "Critical, high, medium priority categorization")
    ("Mapped MVP route" . "4-phase path to v1.0"))

  (next-steps
    ("Fix syntax error in handoff.ts/handoff.test.ts" . "immediate")
    ("Resolve test failures or adjust expectations" . "immediate")
    ("Begin Zotero API integration" . "next phase")))

;;; ===================================================================
;;; PHILOSOPHICAL CONTEXT
;;; ===================================================================
(philosophy
  (foundation . "Wittgenstein's Tractatus Logico-Philosophicus")
  (key-proposition . "What can be said at all can be said clearly")

  (nsai-domain
    (description . "The Sayable - formal validation")
    (approach . "Truth-functional analysis")
    (examples
      ("Structural completeness")
      ("Format consistency")
      ("Logical coherence")
      ("Referential integrity")))

  (fogbinder-domain
    (description . "The Unsayable - uncertainty exploration")
    (approach . "Pragmatic investigation")
    (examples
      ("Semantic contradictions")
      ("Epistemic quality")
      ("Mood and tone")
      ("Mystery clustering")))

  (handoff-metaphor . "Throwing away the ladder after climbing")
  (tractatus-reference . "6.54"))

;; End of STATE.scm
;; "Whereof one can validate clearly, thereof NSAI will speak.
;;  Whereof validation fails, thereof Fogbinder must explore."
