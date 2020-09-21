import fs from 'fs';
import path from 'path';

import EOSJungle from  '../src/network-providers/eos-jungle';

const network = {
    host:'nodes.get-scatter.com',
    port:443,
    protocol:'https',

};

describe('Network Providers', function () {


  describe('Network Instantiation ', function () {
      it('Should instantiate with a correct Network from connection', async () => {
        const jungle = new EOSJungle(network);

        expect(jungle.host).toEqual(network.host);
        expect(jungle.port).toEqual(network.port);
        expect(jungle.protocol).toEqual(network.protocol);
        expect(jungle.name).toEqual('jungle');
        expect(jungle.coreToken).toEqual('EOS');
        expect(jungle.url()).toEqual('https://nodes.get-scatter.com:443');
      });
  });

});