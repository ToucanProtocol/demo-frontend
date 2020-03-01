// import "babel-polyfill";
import * as ethco2 from "../../../eth-co2/dist/ts/eth-co2";
import { ethers } from "ethers";

let jQuery = (<any>window).jQuery || undefined;
let $ = jQuery;


jQuery(async ($) => {
  const provider = new ethers.providers.Web3Provider((<any>window).web3.currentProvider);
  (<any>window).foo = provider;
  //const signer = provider.getSigner();
  let price = await ethco2.getCo2kenPrice(provider);
  (<any>window).price = price;

  $("#tonnes-co2").on('input', function() {
    let tonnes = $(this).val();
    $("#offset-dai").val(price * tonnes);
    $("#offset-payment").val(price * tonnes * 1e18);
  });
});
