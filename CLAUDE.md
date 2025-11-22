# Zotero-NSAI Project

## Project Overview

NSAI (Neurosymbolic AI) is a Zotero plugin that validates and prepares research data using neurosymbolic reasoning. It serves as a companion tool to **Fogbinder** (Hyperpolymath/fogbinder):

- **NSAI**: Validates and prepares research data, ensures quality and consistency
- **Fogbinder**: Navigates epistemic ambiguity, explores contradictions and uncertainty

### Relationship to Fogbinder

These are complementary tools for research analysis:
- NSAI provides the foundation: validation, verification, data preparation
- Fogbinder explores the unknown: contradiction detection, mood scoring, mystery clustering, FogTrail visualization

Both may share a neurosymbolic core but serve different purposes in the research workflow.

## Project Structure

This is a new repository in the pre-implementation stage. Project structure will be established based on architectural decisions below.

### Proposed Architecture

**Technology Stack (Reference)**:
- **Lean 4 WASM**: Formal verification and neurosymbolic reasoning
- **ONNX Runtime**: Machine learning inference
- **Elixir GraphQL**: Backend API layer
- **ReScript**: Type-safe frontend/plugin code

(Architecture decisions to be finalized before implementation)

## Development Setup

### Prerequisites

(To be determined based on technology stack)

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd zotero-nsai

# Installation steps to be added
```

### Running the Project

```bash
# Commands to be added as the project develops
```

## Current State

**Status**: Empty scaffold, pre-implementation stage

**Repository**: Hyperpolymath/zotero-nsai
**Branch**: `claude/create-claude-md-0173ijqZdQbHT7i9X3sHRmPJ`

**What Exists**:
- CLAUDE.md (this file)

**What Doesn't Exist Yet**:
- No source code implementation
- No build system or dependencies
- No manifest or plugin configuration
- No data models or core features

## Design Principles

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Full keyboard navigation support
- High contrast UI modes
- Screen reader compatibility

### Privacy & Security
- Sanitize all user inputs
- No API key storage in plugin
- No user tracking or telemetry
- Local-first processing where possible
- Explicit user consent for external services

### Code Quality
- Type-safe implementation (ReScript/TypeScript)
- Formal verification for critical logic (Lean 4)
- Comprehensive test coverage
- Clear documentation and examples

## Visual Identity

**Theme**: NCIS/Investigation Aesthetic
- **Primary Colors**: Navy blue, cyan
- **Mood**: Professional, analytical, investigative
- **Contrast with Fogbinder**: Dark mystery theme for uncertainty navigation

## License

**GNU AGPLv3** - Ensures open source and copyleft protection

## Important Files and Directories

(To be documented as project structure is established)

## Development Guidelines

### Code Style

- Follow consistent code formatting
- Write clear, descriptive commit messages
- Add comments for complex logic

### Testing

- Write tests for new features
- Ensure all tests pass before committing

### Git Workflow

- Development branch: `claude/create-claude-md-0173ijqZdQbHT7i9X3sHRmPJ`
- Create feature branches from main development branch
- Use descriptive branch names
- Write clear commit messages

## Next Steps & Key Decisions

### Critical Decisions Needed

1. **Scope Definition**
   - What specific validation/preparation features does NSAI provide?
   - How does NSAI interface with Fogbinder?
   - Is there a shared neurosymbolic core, or are they separate?

2. **Architecture Finalization**
   - Confirm technology stack (Lean 4 WASM + ONNX + Elixir + ReScript?)
   - Zotero plugin framework: Bootstrap vs WebExtension
   - Build system: Webpack, esbuild, or Vite?

3. **Data Model**
   - How are sources/citations represented?
   - What metadata does NSAI validate?
   - Storage format for validation results

4. **MVP Feature Set**
   - What's the minimum viable validation capability?
   - Which features ship in v0.1.0?

### Proposed Implementation Phases

**Phase 1: Foundation**
- Set up build system and TypeScript/ReScript configuration
- Create Zotero plugin manifest
- Implement basic plugin scaffolding

**Phase 2: Core Validation**
- Define data models for sources and citations
- Implement basic validation rules
- Create UI for displaying validation results

**Phase 3: Neurosymbolic Integration**
- Integrate Lean 4 WASM for formal verification
- Add ONNX Runtime for ML-based validation
- Implement GraphQL API if needed

**Phase 4: Fogbinder Integration**
- Define shared interfaces between NSAI and Fogbinder
- Implement data exchange protocols
- Test end-to-end workflow

## Common Tasks

### Adding New Features

1. Create a feature branch from main development branch
2. Implement the feature with type safety
3. Add formal verification for critical logic
4. Write comprehensive tests
5. Update documentation
6. Submit for review

### Running Tests

```bash
# Test commands to be added based on chosen framework
# e.g., npm test, cargo test, mix test
```

### Building

```bash
# Build commands to be added based on build system
# Will likely involve bundling for Zotero plugin format
```

## Troubleshooting

(Common issues and solutions to be documented as they arise)

## Additional Resources

### Zotero Development
- [Zotero Plugin Development](https://www.zotero.org/support/dev/client_coding/plugin_development)
- [Zotero API Documentation](https://www.zotero.org/support/dev/client_coding/javascript_api)
- [Zotero Plugin Architecture](https://www.zotero.org/support/dev/client_coding/plugin_architecture)

### Technology Stack
- [Lean 4 Documentation](https://leanprover.github.io/lean4/doc/)
- [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/)
- [ReScript Documentation](https://rescript-lang.org/docs/manual/latest/introduction)
- [Elixir GraphQL (Absinthe)](https://hexdocs.pm/absinthe/overview.html)

### Related Projects
- **Fogbinder** (Hyperpolymath/fogbinder): Companion tool for navigating epistemic ambiguity
  - Branch: `claude/nsai-zotero-handover-01KAMcbpSLyKK3VfyyCXVhf9`
  - Features: Contradiction detection, mood scoring, mystery clustering, FogTrail visualization

## Notes for AI Assistants

### Project Context
- **Status**: Pre-implementation, empty scaffold
- **Purpose**: Validation and preparation layer for Zotero research data
- **Companion to**: Fogbinder (uncertainty navigation)
- **Key Distinction**: NSAI validates/prepares, Fogbinder explores/questions

### Development Approach
- All architecture decisions must be discussed before implementation
- Prioritize type safety and formal verification for critical logic
- Maintain strict accessibility standards (WCAG AA minimum)
- Privacy-first: no tracking, local-first processing
- Follow the GNU AGPLv3 license requirements

### Before Implementing
1. Clarify scope and feature requirements with user
2. Confirm technology stack choices
3. Define data models and interfaces
4. Establish testing strategy
5. Set up build system and development environment

### During Implementation
- Write type-safe code (ReScript/TypeScript)
- Add formal verification for critical logic paths (Lean 4)
- Include accessibility features from the start
- Sanitize all inputs for security
- Document architectural decisions
- Always run tests before committing
- Update this CLAUDE.md as the project evolves

### Theme & UX
- NCIS aesthetic: navy blue, cyan color scheme
- Professional, analytical, investigative mood
- Clear visual distinction from Fogbinder's dark mystery theme
- Emphasize trust, reliability, and precision in UI design
