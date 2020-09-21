export function isInstanceOf(data, ofObject) {
    if (data == null || data == undefined) {
        const errorMessage = `Not an instance of ${ofObject}`;
        throw new Error(errorMessage);
    }
    return recursivelyCheckIfInstance(data, ofObject);
}


function recursivelyCheckIfInstance(candidate, requiredInstance) {
    if (Object.getPrototypeOf(candidate) == null) {
        return false;
    }

    if (candidate.constructor.name != requiredInstance) {
        const isInstance = recursivelyCheckIfInstance(Object.getPrototypeOf(candidate), requiredInstance);
        if (!isInstance) {
            throw new Error(`Provided ${candidate.constructor.name} is not an instance of ${requiredInstance}`);
        }
    }

    return true;
}