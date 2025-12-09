;; ECOSYSTEM.scm - Hyperpolymath Meta-Project Coordination
;; This file is the SINGLE SOURCE OF TRUTH for cross-repo alignment.
;; Copy this EXACT file to each repo. Changes propagate from ecosystem repo.
;;
;; Canonical source: https://github.com/hyperpolymath/ecosystem/ECOSYSTEM.scm
;; Last sync: 2025-12-09

;;; ===================================================================
;;; META-PROJECT STRUCTURE
;;; ===================================================================
(ecosystem
  (name . "Hyperpolymath Research Tools")
  (version . "0.1.0")
  (philosophy . "Tractarian clarity meets pragmatic uncertainty")
  (canonical-repo . "https://github.com/hyperpolymath/ecosystem"))

;;; ===================================================================
;;; PROJECT REGISTRY (Authoritative List)
;;; ===================================================================
(projects
  ;; FOUNDATION
  (zotero-rescript-templater
    (repo . "https://github.com/hyperpolymath/zotero-rescript-templater")
    (purpose . "Spawns RSR-compliant Zotero plugins")
    (priority . 1)
    (status . "needs-fix")
    (blocks . (nsai voyant-export fogbinder))
    (mvp-tasks
      ("Purge TypeScript Student template")
      ("Update to Zotero 7 WebExtension")
      ("Add RSR scaffolding")
      ("Add CUE config generation")))

  ;; REFERENCE
  (zotero-voyant-export
    (repo . "https://github.com/hyperpolymath/zotero-voyant-export")
    (purpose . "Reference implementation - Voyant Tools export")
    (priority . 2)
    (status . "needs-rsr-alignment")
    (blocks . ())
    (mvp-tasks
      ("Add Guile tooling")
      ("Add missing .well-known files")
      ("Verify CUE config")))

  ;; CORE PRODUCTS
  (zotero-nsai
    (repo . "https://github.com/hyperpolymath/zotero-nsai")
    (purpose . "Tractarian validation, certainty scoring")
    (priority . 3)
    (status . "rescript-complete")
    (blocks . (fogbinder))
    (mvp-tasks
      ("ReScript compilation test")
      ("XPI packaging")
      ("Zotero 7 integration test")))

  (fogbinder
    (repo . "https://github.com/hyperpolymath/fogbinder")
    (purpose . "Uncertainty navigation, contradiction detection")
    (priority . 3)
    (status . "verify-rsr")
    (blocks . ())
    (mvp-tasks
      ("Verify RSR compliance")
      ("Test NSAI handoff format")
      ("WASM compilation")))

  ;; BACKEND
  (bofig
    (repo . "https://github.com/hyperpolymath/bofig")
    (purpose . "Elixir GraphQL backend infrastructure")
    (priority . 4)
    (status . "clean")
    (blocks . ())
    (mvp-tasks
      ("Phoenix setup")
      ("Absinthe schema")
      ("NSAI/Fogbinder API")))

  ;; SCAFFOLDING
  (zoterho-template
    (repo . "https://github.com/hyperpolymath/zoterho-template")
    (purpose . "RSR compliance scaffolding")
    (priority . 2)
    (status . "needs-manifest")
    (blocks . ())
    (mvp-tasks
      ("Add Zotero 7 manifest template")))

  (consent-aware-http
    (repo . "https://github.com/hyperpolymath/consent-aware-http")
    (purpose . "AI consent standards (AIBDP)")
    (priority . 5)
    (status . "reference")
    (blocks . ())
    (mvp-tasks . ())))

;;; ===================================================================
;;; LANGUAGE POLICY (Enforced Ecosystem-Wide)
;;; ===================================================================
(language-policy
  (version . "1.0")

  (accepted
    (rescript . "Primary for browser/Zotero plugins")
    (guile . "Tooling, configuration, STATE files")
    (elixir . "Backend services")
    (rust . "WASM, performance-critical")
    (lean4 . "Formal verification")
    (julia . "Statistical analysis (v2.0)")
    (scss . "Styles")
    (cue . "Configuration generation")
    (shell . "Simple scripts (prefer Guile)"))

  (banned
    (typescript . "Use ReScript")
    (coffeescript . "Obsolete")
    (go . "Not in stack")
    (npm . "Use Deno")
    (python . "Except Salt-related")))

;;; ===================================================================
;;; RSR STANDARD FORM (Canonical Reference)
;;; ===================================================================
(rsr-standard-form
  (version . "1.0")
  (tier . "Rhodium")

  (required-files
    ;; .well-known
    ("security.txt" . "RFC 9116")
    ("ai.txt" . "AI training policy")
    ("humans.txt" . "humanstxt.org")
    ("void.ttl" . "VOID RDF")
    ("host-meta.json" . "XRD discovery")
    ("aibdp.json" . "AI Boundary Declaration Protocol")
    ;; Config
    ("config/project.cue" . "Single source of truth")
    ("deno.json" . "Deno runtime")
    ("rescript.json" . "ReScript compiler")
    ("justfile" . "Build recipes")
    ;; Docs
    ("STATE.scm" . "Project checkpoint")
    ("ECOSYSTEM.scm" . "Meta-project reference")
    ("RSR-STANDARD-FORM.adoc" . "RSR specification")
    ;; CI
    ("language-guard.yml" . "Forbidden language enforcement")
    ("pre-commit" . "Local language check"))

  (required-tools
    (pandoc . "Document conversion")
    (asciidoctor . "AsciiDoc rendering")
    (zola . "Static site generation")
    (hunspell . "Spell checking")
    (agrep . "Approximate grep")
    (cue . "Config generation")))

;;; ===================================================================
;;; INTERFACE CONTRACTS
;;; ===================================================================
(interfaces
  (nsai-to-fogbinder
    (version . "1.0.0")
    (format . "JSON")
    (schema . "src/Types/FogbinderInterface.res")
    (trigger . "certainty < 0.7"))

  (fogbinder-to-bofig
    (version . "0.1.0")
    (format . "GraphQL")
    (schema . "TBD"))

  (zotero-plugin
    (version . "Zotero 7+")
    (format . "WebExtension manifest v2")
    (min-version . "7.0")))

;;; ===================================================================
;;; HANDOVER PROTOCOL
;;; ===================================================================
(handover-protocol
  (description . "How to brief Claude sessions on each project")

  (required-context
    ("ECOSYSTEM.scm" . "This file - meta-project coordination")
    ("STATE.scm" . "Project-specific checkpoint")
    ("RSR-STANDARD-FORM.adoc" . "What files/structure required")
    ("Language policy" . "What languages allowed/banned"))

  (handover-template . "
## PROJECT HANDOVER: {{PROJECT_NAME}}

### Ecosystem Context
This project is part of the Hyperpolymath Research Tools ecosystem.
Read ECOSYSTEM.scm FIRST for cross-project coordination.

### Project Role
{{PROJECT_PURPOSE}}

### Priority: {{PRIORITY}}
{{BLOCKS_INFO}}

### Current Status
{{STATUS}}

### MVP Tasks (in order)
{{MVP_TASKS}}

### Language Policy
ACCEPTED: ReScript, Guile, Elixir, Rust, Lean4, Julia, SCSS, CUE, Shell
BANNED: TypeScript, CoffeeScript, Go, npm, Python (non-Salt)

### Interface Contracts
{{INTERFACE_INFO}}

### RSR Compliance
Must include all files from rsr-standard-form section of ECOSYSTEM.scm.

### DO NOT
- Add TypeScript or npm
- Diverge from RSR Standard Form
- Change interface contracts without updating ECOSYSTEM.scm
- Work on blocked projects before blockers are resolved
"))

;;; ===================================================================
;;; SYNC INSTRUCTIONS
;;; ===================================================================
(sync
  (description . "How to keep repos aligned")

  (on-ecosystem-change
    ("1. Update ECOSYSTEM.scm in ecosystem repo")
    ("2. Run sync script to propagate to all projects")
    ("3. Each project CI verifies ECOSYSTEM.scm hash matches"))

  (on-project-change
    ("1. Update project STATE.scm")
    ("2. If interface changed, update ECOSYSTEM.scm")
    ("3. Notify dependent projects via issue/PR")))

;; End of ECOSYSTEM.scm
;; "The limits of my ecosystem mean the limits of my world."
