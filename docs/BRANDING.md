# Branding rules — Persevere with DSH

These rules are binding for every artifact in this collection: repository names, package
names, READMEs, release notes, commit messages, UI strings, and issue templates.

## Canonical names

```
Brand phrase (never abbreviated):  Persevere with DSH
GitHub org login:                  persevere-dsh
GitHub org display name:           Persevere with DSH
Collection repository:             persevere-dsh/plugins
Each plugin repository:            persevere-dsh/dsh-<name>
npm scope:                         @persevere-dsh/<name>
Short form (spoken docs only):     perse   ← first use must note "perse = persevere"
```

## Rules

### 1. The brand phrase is always complete

Every user-facing text writes **Persevere with DSH** in full — title, headline, footer,
first mention, tagline, package description, release title.

**Never** abbreviate it to `PWD`, `Pwd`, `Persevere`, `PWDSH`, `P-DSH`, or similar.

### 2. `PWD` is forbidden as an abbreviation

`PWD` collides with the Unix shell variable and the `pwd` command. Seeing `PWD` in a
repository, package, environment variable, or document is a bug: replace it with
`PERSEVERE_DSH` for identifiers or the full brand phrase for prose.

### 3. `perse` is spoken shorthand only

`perse` may appear in conversational documentation, internal notes, and verbal
descriptions of the project. It must **never** appear in:

- a repository name, GitHub org login, or npm package name;
- a user-visible product title or headline;
- a `package.json` `name` field or any other identifier.

At its **first occurrence** in any document, `perse` must be defined:

```md
`perse` = persevere
```

### 4. Identifiers are lowercase kebab-case

Every identifier — org, repository, package, directory, file, branch, workflow job —
uses lowercase letters, digits, and hyphens only:

| Kind | Pattern | Example |
| --- | --- | --- |
| Plugin repository | `persevere-dsh/dsh-<name>` | `persevere-dsh/dsh-update-center` |
| npm package | `@persevere-dsh/<name>` | `@persevere-dsh/update-center` |
| Workspace directory | `packages/<name>` | `packages/update-center` |
| Environment variable | `PERSEVERE_DSH_<THING>` | `PERSEVERE_DSH_PROFILE` |

`<name>` itself is lowercase kebab-case and describes the plugin, not the brand:
`update-center`, not `persevere-update-center` (the org already carries the brand).

### 5. Display name vs. login

Wherever a human-readable org name is needed, use the display name
**Persevere with DSH**. Wherever a machine-readable org is needed, use the login
`persevere-dsh`. The two are never swapped.

## Quick self-check

Before committing any user-facing text, confirm:

- [ ] **Persevere with DSH** appears in full at least once and is never abbreviated.
- [ ] The string `PWD` does not appear anywhere.
- [ ] If `perse` appears, its first occurrence is followed by `= persevere`.
- [ ] Every identifier is lowercase kebab-case.
- [ ] The footer line `Part of Persevere with DSH` is present in each README.
