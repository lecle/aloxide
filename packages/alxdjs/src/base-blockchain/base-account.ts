const eosECC = require('eosjs').modules.ecc;

export default class BaseAccount {
    privateKey: String;
    name: String;

    constructor (privateKey, name) {
        this.privateKey = privateKey;
        this.name = name;
    }
}