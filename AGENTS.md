# Instructions for AI agents

## Development workflow

When I say "go", do the following steps in order:

- Run `make`.
- If any tests fail, write production code to make them pass. DO NOT
  change the tests. If you cannot make the tests pass after 3 attempts, stop
  and wait for further instructions.
- Otherwise, search the codebase for TODOs using `ag TODO`.
- If there are no TODOs, stop and wait for further instructions.
- Otherwise, choose the easiest TODO and fix it.
- Run `make`.
- If all tests pass, stop and say "done."
- Otherwise, try to make the tests pass by changing ONLY production code. DO
  NOT change the tests. If you cannot make the tests pass after 3 attempts,
  stop and wait for further instructions.
