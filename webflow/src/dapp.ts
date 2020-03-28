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

function getProvider () {
  let dappHero = (<any>window).dappHero;
  if (dappHero && dappHero.provider) {
    console.log("dappHero.provider:", dappHero.provider);
    // FIXME
    // return dappHero.provider;
  }

  let w3p = new ethers.providers.Web3Provider((<any>window).web3.currentProvider);
  console.log("ethers web3 currentProvider:", w3p);
  return w3p;
}

async function setupCO2ken () {
  setupCO2kenInputHandler();
  setupCO2kenDappHero();
  await setupCO2kenData();
}

async function setupCO2kenData () {
  console.log("setupCO2kenData");
  let provider = getProvider();
  (<any>window).co2ken_provider = provider;
  //const signer = provider.getSigner();
  let price = await ethco2.getCo2kenPrice(provider);
  (<any>window).CO2kenPrice = price;
  console.log("window.CO2kenPrice is now:", price);
}

function setupCO2kenInputHandler () {
  $("#tonnes-co2").on('input', function() {
    let tonnes = $(this).val();
    let price = (<any>window).CO2kenPrice;
    if (!price) {
      console.log("Don't have window.CO2kenPrice yet");
      return;
    }
    $("#offset-dai").val(price * tonnes);
    $("#offset-payment").val(price * tonnes * 1e18);
    triggerChangeOnElement("#offset-payment");
  });
}

function setupCO2kenDappHero () {
  (<any>window).addEventListener(
    'dappHeroConfigLoaded',
    ({ detail: dappHero }) => {
      setupCO2kenOutputsHandler(dappHero);
    });
}

function setupCO2kenOutputsHandler (dappHero) {
  dappHero.listenToContractOutputChange(event => {
    //console.log("Event id", event.element.id);
    //console.log("Event Changes", event);
    if (!event.value) {
      return;
    }
    switch (event.element.id) {
    case "get-token-supply":
      let co2kens = event.value / 1e18;
      $("#field-supply-token").val(co2kens.toFixed(2) + " CO2kens");
      break;
    case "get-total-dai":
      let dai = event.value / 1e18;
      $("#field-DAI-amount").val(dai.toFixed(2) + " DAI");
      break;
    case "get-gas-footprint":
      let g = event.value / 1e12;
      $("#field-co2-gas").val(g.toFixed(2) + "g CO2");
      break;
    }
  });
}

jQuery(($) => {
  setupCO2ken();
});
