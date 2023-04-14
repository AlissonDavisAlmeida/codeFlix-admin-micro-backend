import { Model } from "sequelize-typescript";

export class SequelizeModelFactory {
  constructor(
    private model,
    private factoryProps: () => any,
  ) { }

  async create(data?: any) {
    return this.model.create(data || this.factoryProps());
  }

  make() {

  }

  async bulkCreate() {

  }

  async bulkMake() {

  }
}
