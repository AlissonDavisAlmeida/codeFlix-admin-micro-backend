export const deepFreeze = <T>(obj: T) => {

    if (obj) {

        const propertiesNmae = Object.getOwnPropertyNames(obj)

        for (const propertyName of propertiesNmae) {
            const property = obj[propertyName as keyof T]

            if (property && typeof property === 'object') {
                deepFreeze(property)
            }
        }

        return Object.freeze(obj)
    } else {
        return obj
    }
}