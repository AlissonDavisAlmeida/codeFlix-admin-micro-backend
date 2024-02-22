import { Entity } from "../../entity";

export class EntityNotFoundError extends Error {
    constructor(entityId: any[] | any,
        entityClass: new (...args: any[]) => Entity
    ) {
        const idsMessage = Array.isArray(entityId) ? entityId.join(", ") : entityId;
        super(`${entityClass.name} with id ${idsMessage} not found`);
        this.name = "EntityNotFoundError";
    }
}