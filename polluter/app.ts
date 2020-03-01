import { ethers } from 'ethers';
import polluterAbi = require('./abi/polluter.json');

let web3 = (<any>window).web3 || undefined;
const utils = ethers.utils;

const provider = new ethers.providers.Web3Provider(web3.currentProvider);
const signer = provider.getSigner();


// let contract = new ethers.Contract("0x6a1B0C693DD4AA99bA8E93247AA221Fb30525Cfe" , polluterAbi, wallet);

let nonce = 0;
// All properties are optional
let transaction = {
    nonce: nonce++,
    gasLimit: 300000,
    gasPrice: utils.bigNumberify("20000000000"),

    to: "0x6a1B0C693DD4AA99bA8E93247AA221Fb30525Cfe",
    // ... or supports ENS names
    // to: "ricmoo.firefly.eth",

    value: utils.parseEther("1.0"),
    data: "0x",

    // This ensures the transaction cannot be replayed on different networks
    chainId: ethers.utils.getNetwork('rinkeby').chainId
}

jQuery(async ($) => {
    let enabled: boolean;

    $('.js--connect').click(async function(e) {
        e.preventDefault();
        if ( enabled ) {
            alert('already enabled');
            return;
        }
        enabled = await (<any>window).ethereum.enable();
        if ( enabled ) {
            $(this).text('Wallet Connected');
        }
    });

    $('.js--pollute').click(async function(e) {
        e.preventDefault();
        if ( !enabled ) {
            alert('connect wallet');
            return;
        }
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

        if ( totalGasOffset || methodFootprint ) {
            $('pre').append(
                `totalGasOffset: ${totalGasOffset}<br />
                methodFootprint: ${methodFootprint}`
            );
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