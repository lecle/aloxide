declare module 'icon-sdk-js' {
  export default class IconService {

    static IconWallet = IconWallet;
    static IconConverter = IconConverter;
    static SignedTransaction = SignedTransaction;
    static IconBuilder = IconBuilder;

    constructor(provider: HttpProvider)
    getTotalSupply();

    /**
     * Get the balance of the address.
     * @param {string} address - The EOA or SCORE address.
     * @return {HttpCall} The HttpCall instance for icx_getBalance JSON-RPC API request.
     */
    getBalance(address: string): HttpCall;

    /**
     * Get the block information.
     * @param {string|BigNumber} value - The height or hash value of block.
     * @return {HttpCall} The HttpCall instance for icx_getBlockByHeight,
     * 	icx_getBlockByHash or icx_getLastBlock JSON-RPC API request.
     */
    getBlock(value: string): HttpCall;

    /**
     * @description Get the block information.
     * @param {BigNumber} value The value of block number
     * @return {object} The Block object
     */
    getBlockByHeight(value: string): object;

    /**
     * @description Get the block information.
     * @param {string} value The value of block hash
     * @return {object} The Block object
     */
    getBlockByHash(value: string): object;

    /**
     * @description Get the last block information.
     * @return {object} The Block object
     */
    getLastBlock(): object;

    /**
     * @description Get the SCORE API list.
     * @param {string} address SCORE address
     * @return {array} The list of SCORE API
     */
    getScoreApi(address: string): array;

    /**
     * Get the transaction information.
     * @param {string} hash - The transaction hash.
     * @return {HttpCall} The HttpCall instance for icx_getTransactionByHash JSON-RPC API request.
     */
    getTransaction(hash: string): HttpCall;

    /**
     * Get the result of transaction by transaction hash.
     * @param {string} hash - The transaction hash.
     * @return {HttpCall} The HttpCall instance for icx_getTransactionResult JSON-RPC API request.
     */
    getTransactionResult(hash: string): HttpCall;

    /**
     * Send a transaction that changes the states of address.
     * @param {SignedTransaction} signedTransaction - Parameters including signature.
     * @return {HttpCall} The HttpCall instance for icx_sendTransaction JSON-RPC API request.
     */
    sendTransaction(signedTransaction: SignedTransaction): HttpCall;

    /**
     * Calls a SCORE API just for reading.
     * @param {Call} call - The call instance exported by CallBuilder
     * @return {HttpCall} The HttpCall instance for icx_call JSON-RPC API request.
     */
    call(call: Call): HttpCall;
  }

  export class HttpProvider {
    url: string

    constructor(public url: string);

    request(request: object, converter);
  }

  export class HttpCall {
    constructor(httpCall, converter);

    execute(): any;

    callAsync(): any;
  }

  export class Wallet {
    /**
     * Creates an instance of Wallet.
     */
    constructor(privKey: string, pubKey: string);

    /**
     * Creates an instance of Wallet with random key
     * @static
     * @return {Wallet} The wallet instance.
     */
    static create(): Wallet;

    /**
     * Import existing wallet instance using private key.
     * @static
     * @param {string} privKey - The private key.
     * @return {Wallet} The wallet instance.
     */
    static loadPrivateKey(privKey: string): Wallet;

    /**
     * Import existing wallet instance using keystore object.
     * @static
     * @param {object|string} keystore - The keystore object or stringified object.
     * @param {string} password - The password of keystore object.
     * @param {boolean=} nonStrict - Set whether checking keystore file case-insensitive or not. (affects when 'keystore' param is string.)
     * @return {Wallet} The wallet instance.
     */
    static loadKeystore(keystore: object | string, password: string, nonStrict: boolean): Wallet;

    /**
     * Get keystore object of an instance of a `Wallet` class.
     * @param {string} password - The new password for encryption.
     * @param {object=} opts - The custom options for encryption.
     * @return {object} A keystore object.
     */
    store(password: string, opts: object): object;

    /**
     * Generate signature string by signing transaction object.
     * @param {Buffer} data - The serialized transaction object.
     * @return {string} The signature string.
     */
    sign(data: Buffer): string;

    /**
     * Get private key of wallet instance.
     * @return {string} The private key.
     */
    getPrivateKey(): string;

    /**
     * Get public key of wallet instance.
     * @return {string} The public key.
     */
    getPublicKey(): string;

    /**
     * Get EOA address of wallet instance.
     * @return {string} The EOA address.
     */
    getAddress(): string;
  }

  export const IconWallet = Wallet;

  class Converter {
    /**
     * Convert UTF-8 text to hex string.
     * @param {string} value - the UTF-8 string only.
     * @return {string} the hex string.
     */
    static fromUtf8(value: string): string;

    /**
     * Convert hex string to UTF-8 text.
     * @param {String} value the hex string only.
     * @returns {String} the UTF-8 string.
     */
    static toUtf8(value: string): string;

    /**
     * Convert string or BigNumber value to number.
     * @param {string|BigNumber} value - the value.
     * @return {number} the value converted to number.
     */
    static toNumber(value: string): number;

    /**
     * Convert string or number value to BigNumber.
     * @param {string|number} value - the value.
     * @return {BigNumber} the value converted to BigNumber.
     */
    static toBigNumber(value: string | number): BigNumber;

    /**
     * Convert string, number or BigNumber value to hex string strictly.
     * @param {string|number|BigNumber} value - the value that represents the number.
     * @return {string} the value converted to hex string.
     */
    static toHexNumber(value: string | number): string;

    /**
     * Convert string, number or BigNumber value to hex string.
     * @param {string|number|BigNumber} value - the value.
     * @return {string} the value converted to hex string.
     */
    static toHex(value: string | number): string;

    /**
     * Convert transaction object to raw transaction object.
     * @param {object} transaction - the transaction object.
     * @return {object} the raw transaction object.
     */
    static toRawTransaction(transaction: object): object;
  }
  export const IconConverter = Converter;

  export const IconBuilder = {
    DeployTransactionBuilder,
    CallBuilder
  };

  class DeployTransactionBuilder extends IcxTransactionBuilder {
    constructor();
    /**
     * Creates an instance of DeployTransactionBuilder.
     */
    constructor(to, from, value, stepLimit, nid, nonce, version, timestamp);

    /**
     * Set 'contentType' property
     * @param {string} contentType - The content type of content
     * @return {DeployTransactionBuilder} this.
     */
    contentType(contentType: string): DeployTransactionBuilder;

    /**
     * Set 'content' property
     * @param {string} content - The content to deploy.
     * @return {DeployTransactionBuilder} this.
     */
    content(content: string): DeployTransactionBuilder;

    /**
     * Set 'params' property
     * @param {object} params - The input params for deploying content
     * @return {DeployTransactionBuilder} this.
     */
    params(params: object): DeployTransactionBuilder;

    /**
     * Build 'DeployTransaction' object
     * @return {DeployTransaction} 'DeployTransaction' instance exported by 'DeployTransactionBuilder'
     */
    build(): DeployTransactionBuilder;
  }

  class IcxTransactionBuilder {
    constructor();

    to(to): this;

    from(from): this;

    value(value): this;

    stepLimit(stepLimit): this;

    nid(nid): this;

    nonce(nonce): this;

    version(version): this;

    timestamp(timestamp): this;

    build(): IcxTransaction;
  }

  class CallBuilder {
    constructor();

    to(to): this;

    from(from): this;

    method(method): this;

    params(params): this;

    build(): Call;
  }

  class SignedTransaction {
    /**
     * Creates an instance of SignedTransaction.
     * @param {IcxTransaction|MessageTransaction|CallTransaction|DeployTransaction}
     * 	transaction - The transaction instance.
     * @param {Wallet} wallet - The wallet instance.
     */
    constructor(transaction: IcxTransaction | MessageTransaction | CallTransaction | DeployTransaction, wallet: Wallet);

    /**
     * Get raw transaction object of this.transaction.
     * @return {object} The raw transaction object.
     */
    getRawTransaction(): object;

    /**
     * Get signature string.
     * @return {string} The signature string.
     */
    getSignature(): string;

    /**
     * Get properties of signed transaction object
     * @return {object} The signed transaction object.
     */
    getProperties(): object;
  }
}
