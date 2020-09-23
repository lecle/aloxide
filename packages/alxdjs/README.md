
# aloxide-js

## Basic Usage

```javascript

// Deploy EOS smart contract
const jungle = new CANTestnet();
const eosClient = new AloxideSDK(jungle);
const eosDeployAccount = eosClient.EOS.Account.load(private_key, account_name);
const trn = await eosClient.EOS.Contract.deployOnAccount(EOS_WASM_PATH, EOS_ABI_PATH, eosDeployAccount);

// Deploy ICON smart contract
const iconTestnet = new ICONTestnet();
const iconClient = new AloxideSDK(iconTestnet);
const iconDeployAccount = iconClient.ICON.Account.load(private_key);
const trn = await iconClient.ICON.Contract.deployOnAccount(ICON_PATH, params= {}, iconDeployAccount);
```
