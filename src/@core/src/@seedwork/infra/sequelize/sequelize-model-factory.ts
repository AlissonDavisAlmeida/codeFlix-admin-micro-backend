export class SequelizeModelFactory {
  #count = 1;

  constructor(
    private model,
    private factoryProps: () => unknown,
  ) { }

  count(count: number) {
    this.#count = count;
    return this;
  }

  async create(data?: unknown) {
    return this.model.create(data || this.factoryProps());
  }

  make(data?: unknown) {
    return this.model.build(data || this.factoryProps());
  }

  async bulkCreate(factoryProps?: (index: number) => unknown) {
    const data = new Array(this.#count)
      .fill(factoryProps || this.factoryProps)
      .map((factory, index) => factory(index));

    return this.model.bulkCreate(data);
  }

  async bulkMake(factoryProps?: (index: number) => unknown) {
    const data = new Array(this.#count)
      .fill(factoryProps || this.factoryProps)
      .map((factory, index) => factory(index));

    return this.model.bulkBuild(data);
  }
}
