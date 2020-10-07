import { Aloxide, eosJungleConfig } from '../src';

const network = {
  host: 'nodes.get-scatter.com',
  port: 443,
  protocol: 'https',
};

describe('Network Configs', () => {
  describe('Network Instantiation ', () => {
    it('Should instantiate with a correct Network from connection', async () => {
      const config = Object.assign({}, eosJungleConfig, network);
      const jungle = await Aloxide.createService(config);

      expect(jungle.config.host).toEqual(network.host);
      expect(jungle.config.port).toEqual(network.port);
      expect(jungle.config.protocol).toEqual(network.protocol);
      expect(jungle.config.name).toEqual('jungle');
      expect(jungle.config.coreToken).toEqual('EOS');
      expect(jungle.url()).toEqual('https://nodes.get-scatter.com:443');
    });
  });
});
