# Pull Request: Remove MongoDB Dependencies and Update for PostgreSQL Migration

## Summary
This pull request includes the following changes:
- Removed MongoDB dependencies from the `pnpm-lock.yaml` file.
- Updated various files to remove MongoDB-specific code and references.
- Added PostgreSQL client package (`pg`) and `@next-auth/typeorm-adapter` to `package.json`.
- Updated the `scripts/setup.mjs` file to remove the MongoDB setup script.
- Updated the `pages/404.tsx`, `pages/500.tsx`, `pages/[username].tsx`, `pages/index.tsx`, and `pages/settings.tsx` files to remove MongoDB references and update URLs and meta tags.

## Changes
- Removed `mongodb` and `@next-auth/mongodb-adapter` dependencies from `pnpm-lock.yaml`.
- Updated `scripts/setup.mjs` to remove MongoDB setup script.
- Updated `pages/404.tsx`, `pages/500.tsx`, `pages/[username].tsx`, `pages/index.tsx`, and `pages/settings.tsx` to remove MongoDB references and update URLs and meta tags.
- Added PostgreSQL client package (`pg`) and `@next-auth/typeorm-adapter` to `package.json`.

## Testing
- Ensure that the application builds and runs successfully with the new PostgreSQL setup.
- Verify that all pages and functionalities work as expected with the PostgreSQL database.

## Notes
- The PostgreSQL installation process is currently awaiting the superuser password to complete the setup.
- Once the PostgreSQL installation is complete, the schema creation script will be executed to set up the database schema.

Link to Devin run: https://preview.devin.ai/devin/20c76ab94b6f40e08d4e73ee776a1ea9

[This Devin run](https://preview.devin.ai/devin/20c76ab94b6f40e08d4e73ee776a1ea9) was requested by Nikita.
