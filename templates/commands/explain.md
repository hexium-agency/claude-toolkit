---
allowed-tools: [Read, Grep, Glob, Bash]
description: 'Break down and explain code structures, patterns, and system architecture'
---

# /hxm:explain - Code Architecture & Pattern Explanation

## Purpose

Break down complex code structures, architectural patterns, and system designs into understandable explanations tailored to different technical backgrounds.

## Usage

```
/hxm:explain <target> [--audience developer|architect|junior] [--style technical|visual|tutorial]
```

## Arguments

- `target` - File path, function name, module, or architectural concept to explain
- `--audience` - Target audience level (developer, architect, junior) - default: developer
- `--style` - Explanation approach (technical deep-dive, visual diagrams, step-by-step tutorial) - default: technical deep-dive

## Process

1. **Code Discovery & Analysis**
   - Locate and examine the specified target in the codebase
   - Map dependencies, imports, and related components
   - Identify design patterns and architectural decisions

2. **Context Building**
   - Understand the target's role within the larger system
   - Analyze data flow and interaction patterns
   - Determine complexity level and key concepts

3. **Explanation Structuring**
   - Adapt explanation depth based on target audience
   - Organize content from high-level overview to implementation details
   - Select appropriate examples and analogies

4. **Content Generation**
   - Create clear, structured explanations with proper formatting
   - Include relevant code snippets with annotations
   - Provide practical examples and use cases where helpful
