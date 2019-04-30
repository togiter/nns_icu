//web3.js编译Solidity，发布，调用全部流程
//http://webfuse.cn/2019/04/11/web3-js%E7%BC%96%E8%AF%91Solidity%EF%BC%8C%E5%8F%91%E5%B8%83%EF%BC%8C%E8%B0%83%E7%94%A8%E5%85%A8%E9%83%A8%E6%B5%81%E7%A8%8B/
import { WEB3_URL } from '../configs';
const fs = require('fs');
// var solc = require('solc');
const Web3 = require('web3');
const contractJson = require('./../smartContract/build/contracts/Icu.json')
// let source = fs.readFileSync('../smartContract/contracts/Icu.sol','utf-8').toString();
// let result = solc.compile(source);
// console.log('sol source',source);
//console.log('\nresult',result);

var web3;
var contract;
loadWeb3(WEB3_URL);
let addr = '0x595EF7E71828D0539CB6345Bc41fAF7282A4f0F0';
console.log('cj',contractJson);
getContract(contractJson['abi'],addr);
//contractEvent();
function loadWeb3(url){
    web3 = new Web3(url);
    web3.setProvider(url);
    let eth_url = url;
    if (typeof web3 !== 'undefined' && web3 != null) {
        console.log("web3", web3);
        return;
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider(eth_url));
    }
    console.log("web3", web3);
    }

    function getContract(abi,addr){
    if(contract !== undefined && contract != null) return contract;
    // let calcComplied = solc.compile(solidityCode);
    console.log('abi',abi);
    if(web3 === undefined || web3 == null){
        loadWeb3(WEB3_URL);
    }
    //获取合约对象
    contract = web3.eth.Contract(abi,addr);
    console.log("contract",contract);
   }
   function contractEvent(){
       if(contract === 'undefined' || contract == null){
           getContract();
       }
       contract.events.logEnterprise((err,event)=>{
           console.log('eventInfo',err,event);
       }).on('data',(result)=>{
        console.log('data',result);
       }).on('changed',(result)=>{
        console.log('changed',result);
       }).on('error',console.error);
   }
export {
    web3,
    contract
};
