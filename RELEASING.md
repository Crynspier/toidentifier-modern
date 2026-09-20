# Releasing

## Release flow

1. Ensure `package.json` and `package-lock.json` contain the same version.
2. Run:
   ```sh
   npm ci
   npm run check
   npm pack --dry-run --ignore-scripts
   ```
3. Commit the release.
4. Create and push the matching tag:
   ```sh
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```
5. The `release.yml` workflow verifies the tag, reruns the full checks, and publishes to npm.

## npm trusted publishing

For the strongest release setup, configure the package on npmjs.com to trust this GitHub Actions workflow:

- Organization or user: `Crynspier`
- Repository: `toidentifier-modern`
- Workflow filename: `release.yml`
- Environment: none unless the workflow is later moved behind a GitHub environment
- Allow direct `npm publish`

The npm package must already exist before its first trusted-publisher relationship can be configured. After trusted publishing is enabled, the workflow uses OIDC and does not require an npm publish token.

For public packages published through trusted publishing from GitHub Actions, npm generates provenance automatically.
