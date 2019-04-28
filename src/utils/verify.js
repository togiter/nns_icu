//由数字、26个英文字母或者下划线组成的字符串: ^/w+$

const number_alphabet =  '^[0-9a-zA-Z_]{1,}$';

//由26个英文字母组成的字符串 :

 const alphabet = '^[A-Za-z]+$';

//.由26个英文字母的大写组成的字符串 :

const B_alphabet = '^[A-Z]+$';
//.由26个英文字母的小写组成的字符串 :

const L_alphabet = '^[a-z]+$';

//.由数字和26个英文字母组成的字符串
const numberAlphabet =  '^[A-Za-z0-9]+$';

//.url:
const url = '^[a-zA-z]+://(/w+(-/w+)*)(/.(/w+(-/w+)*))*(/?/S*)?$';

//.电话号码:

 const mobile = '(d+-)?(d{4}-?d{7}|d{3}-?d{8}|^d{7,8})(-d+)?';

//.匹配中文字符的正则表达式：
const chinese =  '[/u4e00-/u9fa5]';

//.匹配HTML标记的正则表达式：

const html = '<(.*)>.*<///1>|<(.*) //>';

//.匹配国内电话号码：

const phone = '(/d{3}-|/d{4}-)?(/d{8}|/d{7})?';

//只能输入数字：

const number = '^[0-9]*$';

//验证是否包含有 ^%&’,;=?$/”等字符：

// 、只含有汉字、数字、字母、下划线不能以下划线开头和结尾
//
// ^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$

//只含有汉字、数字、字母、下划线，下划线位置不限
const special = '^[a-zA-Z0-9_\u4e00-\u9fa5]+$';


function verify(pattern,str) {
   let reg = new RegExp(pattern);
   return reg.test(str);
}

//不包含特殊字符，只含有汉字、数字、字母、下划线，下划线位置不限
export function specialChars(str) {
  return !verify(special,str);
}


