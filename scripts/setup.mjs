// This script is no longer needed as the application has been migrated to PostgreSQL.
// The MongoDB setup script has been removed.

export const setup = async () => {
  console.log('MongoDB setup script has been removed. No setup required for PostgreSQL.');
};

try {
  setup();
} catch {
  console.warn('Setup script encountered an error.');
}
