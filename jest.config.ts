/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
import type { Config } from "jest";
const config: Config = {
  clearMocks: true,
  coverageProvider: "v8",
  rootDir: "./src",
  setupFilesAfterEnv: [
    "./core/shared/infra/testing/expect.helper.ts"
  ],
  moduleFileExtensions: [
    "js",
    "json",
    "ts"
  ],
  testRegex: ".*\\.spec\\.ts",
  transform: {
    "^.+\\.(t|j)": "@swc/jest"
  },
  collectCoverageFrom: [
    "**/*.(t|j)s"
  ],
  coverageDirectory: "../coverage",
  testEnvironment: "node"
};
export default config;