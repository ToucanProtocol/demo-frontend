import { ethers } from 'ethers';
import polluterAbi = require('./abi/polluter.json');
import daiAbi = require('./abi/dai.json');

let web3 = (<any>window).web3 || undefined;
const utils = ethers.utils;

const provider = new ethers.providers.Web3Provider(web3.currentProvider);
const signer = provider.getSigner();
let daiToken = new ethers.Contract('0xaFF4481D10270F50f203E0763e2597776068CBc5', daiAbi, signer);

jQuery(async ($) => {
  let enabled: boolean;

  $('.js--connect').click(async function (e) {
    e.preventDefault();
    if (enabled) {
      alert('already enabled');
      return;
    }
    enabled = await (<any>window).ethereum.enable();
    if (enabled) {
      $(this).text('Wallet Connected');
    }
  });

  async function isApproved() {
    let approved = await daiToken.allowance('0x6887444a5B74B746F56ae08952f4e1B404ff7ca5', '0x57AaFA7eA3D66e2C9540d455BDBe093De9DB6bf4');
    approved = utils.toUtf8String(approved);
    return (approved);
  }

  $('.js--test-dai').click(async function (e) {
    e.preventDefault();
    if (!enabled) {
      alert('connect wallet');
      return;
    }
    $(this).text('Getting Test Dai...');
    try {
      let tx = await daiToken.drip();
      await tx.wait(1);
      $(this).text('Test Dai Received');
      setTimeout(() => {
        $(this).html('Get Test Dai <i class="fas fa-faucet-drip"></i>');
      }, 4000);
      alert('View test Dai in wallet by adding the token contract - 0xaFF4481D10270F50f203E0763e2597776068CBc5');
    } catch (err) {
      alert(err);
    }
  });

  $('.js--pollute').click(async function (e) {
    e.preventDefault();
    if (!enabled) {
      alert('connect wallet');
      return;
    }
    // check if approved
    /* let approved = await isApproved();

    if (!approved) {
      approved = await daiToken.approve('0x57AaFA7eA3D66e2C9540d455BDBe093De9DB6bf4', -1);
      console.log(approved);
    } */

    $(this).addClass('polluting');


    let contract = new ethers.Contract('0x57AaFA7eA3D66e2C9540d455BDBe093De9DB6bf4', polluterAbi, signer);
    let tx = await contract.iterator();
    $(this).text('Polluting');
    let receipt = await tx.wait(1);

    $(this).text('Pollute');
    $(this).removeClass('polluting');

    let events = receipt.events;
    let event = events[events.length - 1];

    let totalGasOffset = event.args.totalGasOffset;
    let methodFootprint = event.args.methodFootprint;

    if (totalGasOffset || methodFootprint) {
      let icons = $('.polluter__spin');
      $(icons[0]).find('img').attr('src', './images/3.png');
      $(icons[1]).find('img').attr('src', './images/4.png');
      $('body').addClass('clean');
      $('pre').append(
        `totalGasOffset: ${totalGasOffset}<br />
                methodFootprint: ${methodFootprint}`
      );
      $(this).hide();
    }

    /*
    let signedTransaction = await wallet.sign(transaction);
    console.log(signedTransaction);
    let provider = ethers.getDefaultProvider()
    let tx = await provider.sendTransaction(signedTransaction);
    console.log(tx);
    let text = $(this).text();
    $(this).addClass('sent');
    $(this).text('Sent');
    setTimeout(() => {
        $(this).removeClass('sent');
        $(this).addClass('waiting');
        $(this).text('...waiting');
    }, 3000);

    //let receipt = await tx.wait(1);
    $(this).removeClass('waiting');
    $(this).text(text); */
  })
});
