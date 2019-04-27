//类型转换类
import {bytesLen} from './util';
const bs58 = require('bs58')  //base58 加密货币常用编码 npm i --save bs58
//参考 https://www.jianshu.com/p/b39a4aed3663
/*string -- bytes32 处理过程：
*String => Hex => 32 length Hex (ie. 64 length HexString) => byte[] => Bytes32
*/

/*
*ipfs/btc/etc的hash值是base58编码的，长度大于32位，不能直接转bytes32，先解码再进行转换
* hash to hex
*/
function hashToHex(dfs_hash){
    console.log('dfs_hash',typeof dfs_hash,dfs_hash);
  //  let buf = bs58.decode(dfs_hash);
  //  console.log('result',buf.toString('hex'));
  //  return buf;
  //添加0x，00
    let hstr = bs58.decode(dfs_hash).toString('hex').replace(/^1220/,'');
    if(hstr.length != 64){ //比特币，以太坊，ipfs等hash为bs58编码
        console.log('非分布式文件系统格式',dfs_hash,hstr);
        return null;
    }
    return '0x'+hstr;
}

/*
*hexStr 2 hash
*     
*
*/ 
function hexToHash(hexStr){
    if(typeof hexStr != 'string'){
        hexStr = hexStr.toString(); //先转为字符串再去0/0x
    }
    if(typeof hexStr == 'string'){
        //去除0x 和0
        hexStr = hexStr.replace(/^0x/,'1220');
    }
    let buf = new Buffer(hexStr,'hex');
    const hash = bs58.encode(buf);
    return hash;
}

//字符串转bytes
function strToBytes(str,bits){  
    var ch, st, re = []; 
     bits = Number.parseInt(bits);
    if(bits == NaN){
        bits = 0;
    }
    let bitsLen = bytesLen(str);
    //补位
    bits = bits - (bitsLen - str.length);
    for (var i = 0; i < Math.max(str.length,bits); i++ ) { 
        if(i >= str.length && i < bits){ //lenght < bits
            re = re.concat(0); //位数不够，补0
            continue;
        }
        ch = str.charCodeAt(i);  // get char 
        st = [];                 // set up "stack"  
        do {  
            st.push( ch & 0xFF );  // push byte to stack  
            ch = ch >> 8;          // shift value down by 1 byte  
         } while ( ch );  
        // add stack contents to result  
        // done because chars have "wrong" endianness  
        re = re.concat( st.reverse() ); 
    }  
    // return an array of bytes  
    return re;  
} 

export {
    hashToHex,
    hexToHash,
    strToBytes
}