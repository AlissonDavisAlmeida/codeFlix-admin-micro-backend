type CategoryProps = {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
};

export class Category {
  #name: string;

  #description?: string;

  #created_at: Date;

  #is_active: boolean;

  constructor(props : CategoryProps) {
    this.name = props.name;
    this.description = props.description ?? null;
    this.#created_at = props.created_at ?? new Date();
    this.#is_active = props.is_active ?? true;
  }

  private set name(name: string) {
    this.#name = name;
  }

  get name(): string {
    return this.#name;
  }

  private set description(description: string) {
    this.#description = description;
  }

  get description(): string {
    return this.#description;
  }

  get created_at(): Date {
    return this.#created_at;
  }

  get is_active(): boolean {
    return this.#is_active;
  }
}
