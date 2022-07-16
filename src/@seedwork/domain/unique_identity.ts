import { InvalidUuidError } from "../errors/invalid_uuid.error";
import {v4 as uuid, validate} from "uuid"

export class UniqueIdentity{
    constructor(public readonly id?: string){
        this.id = id || uuid();
        this.validate();
    }   
    
    private validate(){
        const isValidIdentity = validate(this.id);
        if(!isValidIdentity){
            throw new InvalidUuidError(`Invalid UUID: ${this.id}`);
        }

        
    }
}