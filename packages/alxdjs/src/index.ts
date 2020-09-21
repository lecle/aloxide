import EOS from './blockchain/EOS';
import ICON from './blockchain/ICON';
import {Blockchains} from './base-blockchain/blockchains';
import BaseNetwork  from './base-blockchain/base-network';

export default class alxjs {
    EOS: EOS;
    ICON: ICON;
    constructor(network: BaseNetwork) {
        switch (network.blockchain) {
            case Blockchains.EOS:
                this.EOS = new EOS(network);
                break;
            case Blockchains.ICON:
                this.ICON = new ICON(network);
                break;
            default:
                throw new Error('No supported blockchain')

        }
    }
}