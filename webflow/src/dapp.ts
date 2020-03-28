// import "babel-polyfill";
import * as ethco2 from "../../../eth-co2/dist/eth-co2";
import { ethers } from "ethers";

let jQuery = (<any>window).jQuery || undefined;
let $ = jQuery;

function triggerChangeOnElement(selector) {
  const elem = document.querySelector(selector);
  const event = new Event("input");
  elem.dispatchEvent(event);
}

function getProvider (dappHero) {
  if (dappHero && dappHero.provider) {
    // console.log("dappHero.provider:", dappHero.provider);
    // FIXME
    // return dappHero.provider;
  }

  let w3p = new ethers.providers.Web3Provider((<any>window).web3.currentProvider);
  console.log("ethers web3 currentProvider:", w3p);
  return w3p;
}

async function setupCO2ken () {
  setupCO2kenInputHandler();
  await setupCO2kenDappHero();
}

async function setupCO2kenData (dappHero) {
  console.log("setupCO2kenData");
  let provider = getProvider(dappHero);
  //const signer = provider.getSigner();

  let co2ken = {
    provider: provider,
    price: await ethco2.getCo2kenPrice(provider),
    gasCarbonFootprint: await ethco2.getGasCarbonFootprint(provider),
  };
  (<any>window).co2ken = co2ken;
  console.log("window.co2ken is now:", co2ken);

  if (co2ken.price) {
    $("#field-token-price").val(co2ken.price + " DAI");
  }

  if (co2ken.gasCarbonFootprint) {
    let grammes = co2ken.gasCarbonFootprint / 1e12;
    $("#field-co2-gas").val(grammes.toFixed(2) + "g CO2");
  }
}

function setupCO2kenInputHandler () {
  $("#tonnes-co2").on("input", function() {
    let tonnes = $(this).val();
    let price = (<any>window).co2ken.price;
    if (!price) {
      console.log("Don't have window.co2ken.price yet");
      return;
    }
    $("#offset-dai").val(price * tonnes);
    $("#offset-payment").val(price * tonnes * 1e18);
    triggerChangeOnElement("#offset-payment");
  });
}

function setupCO2kenDappHero () {
  (<any>window).addEventListener(
    "dappHeroConfigLoaded",
    async ({ detail: dappHero }) => {
      console.log("dappHeroConfigLoaded;\ndappHero:", dappHero,
                  "\ndappHero.provider:", dappHero.provider)
      setupCO2kenOutputsHandler(dappHero);
      await setupCO2kenData(dappHero);
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
    }
  });
}

jQuery(($) => {
  setupCO2ken();
});
