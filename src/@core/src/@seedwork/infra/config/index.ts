import { config as readEnv } from "dotenv";
import { join } from "path";

const envTestingPath = join(__dirname, "../../../../.env");

type ConfigType = {
  db: {
    connection: string;
    host: string;
    logging: boolean;
  }
};

function makeConfig(envFile): ConfigType {
  const output = readEnv({
    path: envFile,
  });

  return {
    db: {
      connection: output.parsed.DB_CONNECTION || "sqlite",
      host: output.parsed.DB_HOST || ":memory:",
      logging: output.parsed.DB_LOGGING === "true",
    },
  };
}

export const config = makeConfig(envTestingPath);
