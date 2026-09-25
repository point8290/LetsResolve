/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Deliberately not scoped with `roots`: that option also limits where
  // Jest looks for manual `__mocks__` for node_modules packages (used here
  // for aws-jwt-verify), so narrowing it silently breaks that auto-mock.
  testMatch: ["<rootDir>/src/__tests__/**/*.test.ts"],
  setupFiles: ["<rootDir>/src/__tests__/setupEnv.ts"],
  clearMocks: true,
};
