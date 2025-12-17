# NSAI Roadmap

> Last updated: December 2024

## Current Status: v0.1.0-alpha

### Completed

**Core Validation Engine**
- [x] ReScript-based Tractarian validator (`src/validation/Validator.res`)
- [x] Atomic citation data models (`src/types/Atomic.res`)
- [x] Structural completeness validation
- [x] Format consistency validation (dates, DOIs, ISBNs)
- [x] Certainty scoring (0.0-1.0 scale)
- [x] Validation state determination (Valid, Incomplete, Inconsistent, Uncertain)

**Build System & Configuration**
- [x] Vite build system (v6.x)
- [x] ReScript 11.x compiler with @rescript/core
- [x] ESLint 9.x with flat config
- [x] Vitest test framework
- [x] Zero npm vulnerabilities

**Documentation**
- [x] README.adoc with usage instructions
- [x] PHILOSOPHY.md (Tractarian foundation)
- [x] FOGBINDER-HANDOFF.md (integration spec)
- [x] SECURITY.md with vulnerability reporting
- [x] CLAUDE.md (project context)
- [x] RSR-COMPLIANCE.md

**Security & CI/CD**
- [x] GitHub Security Advisories integration
- [x] OSSF Scorecard workflow
- [x] Security policy workflow
- [x] Dependabot configuration

---

## Phase 1: Testing & Quality (v0.1.1)

**Priority: High**

- [ ] Write unit tests for Validator module
  - Structural validation tests
  - Date format validation tests
  - DOI/ISBN validation tests
  - Certainty scoring tests
- [ ] Write unit tests for Atomic types
- [ ] Add test coverage reporting
- [ ] Set up CI workflow for tests
- [ ] Add pre-commit hooks for linting/tests

---

## Phase 2: Fogbinder Integration (v0.2.0)

**Priority: High**

- [ ] Implement FogbinderHandoff module in ReScript
  - Uncertainty region detection
  - Contradiction hint generation
  - Epistemic summary creation
  - JSON export format (nsai-to-fogbinder v1.0.0)
- [ ] Certainty boundary determination
- [ ] Export package generation
- [ ] Integration tests with Fogbinder schemas

---

## Phase 3: Zotero Integration (v0.3.0)

**Priority: High**

- [ ] Zotero API integration
  - Read selected items from library
  - Convert Zotero items to AtomicCitation
  - Handle batch operations
- [ ] Context menu integration
  - "Validate Selection" menu item
  - "Export to Fogbinder" menu item
- [ ] Zotero 6.x compatibility
- [ ] Zotero 7.x compatibility testing

---

## Phase 4: User Interface (v0.4.0)

**Priority: Medium**

- [ ] Implement popup controller (popup.ts/res)
  - Display validation results
  - Certainty meter visualization
  - Issue list with suggestions
- [ ] Settings panel
  - Certainty threshold configuration
  - Validation rule toggles
  - Export options
- [ ] Keyboard shortcuts implementation
  - Cmd/Ctrl + V: Validate
  - Cmd/Ctrl + E: Export
  - Esc: Close popup
- [ ] Progress indicators for batch operations
- [ ] Toast notifications for status updates

---

## Phase 5: Distribution (v0.5.0)

**Priority: Medium**

- [ ] Create .xpi package build script
- [ ] Icon assets (NSAI logo)
- [ ] Chrome/Firefox WebExtension manifest v3
- [ ] GitHub Releases integration
- [ ] Installation documentation
- [ ] Update.json for auto-updates

---

## Phase 6: Localization (v0.6.0)

**Priority: Low**

- [ ] i18n infrastructure setup
- [ ] English (en) base translations
- [ ] Spanish (es) translations
- [ ] French (fr) translations
- [ ] German (de) translations
- [ ] Contribution guide for translators

---

## Future Enhancements

### Neurosymbolic Core (v1.0+)

- [ ] **Lean 4 WASM Integration**
  - Formal verification of validation logic
  - Proof-carrying validation results
  - Mathematical certainty guarantees

- [ ] **ONNX Runtime Integration**
  - ML-based citation similarity detection
  - Author disambiguation
  - Field prediction for incomplete citations

### Backend Services (v2.0+)

- [ ] **Elixir GraphQL API**
  - Cloud sync for validation history
  - Cross-library analysis
  - Team collaboration features

- [ ] **Fogbinder Deep Integration**
  - Bidirectional data flow
  - Real-time contradiction detection
  - Shared uncertainty models

---

## Non-Goals

Things we explicitly choose NOT to do:

- **Tracking/Telemetry**: Privacy-first always
- **Cloud Dependencies**: Local-first processing
- **Subscription Models**: AGPL ensures freedom
- **Proprietary Formats**: Open standards only
- **Complex UI**: Investigative simplicity

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to help with roadmap items.

**Good First Issues:**
- Writing unit tests for existing validators
- Adding new item type support
- Improving documentation

**Needs Help:**
- ReScript expertise for complex modules
- Zotero plugin development experience
- Accessibility testing
