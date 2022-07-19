export abstract class ValueObject<Value> {

    protected _value: Value;

    constructor(value: Value) { 
        this._value = value;
    }


    get value(): Value {
        return this._value;
    }

}