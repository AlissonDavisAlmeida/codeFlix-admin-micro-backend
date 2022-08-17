import { UniqueIdentity } from "../valueObjects/unique_identity";

export abstract class BaseEntity<Props = any> {
  public readonly uniqueEntityID: UniqueIdentity;

  constructor(public readonly props: Props, id?: UniqueIdentity) {
    this.uniqueEntityID = id ?? new UniqueIdentity();
  }

  get id(): string {
    return this.uniqueEntityID.value;
  }

  toJSON(): Required<{ id: string } & Props> {
    return {
      id: this.id,
      ...this.props,
    } as Required<{ id: string } & Props>;
  }
}
