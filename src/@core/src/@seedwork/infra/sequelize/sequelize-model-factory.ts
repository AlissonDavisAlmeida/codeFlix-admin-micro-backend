import { Model } from "sequelize-typescript";

export class SequelizeModelFactory<ModelClass extends Model, ModelProps = unknown> {
  #count = 1;

  constructor(
    private model,
    private factoryProps: () => ModelProps,
  ) { }

  count(count: number) {
    this.#count = count;
    return this;
  }

  async create(data?: ModelProps):Promise<ModelClass> {
    return this.model.create(data || this.factoryProps());
  }

  make(data?: ModelProps) {
    return this.model.build(data || this.factoryProps());
  }

  async bulkCreate(factoryProps?: (index: number) => ModelProps): Promise<ModelClass[]> {
    const data = new Array(this.#count)
      .fill(factoryProps || this.factoryProps)
      .map((factory, index) => factory(index));

    return this.model.bulkCreate(data);
  }

  async bulkMake(factoryProps?: (index: number) => ModelProps): Promise<ModelClass[]> {
    const data = new Array(this.#count)
      .fill(factoryProps || this.factoryProps)
      .map((factory, index) => factory(index));

    return this.model.bulkBuild(data);
  }
}
