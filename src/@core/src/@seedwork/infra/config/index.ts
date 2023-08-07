import { config as readEnv } from "dotenv";
import { join } from "path";

const envPath = join(__dirname, "../../../../.env");

readEnv({
  path: envPath,
});

export const config: ConfigType = {
  db: {
    connection: process.env.DB_CONNECTION || "sqlite",
    host: process.env.DB_HOST || ":memory:",
    logging: process.env.DB_LOGGING === "true",
  },
};

type ConfigType = {
  db: {
    connection: string;
    host: string;
    logging: boolean;
  }
};
