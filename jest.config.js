// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS modules
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Transform TypeScript files
  },
};
