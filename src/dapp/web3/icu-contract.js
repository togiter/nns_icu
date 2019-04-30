import {web3,contract} from './web2eth'

import {hexToHash,hashToHex,strToBytes,bytesToStr,uint8ArrayToStr} from '../../utils/convert'
import {dfsCat} from '../dfs/dfs'
let BN = require('big-number')
let defaultAccount;
web3.eth.getAccounts().then((err,values)=>{
    console.log('accounts',err,values);
    if(!err){
        defaultAccount = values[0];
    }
});
console.log('defautAccount:',defaultAccount);
if(defaultAccount === 'undefined' || defaultAccount == null){
    defaultAccount = '0x56883a96436de5fa5fdfaef9e470dafb0a8bc609';
}


/*
合约事件回调结果:
address: "0x1B3EF204c897A421b915E071167036b024f27Ea9"
blockHash: "0x2344bfc9b2135c55d3e2c5b2e45e63397d4ed1f9426e5bbd2afc8d65b1d75437"
blockNumber: 12
event: "logEnterprise"
id: "log_0x3b0a045dbe2e2e5d14222e5e614dae4ae6a467b9735e99caafc8d36535dea411"
logIndex: 0
raw:
data: "0x0000000000000000000000008059c1773d9065b2e1c567be9849c46953eb264a9a422be289a5c7fc13fd8f46ad012e12d8f45884d1568914043057acbc00bb62"
topics: Array(3)
0: "0x3edf6caca4ece5fadb1fbae8b9b041b20da53367ea7753e5a704c9a5d024b175"
1: "0x0000000000000000000000000000000000000000000000000000000000000004"
2: "0xe4baace4b89c0000000000000000000000000000000000000000000000000000"
length: 3
__proto__: Array(0)
__proto__: Object
returnValues:
0: "0x8059c1773d9065B2e1C567BE9849C46953EB264A"
1: BigNumber
_hex: "0x04"
_ethersType: "BigNumber"
__proto__: Object
2: "0xe4baace4b89c0000000000000000000000000000000000000000000000000000"
3: "0x9a422be289a5c7fc13fd8f46ad012e12d8f45884d1568914043057acbc00bb62"
enterpriseId: BigNumber
_hex: "0x04"
_ethersType: "BigNumber"
__proto__: Object
from: "0x8059c1773d9065B2e1C567BE9849C46953EB264A"
hashStr: "0x9a422be289a5c7fc13fd8f46ad012e12d8f45884d1568914043057acbc00bb62"
name: "0xe4baace4b89c0000000000000000000000000000000000000000000000000000"
__proto__: Object
signature: "0x3edf6caca4ece5fadb1fbae8b9b041b20da53367ea7753e5a704c9a5d024b175"
transactionHash: "0x6dd6e431b8885b4822174c465cf0a2b169b84bafc5908721652ae1c8272437b1"
transactionIndex: 0
type: "mined"
*/

/**
*保存企业
*@param name 企业名称
*@param hash 企业信息hash，ipfs提交
*/
function web3SaveEnterprise(name,hash,callback){
    if(name === 'undefined' || name == null || name.lenght <= 0){
        console.log('miss enterprise name');
        return;
    }
    if(hash === 'undefined' || hash == null || hash.lenght <= 0){
        console.log('miss enterprise hash ');
        return;
    }
    let bytesName;
    //转为32个位数组
     bytesName = strToBytes(name,32);
     console.log(name,'str to bytes',bytesName);

     //hash 先用base58解码，再转为hex，然后转为32位数组
    let hash2Hex = hashToHex(hash);
    console.log(hash,'-to-hex',hash2Hex)
    let hex2bytes = web3.utils.hexToBytes(hash2Hex);
    console.log(hash,'-to bytes-',hex2bytes);

    //监听合约事件
    contract.events.logEnterprise((err,event)=>{
        console.log('eventInfo',err,event);
    }).on('data',(result)=>{

      //获取返回值
     let returnVals = result.returnValues;
     let name = returnVals.name;
     //解码hex到字符数组
     name = web3.utils.hexToBytes(name);
     //字符数组转字符串
     name = bytesToStr(name);

     let hash = hexToHash(returnVals.hashStr);
     console.log("orgi Hash",hash);
     dfsCat(hash,(err,resp)=>{
        console.log("hash err resp",err,uint8ArrayToStr(resp));
     });
     console.log(name,'-保存成功-',result);
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
/*合约Icu 根据企业Id获取企业信息
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
        console.log(err,'resulthere',uint8ArrayToStr(result));
        // callback(err,uint8ArrayToStr(result));
        if(typeof callback === 'function'){
            //uint8ArrayToStr
            callback(err,uint8ArrayToStr(result));
        }
     });
   });
}

/** 
*根据名单类型查询企业列表
*colorType -1 黑名单，0，灰名单，1白名单
*返回指定名单的企业列表
*callback(err,list)
*/
function web3QueryEnterprisesType(colorType,callback){//按区块跨度查询也不靠谱...
    contract.getPastEvents('logEnterprise',{
        filter:{
            colorType:colorType
        }},
        (err,result)=>{
            console.log('enterpriseType',err,result);
            if(err){
                callback(err,null);
                return;
            }
           
            let vals = result.returnValues;
            

        }
    ).then(result=>{

    });
}

/**
*根据名称查询企业
* @param name 企业名称
 */
function web3QueryEnterpriseName(name,callback) {
    let bytes64 = strToBytes('',64);
    let str64 = bytes64.toString().replace(/,/g,'');//全局替换','
    let nameHex = web3.utils.toHex(name); //转为16进制
    name = nameHex + str64.substring(nameHex.length-2); //-2表示前面0x位数

    console.log('namehex',name);
   // name = '0x' + name.toString('hex').replace(/^1220/,'');
    // console.log('nameHex',name);
     contract.getPastEvents('logEnterprise',{
         filter:{
             name:name
         }
     },(err,result)=>{
         console.log('event err/result',err,result);
         if(err){
             callback(err,null);
             return;
         }
         if(result.length <= 0){
             callback(err,null);
             return;
         }
         //获取返回值
         let returnVals = result[0].returnValues;
         let name = returnVals.name;
         //解码hex到字符数组
         name = web3.utils.hexToBytes(name);
         //字符数组转字符串
         name = bytesToStr(name);

         let hash = hexToHash(returnVals.hashStr);
         dfsCat(hash,(err,resp)=>{
             console.log("ipfs err resp",err,uint8ArrayToStr(resp));
             callback(err,uint8ArrayToStr(resp));
         });

     }).then(events=>{
         console.log("events",events);
     });
}

/**
*获取区块链上企业的数量
*
*/
function web3GetEnterprisesCount(callback){
    contract.methods.getEnterprisesCount().call({from:defaultAccount},(err,result)=>{
        console.log('err',err,'result',result)

        if( typeof callback == 'function'){
            let count = 0;
            if(!err){
                //bigNumber to string to int
                count = Number.parseInt(result.toString(10));
            }
            callback(err,count);
        }
    });
}

export {
    web3SaveEnterprise,
    web3GetEnterprise,
    web3GetEnterprisesCount,
    web3QueryEnterpriseName,
    web3QueryEnterprisesType
}
