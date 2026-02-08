# Coding Style

## Regular Expressions

### Avoid Lookbehind

We don't want look-behind in general. For one thing, it's not cross-platform (e.g. it is not supported in some older versions of Safari). For another thing, it can have weird performance issues, and it just complicates one's mental model of how the regex is evaluated.
