import Joi from "joi";
import { CONFIG_DB_SCHEMA, ConfigModule } from "./config.module";
import { Test } from "@nestjs/testing";
import { join } from "path";

function expectValidate(schema: Joi.Schema, value: any) {
    return expect(schema.validate(value, { abortEarly: false }).error.message);
}

describe("Schema unit tests", () => {
    describe("DB Schema", () => {
        const schema = Joi.object({
            ...CONFIG_DB_SCHEMA
        });

        describe("DB_VENDOR", () => {
            test("invalid cases", () => {
                expectValidate(schema, {}).toContain("\"DB_VENDOR\" is required");

                expectValidate(schema, { DB_VENDOR: "invalid" }).toContain("\"DB_VENDOR\" must be one of [mysql, sqlite]");
            });

            test("valid cases", () => {
                const arrage = ["mysql", "sqlite"];

                arrage.forEach((value) => {
                    expectValidate(schema, { DB_VENDOR: value }).not.toContain("\"DB_VENDOR\"");
                });
            });
        });

        describe("DB_HOST", () => {
            test("invalid cases", () => {
                expectValidate(schema, {}).toContain("\"DB_HOST\" is required");

                expectValidate(schema, { DB_HOST: 5 }).toContain("\"DB_HOST\" must be a string");
            });

            test("valid cases", () => {
                expectValidate(schema, { DB_HOST: "localhost" }).not.toContain("\"DB_HOST\"");
            });
        });

        describe("DB_PORT", () => {
            test("invalid cases", () => {
                expectValidate(schema, { DB_VENDOR: "mysql" }).toContain("\"DB_PORT\" is required");

                expectValidate(schema, { DB_PORT: "invalid" }).toContain("\"DB_PORT\" must be a number");

            });

            test("valid cases", () => {
                expectValidate(schema, { DB_PORT: 3306 }).not.toContain("\"DB_PORT\"");
                expectValidate(schema, {}).not.toContain("\"DB_PORT\"");
            });
        });

        describe("DB_DATABASE", () => {
            test("invalid cases", () => {
                expectValidate(schema, { DB_VENDOR: "mysql" }).toContain("\"DB_DATABASE\" is required");

                expectValidate(schema, { DB_DATABASE: 5 }).toContain("\"DB_DATABASE\" must be a string");
            });

            test("valid cases", () => {
                expectValidate(schema, { DB_DATABASE: "test" }).not.toContain("\"DB_DATABASE\"");
                expectValidate(schema, {}).not.toContain("\"DB_DATABASE\"");
            });
        });

        describe("DB_USERNAME", () => {
            test("invalid cases", () => {
                expectValidate(schema, { DB_VENDOR: "mysql" }).toContain("\"DB_USERNAME\" is required");

                expectValidate(schema, { DB_USERNAME: 5 }).toContain("\"DB_USERNAME\" must be a string");
            });

            test("valid cases", () => {
                expectValidate(schema, { DB_USERNAME: "root" }).not.toContain("\"DB_USERNAME\"");
                expectValidate(schema, {}).not.toContain("\"DB_USERNAME\"");
            });
        });

        describe("DB_PASSWORD", () => {
            test("invalid cases", () => {
                expectValidate(schema, { DB_VENDOR: "mysql" }).toContain("\"DB_PASSWORD\" is required");

                expectValidate(schema, { DB_PASSWORD: 5 }).toContain("\"DB_PASSWORD\" must be a string");
            });

            test("valid cases", () => {
                expectValidate(schema, { DB_PASSWORD: "root" }).not.toContain("\"DB_PASSWORD\"");
                expectValidate(schema, {}).not.toContain("\"DB_PASSWORD\"");
            });
        });

        describe("DB_LOGGING", () => {
            test("invalid cases", () => {
                expectValidate(schema, {}).toContain("\"DB_LOGGING\" is required");

                expectValidate(schema, { DB_LOGGING: "invalid" }).toContain("\"DB_LOGGING\" must be a boolean");
            });

            test("valid cases", () => {
                expectValidate(schema, { DB_LOGGING: true }).not.toContain("\"DB_LOGGING\"");
            });
        });

        describe("DB_AUTO_LOAD_MODELS", () => {
            test("invalid cases", () => {
                expectValidate(schema, {}).toContain("\"DB_AUTO_LOAD_MODELS\" is required");

                expectValidate(schema, { DB_AUTO_LOAD_MODELS: "invalid" }).toContain("\"DB_AUTO_LOAD_MODELS\" must be a boolean");
            });

            test("valid cases", () => {
                expectValidate(schema, { DB_AUTO_LOAD_MODELS: true }).not.toContain("\"DB_AUTO_LOAD_MODELS\"");
            });
        });
    });
});


describe("ConfigModule unit tests", () => {
    it("should throw an error when env vars are invalid", async () => {
        try {
            await Test.createTestingModule({
                imports: [
                    ConfigModule.forRoot({
                        envFilePath: join(__dirname, "./__tests__", ".env.fake"),
                    }),
                ]
            });

        } catch (error) {
            expect(error.message).toContain("\"DB_VENDOR\" is required");
        }
    });

    it("should be valid", ()=>{
        const module = Test.createTestingModule({
            imports: [ConfigModule.forRoot()]
        });

        expect(module).toBeDefined();
    });
});