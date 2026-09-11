# Branding rules — Persevere with DSH

These rules are binding for every artifact in this collection: repository names, package
names, READMEs, release notes, commit messages, UI strings, and issue templates.

## Canonical names

```
Brand phrase (never abbreviated):  Persevere with DSH
GitHub org login:                  persevere-dsh
GitHub org display name:           Persevere with DSH
Collection repository (index):     persevere-dsh/plugins
Each plugin repository:            persevere-dsh/perse-<name>
npm package:                       perse-<name>
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

### 3. `perse` is spoken shorthand and the plugin prefix

`perse` may appear in conversational documentation and internal notes, and it is the
mandatory prefix on plugin identifiers: repository `persevere-dsh/perse-<name>`, npm
package `perse-<name>`, plugin id `perse-<name>`.

At its **first occurrence** in any document, `perse` must be defined:

```md
`perse` = persevere
```

It must **never**:

- replace the brand phrase **Persevere with DSH** in a user-visible title or headline;
- appear as an abbreviation of the brand phrase itself (write the full phrase, not `perse`);
- appear in the GitHub org login (`persevere-dsh`) or the collection repository name
  (`persevere-dsh/plugins`).

### 4. Identifiers are lowercase kebab-case

Every identifier — org, repository, package, directory, file, branch, workflow job —
uses lowercase letters, digits, and hyphens only:

| Kind | Pattern | Example |
| --- | --- | --- |
| Plugin repository | `persevere-dsh/perse-<name>` | `persevere-dsh/perse-updater` |
| npm package | `perse-<name>` | `perse-updater` |
| Collection repository | `persevere-dsh/plugins` | `persevere-dsh/plugins` |
| Environment variable | `PERSEVERE_DSH_<THING>` | `PERSEVERE_DSH_PROFILE` |

`<name>` itself is lowercase kebab-case and describes the plugin, not the brand:
`updater`, giving `perse-updater` — never `perse-perse-updater`.

### 5. Display name vs. login

Wherever a human-readable org name is needed, use the display name
**Persevere with DSH**. Wherever a machine-readable org is needed, use the login
`persevere-dsh`. The two are never swapped.

## Quick self-check

Before committing any user-facing text, confirm:

- [ ] **Persevere with DSH** appears in full at least once and is never abbreviated.
- [ ] The string `PWD` does not appear anywhere.
- [ ] If `perse` appears, its first occurrence is followed by `= persevere`.
- [ ] Every identifier is lowercase kebab-case; plugin names carry the `perse-` prefix.
- [ ] The footer line `Part of Persevere with DSH` is present in each README.
