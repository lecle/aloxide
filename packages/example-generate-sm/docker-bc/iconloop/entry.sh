#!/urs/bin/env bash

service rabbitmq-server start

tbears genconf
tbears start

# deploy smart contract
tbears deploy ./smart-contract/icon_hello -k keystore_test1 -p test1_Account

# instal python package
pip3 install Faker

# keep docker running
tail -f tbears.log
