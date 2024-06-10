import { ValueObject } from "./domain/value-objects/value-object";

export abstract class Entity {

    abstract get entity_id(): ValueObject

    abstract toJSON(): any;
}