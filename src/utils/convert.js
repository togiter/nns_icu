//类型转换类
import {bytesLen} from './util';
const bs58 = require('bs58')  //base58 加密货币常用编码 npm i --save bs58
//参考 https://www.jianshu.com/p/b39a4aed3663
/*string -- bytes32 处理过程：
*String => Hex => 32 length Hex (ie. 64 length HexString) => byte[] => Bytes32.注意：00 等于1个Hex长度或者2个String长度。
*/

/*
*ipfs/btc/etc的hash值是base58编码的，长度大于32位，不能直接转bytes32，先解码再进行转换.
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
    console.log("hexStr",hexStr);
    if(hexStr === 'undefined' || hexStr == null) return "";
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
    var bytes = new Array();
    var len, c;
    len = str.length;
     bits = Number.parseInt(bits);
    if(bits == NaN){
        bits = 0;
    }
    let bitsLen = bytesLen(str);
    //补位
    bits = bits - bitsLen;
    for(var i = 0; i < Math.max(len,bits); i++) {
        if(i >= len && i < bits){ //lenght < bits
            c = 0x000000;//位数不够，补0
        }else{
            c = str.charCodeAt(i);
        }
        if(c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if(c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if(c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
        } else {
            bytes.push(c & 0xFF);
        }
    }
    return bytes;

}

//bytes转string
function bytesToStr(arr) {
    if(typeof arr === 'string') {
        return arr;
    }
    var str = '',
        _arr = arr;
    for(var i = 0; i < _arr.length; i++) {
        var one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
        if(v && one.length == 8) {
            var bytesLength = v[0].length;
            var store = _arr[i].toString(2).slice(7 - bytesLength);
            for(var st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            str += String.fromCharCode(_arr[i]);
        }
    }
    return str;
}

function uint8ArrayToStr(fileData){
    var out, i, len, c;
var char2, char3;

out = "";
len = fileData.length;
i = 0;
while(i < len) {
c = fileData[i++];
switch(c >> 4)
{
case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
// 0xxxxxxx
out += String.fromCharCode(c);
break;
case 12: case 13:
// 110x xxxx 10xx xxxx
char2 = fileData[i++];
out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
break;
case 14:
// 1110 xxxx 10xx xxxx 10xx xxxx
char2 = fileData[i++];
char3 = fileData[i++];
out += String.fromCharCode(((c & 0x0F) << 12) |
((char2 & 0x3F) << 6) |
((char3 & 0x3F) << 0));
break;
}
}
return out;
}

export {
    hashToHex,
    hexToHash,
    strToBytes,
    bytesToStr,
    uint8ArrayToStr
}
