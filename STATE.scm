;; STATE.scm - Checkpoint/Restore for AI Conversations
;; Project: zotero-nsai (NSAI: Neurosymbolic Research Validator for Zotero)
;; "What can be said at all can be said clearly." - Tractatus
;; Updated: 2025-12-09

;;; ===================================================================
;;; METADATA
;;; ===================================================================
(metadata
  (format-version . "2.0")
  (schema-version . "2025-12-09")
  (created-at . "2025-12-08T20:20:00Z")
  (last-updated . "2025-12-09T20:15:00Z")
  (generator . "Claude/STATE-system"))

;;; ===================================================================
;;; PROJECT CONTEXT
;;; ===================================================================
(project
  (name . "zotero-nsai")
  (repository . "https://github.com/Hyperpolymath/zotero-nsai")
  (version . "0.1.0-alpha")
  (license . "AGPL-3.0-or-later")
  (status . "rescript-migration-complete")
  (philosophy . "Tractarian logical atomism")
  (companion-project . "Fogbinder")
  (branch . "claude/create-state-scm-012At6ReVBvB7N2UJ1RUQbZn")
  (zotero-target . "7.x only (WebExtension)")
  (template-recommendation . "https://github.com/hyperpolymath/zoterho-template"))

;;; ===================================================================
;;; CURRENT POSITION
;;; ===================================================================
(current-position
  (summary . "ReScript migration complete, TypeScript purged, CI/CD language guard active")

  (completed-components
    ("Core Validation Engine" .
      "Validator.res with configurable strictness (strict/standard/lenient)")
    ("Certainty Scoring" .
      "0.0-1.0 scale with structural/consistency/referential factors")
    ("Fogbinder Handoff" .
      "Handoff.res with UncertaintyRegions and ContradictionHints")
    ("Type System" .
      "ReScript with pattern matching and option types")
    ("UI Styles" .
      "NCIS-themed SCSS with accessibility (ARIA support)")
    ("Documentation" .
      "README, PHILOSOPHY.md, FOGBINDER-HANDOFF.md, CLAUDE.md, STATE.scm")
    ("Build System" .
      "Deno + ReScript compiler (rescript.json)")
    ("CI/CD" .
      "GitHub Actions with LANGUAGE GUARD (blocks TypeScript, npm, Go, Python)")
    (".well-known" .
      "security.txt, ai.txt, humans.txt, void.ttl, host-meta.json")
    ("Auto-update" .
      "Shell script + git hook for STATE.scm updates"))

  (key-files
    ("src/Validation/Validator.res" . "Core validation engine")
    ("src/Fogbinder/Handoff.res" . "Fogbinder integration manager")
    ("src/Types/Atomic.res" . "Tractarian data models")
    ("src/Types/FogbinderInterface.res" . "Handoff payload types")
    ("styles/popup.scss" . "NCIS-themed styles")
    ("rescript.json" . "ReScript compiler config")
    ("deno.json" . "Deno runtime config")
    (".github/workflows/language-guard.yml" . "Forbidden language enforcement")
    ("scripts/update-state.sh" . "STATE.scm auto-updater")
    (".githooks/pre-commit" . "Pre-commit language check")
    ("PHILOSOPHY.md" . "Tractarian philosophical foundation")))

;;; ===================================================================
;;; LANGUAGE POLICY
;;; ===================================================================
(language-policy
  (accepted
    ("ReScript" . ".res, .resi - Primary language")
    ("SCSS" . ".scss - Styles")
    ("Shell" . ".sh - Scripts")
    ("Scheme" . ".scm - Documentation")
    ("Rust" . ".rs - WASM modules (future)")
    ("Lean 4" . ".lean - Formal verification (future)")
    ("Julia" . ".jl - Noise analysis (v2.0)")
    ("Python" . ".py - ONLY if Salt-related"))

  (banned
    ("TypeScript" . ".ts, .tsx - DELETED AND BLOCKED")
    ("CoffeeScript" . ".coffee - BLOCKED")
    ("Go" . ".go - BLOCKED")
    ("npm" . "package.json, node_modules - DELETED AND BLOCKED"))

  (enforcement
    ("CI/CD" . "language-guard.yml fails build on forbidden files")
    ("Pre-commit" . ".githooks/pre-commit blocks commits")
    ("Documentation" . "STATE.scm records policy")))

;;; ===================================================================
;;; ROUTE TO MVP v1.0.0
;;; ===================================================================
(route-to-v1
  (phase-1-web-standards
    (name . "Web Standards Compliance")
    (priority . "high")
    (status . "COMPLETE")
    (completed
      ("Dublin Core metadata" . "popup.html has dc: prefixed meta tags")
      ("VOID dataset description" . "void.ttl created")
      ("security.txt" . "Expires updated to 2026-12-09")
      (".well-known/host-meta" . "XRD and JSON versions created")))

  (phase-2-architecture-migration
    (name . "ReScript + Deno Migration")
    (priority . "high")
    (status . "COMPLETE")
    (completed
      ("deno.json" . "Deno configuration created")
      ("rescript.json" . "ReScript compiler configuration")
      ("Validator.res" . "Core validation logic ported")
      ("Handoff.res" . "Fogbinder integration ported")
      ("Atomic.res" . "Type definitions ported")
      ("FogbinderInterface.res" . "Handoff types ported")
      ("SCSS" . "popup.scss with mixins and variables")
      ("TypeScript purged" . "All .ts files deleted")
      ("npm purged" . "package.json, node_modules deleted")))

  (phase-3-zotero-integration
    (name . "Zotero 7 Integration")
    (priority . "high")
    (status . "IN PROGRESS")
    (target . "Zotero 7+ only (deny earlier versions)")
    (template . "https://github.com/hyperpolymath/zoterho-template")
    (remaining
      ("Update manifest.json for Zotero 7" . "WebExtension manifest format")
      ("Zotero library API connection" . "Read citations from Zotero.Items")
      ("UI popup implementation" . "Popup.res controller")
      ("Context menu" . "Right-click validate action")
      ("Toolbar button" . "NSAI icon in toolbar")))

  (phase-4-zola-integration
    (name . "Zola Static Site")
    (priority . "medium")
    (status . "pending")
    (tasks
      ("Create config.toml" . "Zola site configuration")
      ("Documentation site structure" . "docs/, templates/, content/")
      ("Wiki integration" . "Link to GitHub wiki")))

  (phase-5-release
    (name . "v1.0.0 Release")
    (priority . "medium")
    (status . "pending")
    (tasks
      ("ReScript compilation" . "Build pipeline for .res → .js")
      ("Test suite" . "ReScript tests with assertions")
      ("XPI packaging" . "Zotero plugin distribution")
      ("Release notes" . "CHANGELOG.md update"))))

;;; ===================================================================
;;; TECHNOLOGY STACK
;;; ===================================================================
(stack
  (current
    (language . "ReScript 11+")
    (runtime . "Deno 2.x")
    (styles . "SCSS")
    (build . "ReScript compiler + Deno")
    (ci . "GitHub Actions + Language Guard"))

  (future-v2
    (formal-verification . "Lean 4 WASM")
    (ml-inference . "ONNX Runtime Web")
    (backend . "Elixir + Absinthe GraphQL")

    (noise-analyzer
      (purpose . "Auto-calibrate thresholds based on user's actual library")
      (insight . "~80% of real Zotero libraries lack DOI/ISBN fields")
      (stack
        ("Julia" . "Statistical noise modeling")
        ("DeepProbLog" . "Probabilistic logic programming")
        ("Qute" . "Quantum-inspired optimization")))))

;;; ===================================================================
;;; COMPANION PROJECTS
;;; ===================================================================
(companions
  (fogbinder
    (repository . "https://github.com/Hyperpolymath/fogbinder")
    (purpose . "Navigate epistemic ambiguity")
    (philosophy . "Late Wittgenstein - language games")
    (integration-format . "nsai-to-fogbinder v1.0.0"))

  (zoterho-template
    (repository . "https://github.com/hyperpolymath/zoterho-template")
    (purpose . "Zotero plugin scaffolding")))

;;; ===================================================================
;;; SESSION LOG (2025-12-09 - Current)
;;; ===================================================================
(session
  (date . "2025-12-09")
  (accomplishments
    ("ReScript migration" . "Full rewrite from TypeScript")
    ("Language guard" . "CI/CD blocks forbidden languages")
    ("Pre-commit hook" . "Blocks commits with TypeScript/npm")
    ("SCSS styles" . "Replaced CSS with SCSS")
    ("STATE.scm auto-update" . "Shell script + git hook")
    ("TypeScript purged" . "All .ts files removed")
    ("npm purged" . "package.json, node_modules removed"))

  (remaining-for-launch
    ("Zotero manifest" . "Update for Zotero 7")
    ("UI implementation" . "Popup.res")
    ("Build pipeline" . "ReScript → JS compilation")
    ("XPI packaging" . "Distributable plugin")))

;;; ===================================================================
;;; PHILOSOPHICAL CONTEXT
;;; ===================================================================
(philosophy
  (foundation . "Wittgenstein's Tractatus Logico-Philosophicus")
  (key-proposition . "What can be said at all can be said clearly")

  (nsai-domain
    (description . "The Sayable - formal validation")
    (approach . "Truth-functional analysis")
    (language . "ReScript - clarity through types"))

  (fogbinder-domain
    (description . "The Unsayable - uncertainty exploration")
    (approach . "Pragmatic investigation"))

  (handoff-metaphor . "Throwing away the ladder after climbing")
  (tractatus-reference . "6.54"))

;; End of STATE.scm
;; "Whereof one can validate clearly, thereof NSAI will speak.
;;  Whereof validation fails, thereof Fogbinder must explore."
