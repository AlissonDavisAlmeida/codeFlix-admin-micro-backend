import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { Dialect } from "sequelize";
import { config } from "#seedwork/infra/config";

const sequelizeOptions: SequelizeOptions = {
  dialect: config.db.connection as Dialect,
  host: config.db.host,
  logging: config.db.logging,
};

export function setupSequelize(options: SequelizeOptions) {
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      ...sequelizeOptions,
      ...options,
    });
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  return {
    get sequelize() {
      return sequelize;
    },
  };
}
