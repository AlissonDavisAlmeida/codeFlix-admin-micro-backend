import { deepFreeze } from "../utils/object";

export abstract class ValueObject<Value> {
  protected readonly _value: Value;

  constructor(value: Value) {
    this._value = deepFreeze(value);
  }

  get value(): Value {
    return this._value;
  }

  toString = (): string => JSON.stringify(this._value);
}
