//判断字符串字节数，1中文占2字节，英文1个
function bytesLen(str) {   
    let type = typeof str; 
    if(type == 'array'){
        console.log('array bytesLen:',len);
        return str.length;
    }
    let len = 0;    
    for (var i=0; i<str.length; i++) {    
        let ch = str.charCodeAt(i);
        console.log('ch',ch);
        if (ch > 127 || ch ==94) {    
             len += 2;    
         } else {    
             len++;    
         }    
     }  
     console.log('bytesLen:',len);
    return len;    
}    
export {
    bytesLen,
}