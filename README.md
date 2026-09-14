# Softwareify.UI.Components

Shared React UI components for Softwareify projects.

**Package:** `@softwareifycz/ui-components`  
**Registry:** GitHub Packages (`https://npm.pkg.github.com`)

## Development & Release

### Development

1. Open a pull request targeting `main`.
2. GitHub Actions **CI** runs:

   - **Validate:** `npm ci` → lint → typecheck → unit tests → build  
   - **Storybook:** Playwright Chromium + Storybook browser tests  

3. Fix failures, then merge. Pushes to `main` run the same checks (no publish).

Locally:

```bash
npm ci
npm run lint
npm run typecheck
npm test                 # fast unit tests
npm run test:storybook   # requires: npx playwright install chromium
npm run build
```

### Release

Versioning is **manual**. The Git tag triggers publish.

1. On `main`, set `package.json` `"version"` to the next semver (e.g. `0.4.0`).
2. Commit and merge to `main`.
3. Tag and push:

   ```bash
   git tag v0.4.0
   git push origin v0.4.0
   ```

4. **Release** workflow runs: full validation (including Storybook) → checks tag == `package.json` version → publishes to GitHub Packages → creates a GitHub Release with generated notes.

If tag `v0.4.0` does not match `"version": "0.4.0"`, the workflow **fails and does not publish**.

### Semantic versioning

| Change | Bump |
|--------|------|
| Bug fix | **PATCH** (`0.3.0` → `0.3.1`) |
| Backward-compatible feature | **MINOR** (`0.3.1` → `0.4.0`) |
| Breaking change | **MAJOR** (`0.4.0` → `1.0.0`) |

While on `0.x`, document breaking changes clearly in release notes.

### Install (consumers)

```ini
# .npmrc
@softwareifycz:registry=https://npm.pkg.github.com
```

```bash
npm install @softwareifycz/ui-components@0.3.0
```

Use a token with `read:packages` via environment (`NODE_AUTH_TOKEN`) — never commit tokens.

Publishing uses repository secret `NPM_PUBLISH_TOKEN` because the `softwareifyCZ` org currently disables write permissions for `GITHUB_TOKEN`.

### Tests decision

| Suite | Command | CI |
|-------|---------|-----|
| Unit | `npm test` | Required on every PR / main / release |
| Storybook (browser) | `npm run test:storybook` | Separate CI job + release (needs Playwright) |

Storybook tests are **kept**, not removed. They run in their own job because they need a browser environment.
