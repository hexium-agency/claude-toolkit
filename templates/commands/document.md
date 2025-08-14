---
allowed-tools: [Read, Write, Glob, Grep, LS, Edit, MultiEdit]
argument-hint: <target> [--type inline|centralized] [--level brief|detailed]
description: Generate comprehensive documentation for code, features, and system architecture
model: claude-3-5-sonnet-latest
---

# /hxm:document - Intelligent Documentation Generator

## Purpose

Generate comprehensive documentation for codebases, features, and system architecture with flexible output formats and detail levels.

## Usage

```bash
/hxm:document <target> [--type inline|centralized] [--level brief|detailed]
```

## Arguments

- `target` - File path, directory, or feature name to document
- `--type` - Documentation format (default: inline)
  - `inline`: Generate documentation directly in code files (comments, JSDoc, docstrings)
  - `centralized`: Create structured documentation in `/documentation/` folder
- `--level` - Documentation depth (default: brief)
  - `brief`: Essential documentation with concise descriptions
  - `detailed`: Comprehensive documentation with examples and usage patterns

## Process

1. **Target Analysis**
   - Analyze the specified target (file, directory, or feature)
   - Identify programming languages and frameworks in use
   - Determine existing documentation patterns and conventions
   - Map dependencies and relationships
   - Detect documentation categories needed:
     - Scan for external API usage (imports, HTTP clients, SDKs)
     - Identify package structure (multiple modules, monorepo patterns)
     - Find deployment configurations (Docker, CI/CD, cloud configs)
     - Detect API endpoints (routes, controllers, GraphQL schemas)
     - Locate error handling and validation patterns

2. **Documentation Strategy Selection**
   - **Inline Type**: Generate language-specific documentation within source files
     - JavaScript/TypeScript: JSDoc comments
     - Python: Docstrings and type hints
     - Java: Javadoc comments
     - C#: XML documentation comments
     - Go: Go doc comments
     - Rust: Rust doc comments
   - **Centralized Type**: Create structured documentation folder hierarchy
     - Create `/documentation/` at project root
     - Generate `index.md` with project overview and navigation
     - Analyze target to determine relevant documentation categories
     - Create only necessary subject-based folders based on project analysis:
       - `features/` - When user-facing features are detected
       - `external-api/` - When third-party API integrations are found
       - `packages/` - When multiple modules/packages exist
       - `architecture/` - For complex systems with multiple components
       - `deployment/` - When deployment configurations are present
       - `api/` - When API endpoints or services are detected
       - `troubleshooting/` - When error handling patterns are identified

3. **Content Generation**
   - **Brief Level**: Generate essential documentation
     - Function/class purpose and basic usage
     - Key parameters and return values
     - Simple examples where helpful
     - Overview of main features and concepts
     - **For centralized brief**: Create concise `index.md` (under 20 lines) with direct file links
   - **Detailed Level**: Generate comprehensive documentation
     - Complete API documentation with all parameters
     - Usage patterns and best practices
     - Code examples and integration guides
     - Edge cases and error handling
     - Performance considerations
     - Related components and dependencies
     - **For centralized detailed**: Create full structure with organized folders

4. **Documentation Structure (Centralized Type)**
   - Create `/documentation/` directory at project root
   - **For brief level**: Create simple `index.md` with essential overview and direct links to key files
   - **For detailed level**: Create comprehensive structure with subject folders
   - Analyze target to determine if subject folders are needed:
     - Single file target: Document directly in `documentation/[filename].md`
     - Simple project: Basic `index.md` with essential links
     - Complex project: Create relevant subject folders and organize content
   - **Subject folders**: Only create when content justifies organization
   - **Cross-references**: Link between related documentation files

5. **Quality Assurance**
   - Ensure documentation follows project conventions
   - Validate code examples and syntax
   - Check for consistency in tone and format
   - Verify all references and links work correctly

## Examples

### Inline Documentation

```bash
/hxm:document src/auth/login.js --type inline --level detailed
# Generates JSDoc comments directly in the login.js file
```

### Centralized Documentation

```bash
/hxm:document src/payment --type centralized --level brief
# Creates documentation/features/payment.md with overview
# Only creates folders relevant to payment functionality
```

### Full Project Documentation

```bash
/hxm:document . --type centralized --level detailed
# Analyzes entire project and creates documentation structure
# Only includes folders for detected components (e.g., skips external-api/ if none found)
```

## Output Structure (Centralized Type)

**Note**: Only relevant folders are created based on project analysis. Example for a full-featured web application:

```
documentation/
├── index.md                    # Project overview and navigation
├── features/                   # Created when user-facing features detected
│   ├── authentication.md      # User authentication system
│   ├── payment-processing.md  # Payment workflows
│   └── user-management.md     # User account features
├── external-api/              # Created when external integrations found
│   ├── stripe-integration.md  # Payment gateway integration
│   ├── sendgrid-emails.md     # Email service integration
│   └── oauth-providers.md     # Third-party authentication
├── packages/                  # Created when multiple modules detected
│   ├── core-utilities.md      # Shared utility functions
│   ├── database-layer.md      # Data access patterns
│   └── validation-schemas.md  # Input validation system
├── architecture/              # Created for complex multi-component systems
│   ├── system-overview.md     # High-level architecture
│   ├── data-flow.md          # Data flow and state management
│   └── security-model.md     # Security architecture
├── deployment/                # Created when deployment configs present
│   ├── local-development.md  # Development environment setup
│   ├── staging-deployment.md # Staging environment guide
│   └── production-deploy.md  # Production deployment process
├── api/                       # Created when API endpoints detected
│   ├── authentication.md     # Auth endpoints
│   └── payment-api.md        # Payment service API
└── troubleshooting/           # Created when error handling patterns found
    ├── common-issues.md      # Frequently encountered problems
    └── debugging-guide.md   # Debugging workflows and tools
```

**Brief centralized example** (single file target):

```
documentation/
├── index.md                   # Simple overview with links
└── claude-setup.md           # Direct documentation for the target file
```

**Detailed centralized example** (complex project):

```
documentation/
├── index.md                   # Comprehensive overview with navigation
├── packages/                  # Multiple modules detected
│   └── setup-system.md      # Installation system documentation
└── troubleshooting/           # Error handling patterns found
    └── common-issues.md      # Installation and configuration issues
```

## Notes

- **Brief centralized**: Creates minimal structure with concise index.md and direct file documentation
- **Detailed centralized**: Creates comprehensive folder structure only when justified by project complexity
- Subject folders are created only when analysis detects relevant content patterns
- Single file targets get documented directly without unnecessary folder nesting
- For centralized documentation, existing files are updated rather than overwritten
- Cross-references between documentation files are automatically generated
- Documentation follows markdown best practices with proper headers and formatting
