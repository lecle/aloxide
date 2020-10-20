<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of content**

- [`@aloxide/example-aloxide-js`](#aloxideexample-aloxide-js)
  - [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# `@aloxide/example-aloxide-js`

## Usage

1. Change directory to packages/example-aloxide-js

2. Configure Blockchain Network in file `../example-aloxide-js/.env` as following:

   ```bash
   app_blockchain_name=CAN Testnet
   app_blockchain_type=eos
   app_blockchain_host=testnet.canfoundation.io
   app_blockchain_port=443
   app_blockchain_chainId=353c0a7c6744e58778a2a334d1da2303eb12a111cc636bb494e63a84c9e7ffeb
   app_blockchain_protocol=https
   app_blockchain_token=CAN
   app_blockchain_account=
   app_blockchain_account_pk=
   app_blockchain_contract=aloxidejs123
   ```

   Remember to fill out the missing `app_blockchain_account` and `app_blockchain_account_pk` values:

3. Add `aloxide.yml` entities schema to follow your contract:

   ```xml
   entities:
     - name: Poll
       fields:
         - name: id
           type: uint64_t
         - name: name
           type: string
         - name: body
           type: string
       key: id
     - name: Vote
       fields:
         - name: id
           type: uint64_t
         - name: pollId
           type: uint64_t
         - name: ownerId
           type: uint64_t
         - name: point
           type: number
       key: id
   ```

4. Run command to add new Poll:

   ```bash
   yarn set Poll 5 "Poll 5" "test Poll 5"

   // transaction id result: cca5b5d04f4803b39a8e32ab51bdfb846b7c27842ad05adc2aba9fc17a6db0e2
   ```

5. Run command to get Poll info:

   ```bash
   yarn get Poll 5

   // result: { id: 5, name: 'Poll 5', body: 'test Poll 5' }
   ```

6. Run command to update a Poll:

   ```bash
   yarn set Poll 5 "update Poll 5" "test update Poll 5"

   // result: f1bde0bde7e7cd3c363eaebb2e303a1bd00d38eaa0efde5109d499ead780630e
   ```

7. Run command to delete Poll:

   ```bash
   yarn delete Poll 5

   // result: c72552f94fcf1c3cd7aefd610a36acd213bf68508fb0032cc6d254be9bebc283
   ```
