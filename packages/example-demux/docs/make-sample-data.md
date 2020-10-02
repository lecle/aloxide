# Make sample data

It is required that we finish [build and deploy smart-contract](./build-and-deploy-smart-contract.md).

## EOS

```bash
# create alias for shortening command
alias cleosj="cleos -u https://jungle3.cryptolions.io"
cleosj get info

# head block is 38909590
# Create poll 1001 and its options
cleosj push action aloxidepolla crepoll '["aloxideuser1", 1001, "Lets have happy time together.", "We have three options. Where should we go?", 1600621200000, 1601312400000]' -p aloxideuser1@active
cleosj push action aloxidepolla creoption '["aloxideuser1", 10001, "Vietname", 1001]' -p aloxideuser1@active
cleosj push action aloxidepolla creoption '["aloxideuser1", 10002, "Thailand", 1001]' -p aloxideuser1@active
cleosj push action aloxidepolla creoption '["aloxideuser1", 10003, "Singapore", 1001]' -p aloxideuser1@active

# Create poll 2001 and its options
cleosj push action aloxidepolla crepoll '["aloxideuser1", 2001, "Lets have a happy time together.", "When should we go? There are two periods which we can choose from.", 1600621200000, 1601312400000]' -p aloxideuser1@active
cleosj push action aloxidepolla creoption '["aloxideuser1", 20001, "October 2nd", 2001]' -p aloxideuser1@active
cleosj push action aloxidepolla creoption '["aloxideuser1", 20002, "December 30th", 2001]' -p aloxideuser1@active

# Vote for poll 1
cleosj push action aloxidepolla crevote '["aloxideuser1", 100001, 90, "v90", 1, 10001]' -p aloxideuser1@active
cleosj push action aloxidepolla crevote '["aloxideuser1", 100002, 80, "t80", 1, 10002]' -p aloxideuser1@active
cleosj push action aloxidepolla crevote '["aloxideuser1", 100003, 70, "s70", 1, 10003]' -p aloxideuser1@active
cleosj push action aloxidepolla crevote '["aloxideuser2", 100004, 90, "v90", 2, 10001]' -p aloxideuser2@active
cleosj push action aloxidepolla crevote '["aloxideuser2", 100005, 60, "t60", 2, 10002]' -p aloxideuser2@active
cleosj push action aloxidepolla crevote '["aloxideuser2", 100006, 80, "s80", 2, 10003]' -p aloxideuser2@active
cleosj push action aloxidepolla crevote '["aloxideuser3", 100007, 90, "v90", 3, 10001]' -p aloxideuser3@active
cleosj push action aloxidepolla crevote '["aloxideuser3", 100008, 90, "t90", 3, 10002]' -p aloxideuser3@active
cleosj push action aloxidepolla crevote '["aloxideuser3", 100009, 70, "s70", 3, 10003]' -p aloxideuser3@active
cleosj push action aloxidepolla crevote '["aloxideuser4", 100011, 90, "v90", 4, 10001]' -p aloxideuser4@active
cleosj push action aloxidepolla crevote '["aloxideuser4", 100012, 80, "t80", 4, 10002]' -p aloxideuser4@active
cleosj push action aloxidepolla crevote '["aloxideuser4", 100013, 90, "s90", 4, 10003]' -p aloxideuser4@active
cleosj push action aloxidepolla crevote '["aloxideuser5", 100014, 80, "v80", 5, 10001]' -p aloxideuser5@active
cleosj push action aloxidepolla crevote '["aloxideuser5", 100015, 80, "t80", 5, 10002]' -p aloxideuser5@active
cleosj push action aloxidepolla crevote '["aloxideuser5", 100016, 80, "s80", 5, 10003]' -p aloxideuser5@active

# Vote for poll 2
cleosj push action aloxidepolla crevote '["aloxideuser1", 200001, 95, "v95", 1, 20001]' -p aloxideuser1@active
cleosj push action aloxidepolla crevote '["aloxideuser1", 200002, 70, "t70", 1, 20002]' -p aloxideuser1@active
cleosj push action aloxidepolla crevote '["aloxideuser2", 200003, 80, "v80", 2, 20001]' -p aloxideuser2@active
cleosj push action aloxidepolla crevote '["aloxideuser2", 200004, 90, "t90", 2, 20002]' -p aloxideuser2@active
cleosj push action aloxidepolla crevote '["aloxideuser3", 200005, 70, "v70", 3, 20001]' -p aloxideuser3@active
cleosj push action aloxidepolla crevote '["aloxideuser3", 200006, 85, "t85", 3, 20002]' -p aloxideuser3@active
cleosj push action aloxidepolla crevote '["aloxideuser4", 200007, 55, "v55", 4, 20001]' -p aloxideuser4@active
cleosj push action aloxidepolla crevote '["aloxideuser4", 200008, 77, "t77", 4, 20002]' -p aloxideuser4@active
cleosj push action aloxidepolla crevote '["aloxideuser5", 200009, 98, "v98", 5, 20001]' -p aloxideuser5@active
cleosj push action aloxidepolla crevote '["aloxideuser5", 200011, 94, "t94", 5, 20002]' -p aloxideuser5@active

```

## CAN

```bash
# create alias for shortening command
alias cleost="cleos -u https://testnet.canfoundation.io"
cleot get info

# head block is 18282210
# Create poll 1001 and its options
cleost push action aloxidepolla crepoll '["aloxideuser1", 1001, "Lets have happy time together.", "We have three options. Where should we go?", 1600621200000, 1601312400000]' -p aloxideuser1@active
cleost push action aloxidepolla creoption '["aloxideuser1", 10001, "Vietname", 1001]' -p aloxideuser1@active
cleost push action aloxidepolla creoption '["aloxideuser1", 10002, "Thailand", 1001]' -p aloxideuser1@active
cleost push action aloxidepolla creoption '["aloxideuser1", 10003, "Singapore", 1001]' -p aloxideuser1@active

# Create poll 2001 and its options
cleost push action aloxidepolla crepoll '["aloxideuser1", 2001, "Lets have a happy time together.", "When should we go? There are two periods which we can choose from.", 1600621200000, 1601312400000]' -p aloxideuser1@active
cleost push action aloxidepolla creoption '["aloxideuser1", 20001, "October 2nd", 2001]' -p aloxideuser1@active
cleost push action aloxidepolla creoption '["aloxideuser1", 20002, "December 30th", 2001]' -p aloxideuser1@active

# Vote for poll 1
cleost push action aloxidepolla crevote '["aloxideuser1", 100001, 90, "v90", 1, 10001]' -p aloxideuser1@active
cleost push action aloxidepolla crevote '["aloxideuser1", 100002, 80, "t80", 1, 10002]' -p aloxideuser1@active
cleost push action aloxidepolla crevote '["aloxideuser1", 100003, 70, "s70", 1, 10003]' -p aloxideuser1@active
cleost push action aloxidepolla crevote '["aloxideuser2", 100004, 90, "v90", 2, 10001]' -p aloxideuser2@active
cleost push action aloxidepolla crevote '["aloxideuser2", 100005, 60, "t60", 2, 10002]' -p aloxideuser2@active
cleost push action aloxidepolla crevote '["aloxideuser2", 100006, 80, "s80", 2, 10003]' -p aloxideuser2@active
cleost push action aloxidepolla crevote '["aloxideuser3", 100007, 90, "v90", 3, 10001]' -p aloxideuser3@active
cleost push action aloxidepolla crevote '["aloxideuser3", 100008, 90, "t90", 3, 10002]' -p aloxideuser3@active
cleost push action aloxidepolla crevote '["aloxideuser3", 100009, 70, "s70", 3, 10003]' -p aloxideuser3@active
cleost push action aloxidepolla crevote '["aloxideuser4", 100011, 90, "v90", 4, 10001]' -p aloxideuser4@active
cleost push action aloxidepolla crevote '["aloxideuser4", 100012, 80, "t80", 4, 10002]' -p aloxideuser4@active
cleost push action aloxidepolla crevote '["aloxideuser4", 100013, 90, "s90", 4, 10003]' -p aloxideuser4@active
cleost push action aloxidepolla crevote '["aloxideuser5", 100014, 80, "v80", 5, 10001]' -p aloxideuser5@active
cleost push action aloxidepolla crevote '["aloxideuser5", 100015, 80, "t80", 5, 10002]' -p aloxideuser5@active
cleost push action aloxidepolla crevote '["aloxideuser5", 100016, 80, "s80", 5, 10003]' -p aloxideuser5@active

# Vote for poll 2
cleost push action aloxidepolla crevote '["aloxideuser1", 200001, 95, "v95", 1, 20001]' -p aloxideuser1@active
cleost push action aloxidepolla crevote '["aloxideuser1", 200002, 70, "t70", 1, 20002]' -p aloxideuser1@active
cleost push action aloxidepolla crevote '["aloxideuser2", 200003, 80, "v80", 2, 20001]' -p aloxideuser2@active
cleost push action aloxidepolla crevote '["aloxideuser2", 200004, 90, "t90", 2, 20002]' -p aloxideuser2@active
cleost push action aloxidepolla crevote '["aloxideuser3", 200005, 70, "v70", 3, 20001]' -p aloxideuser3@active
cleost push action aloxidepolla crevote '["aloxideuser3", 200006, 85, "t85", 3, 20002]' -p aloxideuser3@active
cleost push action aloxidepolla crevote '["aloxideuser4", 200007, 55, "v55", 4, 20001]' -p aloxideuser4@active
cleost push action aloxidepolla crevote '["aloxideuser4", 200008, 77, "t77", 4, 20002]' -p aloxideuser4@active
cleost push action aloxidepolla crevote '["aloxideuser5", 200009, 98, "v98", 5, 20001]' -p aloxideuser5@active
cleost push action aloxidepolla crevote '["aloxideuser5", 200011, 94, "t94", 5, 20002]' -p aloxideuser5@active

```

## ICON

Head block: 7563483

```bash
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser1 -p ~~secret~~ ./action-payload/crePoll1001.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser1 -p ~~secret~~ ./action-payload/crePoll2001.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser1 -p ~~secret~~ ./action-payload/creOption10001.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser1 -p ~~secret~~ ./action-payload/creOption10002.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser1 -p ~~secret~~ ./action-payload/creOption10003.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser1 -p ~~secret~~ ./action-payload/creOption20001.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser1 -p ~~secret~~ ./action-payload/creOption20002.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser1 -p ~~secret~~ ./action-payload/creVote100001.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser2 -p ~~secret~~ ./action-payload/creVote100004.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser3 -p ~~secret~~ ./action-payload/creVote100007.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser4 -p ~~secret~~ ./action-payload/creVote100011.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser5 -p ~~secret~~ ./action-payload/creVote100014.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser1 -p ~~secret~~ ./action-payload/creVote100002.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser2 -p ~~secret~~ ./action-payload/creVote100005.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser3 -p ~~secret~~ ./action-payload/creVote100008.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser4 -p ~~secret~~ ./action-payload/creVote100012.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser5 -p ~~secret~~ ./action-payload/creVote100015.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser1 -p ~~secret~~ ./action-payload/creVote100003.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser2 -p ~~secret~~ ./action-payload/creVote100006.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser3 -p ~~secret~~ ./action-payload/creVote100009.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser4 -p ~~secret~~ ./action-payload/creVote100013.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser5 -p ~~secret~~ ./action-payload/creVote100016.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser1 -p ~~secret~~ ./action-payload/creVote200001.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser2 -p ~~secret~~ ./action-payload/creVote200003.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser3 -p ~~secret~~ ./action-payload/creVote200005.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser4 -p ~~secret~~ ./action-payload/creVote200007.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser5 -p ~~secret~~ ./action-payload/creVote200009.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser1 -p ~~secret~~ ./action-payload/creVote200002.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser2 -p ~~secret~~ ./action-payload/creVote200004.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser3 -p ~~secret~~ ./action-payload/creVote200006.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser4 -p ~~secret~~ ./action-payload/creVote200008.json
tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser5 -p ~~secret~~ ./action-payload/creVote200011.json

```

I made a script written in nodejs: [push-data.js](./icon/push-data.js).

```bash
node push-data.js

source push-data.sh
```
