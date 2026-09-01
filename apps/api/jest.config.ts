import type { Config } from "jest";

const config: Config = {
  rootDir: "src",

  moduleFileExtensions: [
    "js",
    "json",
    "ts"
  ],

  testRegex: ".*\\.spec\\.ts$",
  verbose: true,
  testEnvironment: "node",

  transform: {
    "^.+\\.(t|j)s$": "@swc/jest",
  },

  transformIgnorePatterns: [
    "node_modules/(?!@nestjs/(jwt|passport))",
  ],

  collectCoverageFrom: [
    "**/*.(t|j)s"
  ],

  coverageDirectory: "../coverage",

  // Prisma 7 generates relative imports ending with .js,
  // while ts-jest/SWC resolves .ts files during tests.
  // This mapper removes the .js extension so Jest can resolve
  // the generated TypeScript modules correctly.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;