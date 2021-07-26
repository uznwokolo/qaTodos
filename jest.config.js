module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testPathIgnorePatterns: ["/node_modules/", "/src/__tests__/pageObjects/"],
    testTimeout: 30000
  };