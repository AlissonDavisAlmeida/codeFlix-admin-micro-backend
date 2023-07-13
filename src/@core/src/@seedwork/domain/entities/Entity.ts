import { UniqueEntityID } from "../value-objects/uniqueEntityID";

export abstract class Entity<Props = any> {
  public readonly uniqueEntityId: UniqueEntityID;

  constructor(public props: Props, id?: UniqueEntityID) {
    this.uniqueEntityId = id ?? new UniqueEntityID();
  }

  get id() {
    return this.uniqueEntityId.value;
  }

  toJSON(): Required<{ id: string } & Props> {
    return {
      id: this.id,
      ...this.props,
    } as Required<{ id: string } & Props>;
  }
}
