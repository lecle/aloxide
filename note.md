<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of content**

- [Command for releasing new version](#command-for-releasing-new-version)
  - [Prerequisite](#prerequisite)
  - [Commands](#commands)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Command for releasing new version

## Prerequisite

- Logging into the appropriate npm account
- Generate GitHub token https://github.com/settings/tokens

## Commands

Remember to run commands below at the **newest code** from **master branch**.

```bash
export GH_TOKEN=<secret token>
lerna publish --create-release github
```

- [ ] TODO setup a CI
