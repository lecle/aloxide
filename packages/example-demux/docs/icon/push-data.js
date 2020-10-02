const fs = require('fs');
const generatePayload = require('./generate-payload');
const data = require('../poll-data.json');

generatePayload(data);

let script = `#!/usr/bin/env bash

# remove this function if you don't use docker
function tbears() {
  docker run -it --rm -v $(pwd):/app iconloop/t-bears $@
}

tbears lastblock -u https://bicon.net.solidwallet.io/api/v3

`;

const tbears = {
  commands: [],
  sendtx(name, userId) {
    const command = `tbears sendtx -u https://bicon.net.solidwallet.io/api/v3 -k ./aloxideuser${userId} -p ~~secret~~ ./action-payload/${name}`;
    this.commands.push(command);
    return Promise.resolve();
  },
};

const promises = data.map(poll => {
  return tbears.sendtx(`crePoll${poll.pollId}.json`, 1).then(() => {
    return Promise.all(
      poll.options.map(option => {
        return tbears.sendtx(`creOption${option.optionId}.json`, 1).then(() => {
          return Promise.all(
            option.votes.map(vote => {
              return tbears.sendtx(`creVote${vote.voteId}.json`, vote.ownerId);
            }),
          );
        });
      }),
    );
  });
});

Promise.all(promises).then(() => {
  const fileName = './push-data.sh';
  const data = `${script}${tbears.commands.join('\n')}\n`;

  fs.writeFileSync(fileName, data, {
    encoding: 'utf-8',
  });

  console.info('-- script file:\n', data);
});
