import cryptoJS from 'crypto-js';

export function hash(data) {
    try {
        let dataHash = cryptoJS.SHA256(data).toString(cryptoJS.enc.Hex);
        return dataHash;
    } catch (error) {
        throw new Error('Couldn\'t hash the data');
    }
}

export function encrypt(data, password) {
    try {
        let encryptedData = cryptoJS.AES.encrypt(data, password).toString();
        return encryptedData;
    } catch (error) {
        throw new Error('Couldn\'t encrypt the data');
    }
}

export function decrypt(encryptedData, password) {
    try {
        let decryptedData = cryptoJS.AES.decrypt(encryptedData, password).toString(cryptoJS.enc.Utf8);
        return decryptedData;
    } catch (error) {
        throw new Error('Couldn\'t decrypt the data');
    }
}

