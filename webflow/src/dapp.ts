// import "babel-polyfill";
import * as ethco2 from "../../../eth-co2/dist/ts/eth-co2";
import { ethers } from "ethers";

let jQuery = (<any>window).jQuery || undefined;
let $ = jQuery;

function triggerChangeOnElement(selector) {
  const elem = document.querySelector(selector);
  const event = new Event('input');
  elem.dispatchEvent(event);
}

function get_provider () {
  if (window.dappHero && window.dappHero.provider) {
    return window.dappHero.provider;
  }

  return new ethers.providers.Web3Provider((<any>window).web3.currentProvider);
}

jQuery(async ($) => {
  let provider = get_provider();
  (<any>window).co2ken_provider = provider;
  //const signer = provider.getSigner();
  let price = await ethco2.getCo2kenPrice(provider);
  (<any>window).price = price;

  $("#tonnes-co2").on('input', function() {
    let tonnes = $(this).val();
    $("#offset-dai").val(price * tonnes);
    $("#offset-payment").val(price * tonnes * 1e18);
    triggerChangeOnElement("#offset-payment");
  });

  let dappHero = (<any>window)["dappHero"];
  dappHero.listenToContractOutputChange(event => {
    //console.log("Event id", event.element.id);
    //console.log("Event Changes", event);
    if (!event.value) {
      return;
    }
    switch (event.element.id) {
    case "get-token-supply":
      let co2kens = parseInt(event.value._hex) / 1e18;
      $("#field-supply-token").val(co2kens.toFixed(2) + " CO2kens");
      break;
    case "get-total-dai":
      let dai = parseInt(event.value._hex) / 1e18;
      $("#field-DAI-amount").val(dai.toFixed(2) + " DAI");
      break;
    case "get-gas-footprint":
      let g = parseInt(event.value._hex) / 1e12;
      $("#field-co2-gas").val(g.toFixed(2) + "g CO2");
      break;
    }
  });
});
