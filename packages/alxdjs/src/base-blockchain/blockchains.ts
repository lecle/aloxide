export const Blockchains = {
    EOS:'eos',
    ICON:'icon',
    CAN:'can'
};

export const BlockchainsArray =
    Object.keys(Blockchains).map(key => ({key, value:Blockchains[key]}));