export default {

    displayName: {
        name: "nestjs",
        color: "magentaBright",
    },

    moduleFileExtensions: [
        "js",
        "json",
        "ts"
    ],
    rootDir: "src",
    testRegex: ".*\\.spec\\.ts$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest",

    },
    collectCoverageFrom: [
        "**/*.(t|j)s"
    ],
    coverageDirectory: "../coverage",
    testEnvironment: "node",
    moduleNameMapper: {
        "/micro\\-videos\\-core/(.*)$": "<rootDi>/../../../node_modules/micro-videos-core/dist/$1"
    }
}

