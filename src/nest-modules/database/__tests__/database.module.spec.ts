import { Test } from "@nestjs/testing";
import { DatabaseModule } from "../database.module";
import { Sequelize } from "sequelize-typescript";
import { getConnectionToken } from "@nestjs/sequelize";
import { ConfigModule } from "src/nest-modules/config/config.module";

describe("DatabaseModule unit tests",()=>{
    describe("sql connection", ()=>{
        const connectionOptions = {
            DB_VENDOR: "sqlite",
            DB_HOST: ":memory:",
            DB_LOGGING: false,
            DB_AUTO_LOAD_MODELS: true
        };

        it("should be a sqlite connection", async ()=>{
            const module = await Test.createTestingModule({
                imports:[
                    DatabaseModule,
                    ConfigModule.forRoot({
                        isGlobal: true,
                        load: [() => connectionOptions],
                        ignoreEnvFile: true,
                        ignoreEnvVars: true,
                        validationSchema: null
                    }),
                ]
            }).compile();

            const app = module.createNestApplication();
            const conn = app.get<Sequelize>(getConnectionToken());
            expect(conn).toBeDefined();
            expect(conn.getDialect()).toEqual("sqlite");
            expect(conn.options.host).toEqual(":memory:");
            await conn.close();
        });
    });

    describe("mysql connection", ()=>{
        const connectionOptions = {
            DB_VENDOR: "mysql",
            DB_HOST: "db",
            DB_PORT: 3306,
            DB_USERNAME: "root",
            DB_PASSWORD: "root",
            DB_DATABASE: "micro_videos",
            DB_LOGGING: false,
            DB_AUTO_LOAD_MODELS: true
        };

        it("should be a mysql connection", async ()=>{
            const module = await Test.createTestingModule({
                imports:[
                    DatabaseModule,
                    ConfigModule.forRoot({
                        isGlobal: true,
                        load: [() => connectionOptions],
                        ignoreEnvFile: true,
                        ignoreEnvVars: true,
                        validationSchema: null
                    }),
                ]
            }).compile();

            const app = module.createNestApplication();
            const conn = app.get<Sequelize>(getConnectionToken());
            expect(conn).toBeDefined();
            expect(conn.getDialect()).toEqual("mysql");
            expect(conn.options.host).toEqual("db");
            expect(conn.options.port).toEqual(3306);
            expect(conn.options.username).toEqual("root");
            expect(conn.options.password).toEqual("root");
            expect(conn.options.database).toEqual("micro_videos");
            await conn.close();
        });
    });
});