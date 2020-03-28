// import "babel-polyfill";
import * as ethco2 from "eth-co2";
import { ethers } from "ethers";
import { BigNumber } from "ethers/utils";
import { Provider } from "ethers/providers";

let jQuery = (<any>window).jQuery || undefined;
let $ = jQuery;

function triggerChangeOnElement(selector) {
  const elem = document.querySelector(selector);
  const event = new Event("input");
  elem.dispatchEvent(event);
}

function getProvider() {
  let w3p = new ethers.providers.Web3Provider((<any>window).web3.currentProvider);
  console.log("ethers web3 currentProvider:", w3p);
  return w3p;
}

async function setupCO2ken() {
  setupCO2kenProvider();
  setupCO2kenData();
  setupCO2kenInputHandler();
  await setupCO2kenDappHero();
}

function setupCO2kenProvider() {
  let provider = getProvider();
  //const signer = provider.getSigner();
  let co2ken = {
    provider: provider,
  };
  (<any>window).co2ken = co2ken;
}

async function setupCO2kenData() {
  await updateCO2kenData();

  let tonnes = $("#tonnes-co2");
  if (tonnes.val() == "") {
    let defaultTonnes = 1;
    tonnes.val(defaultTonnes);
    updatePaymentFields(defaultTonnes);
  }

  (<any>window).setInterval(async () => { updateCO2kenData(); }, 2000);
}

async function updateCO2kenData() {
  // console.debug("updateCO2kenData() called", (<any>window).co2ken);

  updateCO2kenDataField(
    ethco2.getCo2kenPrice, "price", "#field-token-price",
    val => val.toString() + " DAI",
    oldVal => {
      let tonnes = $("#tonnes-co2").val();
      if (tonnes != "") {
        updatePaymentFields(tonnes);
        if (oldVal) {
          flashElement("#offset-dai");
        }
      }
    }
  );

  updateCO2kenDataField(
    ethco2.getGasCarbonFootprint, "gasCarbonFootprint", "#field-co2-gas",
    val => (<any>val / 1e12).toFixed(2) + "g CO2");

  updateCO2kenDataField(
    ethco2.getCo2kenSupply, "totalSupply", "#field-supply-token",
    val => (<any>val / 1e18).toFixed(2) + " CO2kens");

  updateCO2kenDataField(
    ethco2.getCo2kenPaymentsBalance, "paymentsBalance", "#field-DAI-amount",
    val => (<any>val / 1e18).toFixed(2) + " DAI");
}


async function updateCO2kenDataField(contractCaller:
                                       (prov: Provider) => Promise<BigNumber>,
                                     property: string,
                                     outputField: string,
                                     formatter: (BigNumber) => string,
                                     onUpdate?: (BigNumber) => void) {
  let co2ken = (<any>window).co2ken;
  let provider = co2ken.provider;

  let newVal = await contractCaller(provider);
  if (newVal) {
    let oldVal = co2ken[property];
    let newDisplay = formatter(newVal);
    if (!oldVal || newDisplay != formatter(oldVal)) {
      console.debug(`Got new value for co2ken.${property}: ${newDisplay} (${newVal})`);
      co2ken[property] = newVal;
      $(outputField).val(newDisplay);
      $(outputField).attr("value", newDisplay);
      if (oldVal) {  // Don't flash the first time when populating empty field
        flashElement(outputField);
      }
      if (onUpdate) {
        onUpdate(oldVal);
      }
    }
  }
}

function setupCO2kenInputHandler() {
  $("#tonnes-co2").on("input", function() {
    let tonnes = $(this).val();
    if (updatePaymentFields(tonnes)) {
      flashElement("#offset-dai");
    }
  });
}

function updatePaymentFields (tonnes) {
  let price = (<any>window).co2ken.price;

  if (!price) {
    console.warn("Don't have window.co2ken.price yet");
  }
  if (!price || tonnes == "") {
    $("#offset-dai").val("");
    $("#offset-payment").val("");
    return false;
  }

  let dai = price * tonnes;
  $("#offset-dai").val(dai + " DAI");
  let payment = dai * 1e18;
  $("#offset-payment").val(payment);
  $("#offset-payment").attr("value", payment);
  // Make sure dappHero knows about the new value:
  triggerChangeOnElement("#offset-payment");
  return true;
}

function flashElement (selector) {
  $(selector)
    .stop(true)
    .animate({ backgroundColor: "#ffab5e" }, 800)
    .animate({ backgroundColor: "#ffffff" }, 600);
}

function setupCO2kenDappHero() {
  (<any>window).addEventListener(
    "dappHeroConfigLoaded",
    async ({ detail: dappHero }) => {
      console.log("dappHeroConfigLoaded;\ndappHero:", dappHero,
                  "\ndappHero.provider:", dappHero.provider)
      setupCO2kenOutputsHandler(dappHero);
    });
}

function setupCO2kenOutputsHandler(dappHero) {
  dappHero.listenToContractOutputChange(event => {
    //console.log("Event id", event.element.id);
    //console.log("Event Changes", event);
    if (!event.value) {
      return;
    }
  });
}

jQuery(($) => {
  setupCO2ken();
});
