import "babel-polyfill";
import { ethers } from "ethers";

import { getCo2kenPrice } from "../../eth-co2/dist/ts/eth-co2";

const dapp = async () => {
  let provider = new ethers.providers.Web3Provider(web3.currentProvider);
  window.price = await getCo2kenPrice(provider);
};

dapp().catch(e => { console.error(e) });
