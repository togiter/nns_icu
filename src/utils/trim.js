String.prototype.Trim = function()    
{    
return this.replace(/(^\s*)|(\s*$)/g, "");    
}    
String.prototype.LTrim = function()    
{    
return this.replace(/(^\s*)/g, "");    
}    
String.prototype.RTrim = function()    
{    
return this.replace(/(\s*$)/g, "");    
}


//main.js  import