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
  (last-updated . "2025-12-09T21:00:00Z")
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
      "security.txt, ai.txt, humans.txt, void.ttl, host-meta.json, aibdp.json")
    ("Auto-update" .
      "Shell script + git hook for STATE.scm updates")
    ("RSR Compliance" .
      "Full RSR Standard Form v1.0 - Rhodium tier")
    ("Coordination" .
      "elegant-STATE integration + rhodibot Category 12"))

  (key-files
    ("src/Validation/Validator.res" . "Core validation engine")
    ("src/Fogbinder/Handoff.res" . "Fogbinder integration manager")
    ("src/Types/Atomic.res" . "Tractarian data models")
    ("src/Types/FogbinderInterface.res" . "Handoff payload types")
    ("src/Formats/CitationFormats.res" . "Harvard, OSCOLA, MLA, Dublin Core")
    ("styles/popup.scss" . "NCIS-themed styles")
    ("rescript.json" . "ReScript compiler config")
    ("deno.json" . "Deno runtime config")
    (".rhodibot.ncl" . "Rhodibot compliance config")
    ("config/elegant-state.ncl" . "elegant-STATE coordination")
    ("ECOSYSTEM.scm" . "Meta-project coordination")))

;;; ===================================================================
;;; LANGUAGE POLICY
;;; ===================================================================
(language-policy
  (accepted
    ("ReScript" . ".res, .resi - Primary language")
    ("Guile/Scheme" . ".scm - Tooling, STATE files")
    ("SCSS" . ".scss - Styles")
    ("Shell" . ".sh - Scripts")
    ("Nickel" . ".ncl - Type-safe config")
    ("CUE" . ".cue - Config generation")
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
    ("Rhodibot" . "Category 12 language policy enforcement")
    ("CI/CD" . "language-guard.yml fails build on forbidden files")
    ("Pre-commit" . ".githooks/pre-commit blocks commits")
    ("Documentation" . "STATE.scm + .rhodibot.ncl record policy")))

;;; ===================================================================
;;; ROUTE TO MVP v1.0.0
;;; ===================================================================
(route-to-v1
  (phase-1-web-standards
    (name . "Web Standards Compliance")
    (status . "COMPLETE")
    (completed
      ("Dublin Core metadata" . "popup.html has dc: prefixed meta tags")
      ("VOID dataset description" . "void.ttl created")
      ("security.txt" . "Expires updated to 2026-12-09")
      (".well-known/host-meta" . "XRD and JSON versions created")
      (".well-known/aibdp.json" . "AI Boundary Declaration Protocol")))

  (phase-2-architecture-migration
    (name . "ReScript + Deno Migration")
    (status . "COMPLETE")
    (completed
      ("deno.json" . "Deno configuration created")
      ("rescript.json" . "ReScript compiler configuration")
      ("Validator.res" . "Core validation logic ported")
      ("Handoff.res" . "Fogbinder integration ported")
      ("Atomic.res" . "Type definitions ported")
      ("FogbinderInterface.res" . "Handoff types ported")
      ("CitationFormats.res" . "Harvard, OSCOLA, MLA, Dublin Core")
      ("SCSS" . "popup.scss with mixins and variables")
      ("TypeScript purged" . "All .ts files deleted")
      ("npm purged" . "package.json, node_modules deleted")))

  (phase-3-rsr-compliance
    (name . "RSR Standard Form")
    (status . "COMPLETE")
    (completed
      ("RSR-STANDARD-FORM.adoc" . "Canonical specification")
      (".rhodibot.ncl" . "Rhodibot compliance config")
      ("config/elegant-state.ncl" . "Coordination integration")
      ("ECOSYSTEM.scm" . "Meta-project coordination")
      ("guix/channels.scm" . "Guix package definition")
      ("nix/flake.nix" . "Nix flake with dev shell")
      ("zola/config.toml" . "Static site configuration")
      ("formal-verification/" . "Verification roadmap")))

  (phase-4-zotero-integration
    (name . "Zotero 7 Integration")
    (status . "IN PROGRESS")
    (target . "Zotero 7+ only (deny earlier versions)")
    (remaining
      ("ReScript compilation test" . "Build .res → .res.js")
      ("SCSS compilation" . "Build .scss → .css")
      ("XPI packaging" . "Distributable plugin")
      ("Zotero library API connection" . "Read citations")
      ("Integration test" . "End-to-end validation")))

  (phase-5-release
    (name . "v1.0.0 Release")
    (status . "pending")
    (tasks
      ("Test suite" . "ReScript tests with assertions")
      ("Documentation" . "User guide")
      ("Release notes" . "CHANGELOG.md update"))))

;;; ===================================================================
;;; TECHNOLOGY STACK
;;; ===================================================================
(stack
  (current
    (language . "ReScript 11+")
    (runtime . "Deno 2.x")
    (styles . "SCSS")
    (config . "Nickel + CUE")
    (build . "ReScript compiler + Deno")
    (ci . "GitHub Actions + Rhodibot")
    (coordination . "elegant-STATE + ECOSYSTEM.scm"))

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
    (purpose . "Zotero plugin scaffolding"))

  (zotero-rescript-templater
    (repository . "https://github.com/hyperpolymath/zotero-rescript-templater")
    (purpose . "RSR-compliant plugin generator")
    (status . "needs-fix"))

  (rhodibot
    (repository . "https://github.com/hyperpolymath/gitvisor/satellite-repos/rhodibot")
    (purpose . "RSR enforcement bot")
    (integration . "Category 12 language policy"))

  (elegant-STATE
    (repository . "https://github.com/hyperpolymath/elegant-STATE")
    (purpose . "Multi-agent coordination")
    (integration . "GraphQL sync")))

;;; ===================================================================
;;; SESSION LOG (2025-12-09)
;;; ===================================================================
(session
  (date . "2025-12-09")
  (accomplishments
    ("ReScript migration" . "Full rewrite from TypeScript")
    ("Language guard" . "CI/CD blocks forbidden languages")
    ("RSR Standard Form" . "Full Rhodium tier compliance")
    ("Rhodibot Category 12" . "Language policy enforcement spec")
    ("elegant-STATE integration" . "Nickel config for coordination")
    ("Citation formats" . "Harvard, OSCOLA, MLA, Dublin Core, BibTeX, RIS")
    ("ECOSYSTEM.scm" . "Meta-project coordination")
    ("TypeScript purged" . "All .ts files removed")
    ("npm purged" . "package.json, node_modules removed"))

  (remaining-for-launch
    ("ReScript compilation" . "Build .res → .res.js")
    ("SCSS compilation" . "Build .scss → .css")
    ("XPI packaging" . "Distributable plugin")
    ("Integration test" . "End-to-end with Zotero 7")))

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
