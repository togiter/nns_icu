import {web3,contract} from './web2eth'
import {hexToHash,hashToHex,strToBytes,bytesToStr} from '../../utils/convert'
import {dfsCat} from '../dfs/dfs'
let defaultAccount;
web3.eth.getAccounts().then((err,values)=>{
    console.log('accounts',err,values);
    if(!err){
        defaultAccount = values[0];
    }
});
console.log('defautAccount:',defaultAccount);
if(defaultAccount === 'undefined' || defaultAccount == null){
    defaultAccount = '0x07088e88f9426a2f731a3a8a331ee00df976c460';
}
function web3SaveEnterprise(name,hash,callback){
    if(name === 'undefined' || name == null || name.lenght <= 0){
        console.log('miss enterprise name');
        return;
    }
    if(hash === 'undefined' || hash == null || hash.lenght <= 0){
        console.log('miss enterprise hash ');
        return;
    }
    let bytesName;// = web3.utils.stringToHex(name);
     bytesName = strToBytes(name,32);
     console.log(name,'str to bytes',bytesName);
    // bytesName = web3.utils.hexToBytes(bytesName);
    // console.log('hex bytes',bytesName);
    let hash2Hex = hashToHex(hash);
    console.log(hash,'-to-hex',hash2Hex)
    let hex2bytes = web3.utils.hexToBytes(hash2Hex);
    console.log(hash,'-to bytes-',hex2bytes);
    console.log('contracs methods',contract.methods);
    //监听
    contract.events.logEnterprise((err,event)=>{
        console.log('eventInfo',err,event);
    }).on('data',(result)=>{
     console.log('data',result);
     let returnVals = result.returnValues;
     let name = returnVals.name;
     name = web3.utils.hexToBytes(name);
     name = bytesToStr(name);
     console.log('name',name,name.toString());
     let hash = hexToHash(returnVals.hashStr);
     console.log("orgi Hash",hash);
     dfsCat(hash,(err,result)=>{
        console.log('err',err);
     });
    }).on('changed',(result)=>{
     console.log('changed',result);
    }).on('error',console.error);
    //hash值字符串超过32字节，不能直接转为byte32，要先加入前缀0x转为16进制再转为bytes32
    contract.methods.saveEnterprise(bytesName,hex2bytes).send({from:defaultAccount}).then((result)=>{
       console.log('--result',result);
        if(callback && typeof callback == 'function'){
            callback(null,result);
        }
    });

}
/*合约Icu
*接口:getEnterprise
*参数:enterpriseId企业Id
*返回值:name,hashStr(hex)
*事件:
*/
function web3GetEnterprise(enterpriseId,callback){
   contract.methods.getEnterprise(Number.parseInt(enterpriseId)).call({from:defaultAccount},(err,result)=>{
       console.log('err',err,'result',result)
       let name = result.name;
        name = web3.utils.hexToBytes(name);
        name = bytesToStr(name);
        console.log('name',name,name.toString());
       let hexHash = result.hashStr;
       let hash = hexToHash(hexHash);
     console.log("hashStr",hash);
     dfsCat(hash,(err,result)=>{
        console.log(err,err,'resulthere',result);
     });
   });
}

export {
    web3SaveEnterprise,
    web3GetEnterprise
}