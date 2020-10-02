const fs = require('fs');
const path = require('path');

const to = 'cxbc1b71bb40ef97c682114e10981169db23138327';

const actionTemplate = data => ({
  jsonrpc: '2.0',
  method: 'icx_call',
  params: {
    nid: '0x3',
    to,
    dataType: 'call',
    data,
  },
});

const createPollTemplate = () =>
  actionTemplate({
    method: 'crepoll',
    params: {
      pollId: 1001,
      name: 'Lets have happy time together.',
      body: 'We have three options. Where should we go?',
      start: 1600621200000,
      end: 1601312400000,
    },
  });

const createOptionTemplate = () =>
  actionTemplate({
    method: 'creoption',
    params: {
      optionId: '',
      name: '',
      pollId: '',
    },
  });

const createVoteTemplate = () =>
  actionTemplate({
    method: 'crevote',
    params: {
      voteId: '',
      point: '',
      message: '',
      ownerId: '',
      optionId: '',
    },
  });

function witeAction(name, data) {
  fs.writeFileSync(path.resolve('./action-payload', name), JSON.stringify(data, null, 2));
}

module.exports = function generatePayload(data) {
  data.forEach(poll => {
    const crePoll = createPollTemplate();
    crePoll.params.data.params.pollId = poll.pollId;
    crePoll.params.data.params.name = poll.name;
    crePoll.params.data.params.body = poll.body;

    witeAction(`crePoll${poll.pollId}.json`, crePoll);

    poll.options.forEach(option => {
      const creOption = createOptionTemplate();
      creOption.params.data.params.optionId = option.optionId;
      creOption.params.data.params.name = option.name;
      creOption.params.data.params.pollId = poll.pollId;

      witeAction(`creOption${option.optionId}.json`, creOption);

      option.votes.forEach(vote => {
        const creVote = createVoteTemplate();
        creVote.params.data.params.voteId = vote.voteId;
        creVote.params.data.params.point = vote.point;
        creVote.params.data.params.message = vote.message;
        creVote.params.data.params.ownerId = vote.ownerId;
        creVote.params.data.params.optionId = option.optionId;

        witeAction(`creVote${vote.voteId}.json`, creVote);
      });
    });
  });
};
