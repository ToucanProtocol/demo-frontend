// import "babel-polyfill";
import * as ethco2 from "eth-co2";
import { ethers } from "ethers";

let jQuery = (<any>window).jQuery || undefined;
let $ = jQuery;

function triggerChangeOnElement(selector) {
  const elem = document.querySelector(selector);
  const event = new Event("input");
  elem.dispatchEvent(event);
}

function getProvider () {
  let w3p = new ethers.providers.Web3Provider((<any>window).web3.currentProvider);
  console.log("ethers web3 currentProvider:", w3p);
  return w3p;
}

async function setupCO2ken () {
  setupCO2kenProvider();
  setupCO2kenData();
  setupCO2kenInputHandler();
  await setupCO2kenDappHero();
}

function setupCO2kenProvider () {
  let provider = getProvider();
  //const signer = provider.getSigner();
  let co2ken = {
    provider: provider,
  };
  (<any>window).co2ken = co2ken;
}

async function setupCO2kenData () {
  await updateCO2kenData();

  let tonnes = $("#tonnes-co2");
  if (tonnes.val() == "") {
    let defaultTonnes = 1;
    tonnes.val(defaultTonnes);
    updatePaymentFields(defaultTonnes);
  }

  (<any>window).setInterval(async () => { updateCO2kenData(); }, 2000);
}

async function updateCO2kenData () {
  console.debug("updateCO2kenData() called");

  let co2ken = (<any>window).co2ken;
  let provider = co2ken.provider;

  co2ken.price = await ethco2.getCo2kenPrice(provider);
  if (co2ken.price) {
    $("#field-token-price").val(co2ken.price + " DAI");
    let tonnes = $("#tonnes-co2").val();
    if (tonnes != "") {
      updatePaymentFields(tonnes);
    }
  }

  co2ken.gasCarbonFootprint = await ethco2.getGasCarbonFootprint(provider);
  if (co2ken.gasCarbonFootprint) {
    let grammes = co2ken.gasCarbonFootprint / 1e12;
    let display = grammes.toFixed(2) + "g CO2";
    $("#field-co2-gas").val(display);
    $("#field-co2-gas").attr("value", display);
  }

  co2ken.totalSupply = await ethco2.getCo2kenSupply(provider);
  if (co2ken.totalSupply) {
    let co2kens = co2ken.totalSupply / 1e18;
    let display = co2kens.toFixed(2) + " CO2kens";
    $("#field-supply-token").val(display);
    $("#field-supply-token").attr("value", display);
  }

  co2ken.paymentsBalance = await ethco2.getCo2kenPaymentsBalance(provider);
  if (co2ken.paymentsBalance) {
    let balance = co2ken.paymentsBalance / 1e18;
    let display = balance.toFixed(2) + " DAI";
    $("#field-DAI-amount").val(display);
    $("#field-DAI-amount").attr("value", display);
  }

  console.debug("window.co2ken is now:", co2ken);
}

function setupCO2kenInputHandler () {
  $("#tonnes-co2").on("input", function() {
    let tonnes = $(this).val();
    updatePaymentFields(tonnes);
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
    return;
  }

  let dai = price * tonnes;
  $("#offset-dai").val(dai + " DAI");
  let payment = dai * 1e18;
  $("#offset-payment").val(payment);
  $("#offset-payment").attr("value", payment);
  // Make sure dappHero knows about the new value:
  triggerChangeOnElement("#offset-payment");
}

function setupCO2kenDappHero () {
  (<any>window).addEventListener(
    "dappHeroConfigLoaded",
    async ({ detail: dappHero }) => {
      console.log("dappHeroConfigLoaded;\ndappHero:", dappHero,
                  "\ndappHero.provider:", dappHero.provider)
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
  });
}

jQuery(($) => {
  setupCO2ken();
});
