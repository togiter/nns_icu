//添加到原型的方法，确保只有最常用的方法才添加进来
import './trim' //导入原型方法

String.prototype.bytesLen = function(){
    let str = this;
    let type = typeof str;
    if(type == 'array'){
        console.log('array bytesLen:',len);
        return str.length;
    }
    str = str.trim();
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
    return len;
}
