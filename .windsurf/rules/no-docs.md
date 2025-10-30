---
trigger: model_decision
description: Apply this rule when working on any coding task or feature implementation.
---

# Minimal Documentation Rule

## When to Apply
Apply this rule when working on any coding task or feature implementation.

## Rule
Do not create additional documentation files (README files, setup guides, deployment guides, etc.) unless explicitly requested by the user. Focus on implementing the requested functionality with minimal file creation.

## Guidelines

### What NOT to create automatically:
- Setup guides or installation instructions
- Deployment documentation 
- Usage guides or tutorials
- Additional README files
- Configuration explanations
- Troubleshooting guides
- Feature documentation

### What IS acceptable to create:
- Core implementation files (code, configuration, etc.)
- Files explicitly requested by the user
- Essential configuration files required for functionality
- Comments within code files for complex logic

### Exceptions:
- If the user specifically asks for documentation
- If documentation is critical for the functionality to work
- If updating existing documentation is necessary for accuracy

### Best Practices:
- Keep explanations concise and inline with code when possible
- Use code comments instead of separate documentation files
- Focus on delivering working functionality over comprehensive documentation
- Ask the user if they want documentation rather than assuming they do

## Example
❌ **Don't do this**: Create `DEPLOYMENT_GUIDE.md` when adding a GitHub Action
✅ **Do this**: Create the GitHub Action workflow file with clear inline comments

❌ **Don't do this**: Create `SETUP.md` when adding a new dependency  
✅ **Do this**: Add the dependency and mention setup in existing README if needed

## Rationale
Users often prefer minimal file creation and can request documentation separately if needed. This prevents workspace cluttering and focuses on core functionality delivery.