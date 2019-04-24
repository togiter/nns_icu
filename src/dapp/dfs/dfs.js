const Dfs = require('ipfs');
console.log("hre")
//创建并返回分布式文件系统dfs节点
const  dfs = new Dfs();
dfs.on('ready',()=>{
 // // Your node is now ready to use \o/
  console.log('Node is ready to use!')

  dfs.start(error => {

    if (error) {
      return console.error('Node failed to start!', error)
    }
    console.log('Node started!')
  })
  //// stopping a node
  //node.stop(() => {
    //// node is now 'offline'
 // })
});

dfs.on('error',error=>{
  console.log('error listen:',error.message);
});


//Add files and data.If no callback(function (err, res) {}) is passed, a promise is returned
/*
*Where data may be:
*a Buffer instance
*a Readable Stream
*a Pull Stream
*an array of objects, each of the form:
{
  path: '/tmp/myfile.txt', // The file path
  content: <data> // A Buffer, Readable Stream or Pull Stream with the contents of the file
}
 */
function dfsAdd(data,callback) {
  console.log('data',data);
  let type = typeof data;
  type = type.toLocaleLowerCase();
  console.log("add dfs",data);
  if(type == 'string'){
    data = Dfs.Buffer.from(data);
  }else if(type == 'object') {

  }else if (type == 'array') {

  }
  if(callback && typeof callback == "function"){
     dfs.add(data,callback);
  }else {
    return new Promise(dfs.add(data));
  }
}

/*
 *ipfsPath can be of type:

cid of type:
Buffer, the raw Buffer of the cid
String, the base58 encoded version of the cid
String, including the ipfs handler, a cid and a path to traverse to, ie:
'/ipfs/QmXEmhrMpbVvTh61FNAxP9nU7ygVtyvZA8HZDUaqQCAb66'
'/ipfs/QmXEmhrMpbVvTh61FNAxP9nU7ygVtyvZA8HZDUaqQCAb66/a.txt'  //hash为目录
'QmXEmhrMpbVvTh61FNAxP9nU7ygVtyvZA8HZDUaqQCAb66/a.txt'
 */
//下载
function dfsGot(ipfsPath,callback) {
  if(ipfsPath == undefined || ipfsPath == null || ipfsPath.length <= 0) {
    console.log('hash can not be empty!')
    return;
  }
  if(callback && typeof callback ==  'function'){
      dfs.get(ipfsPath,callback);
  }else {
     return new Promise(dfs.get(ipfsPath));
  }
}

function dfsCat(ipfsPath,callback) {
    console.log('dfsCat path can not be empty!',ipfsPath)
    if(ipfsPath == undefined || ipfsPath == null || ipfsPath.length <= 0) {
        console.log('hash can not be empty!')
        return;
    }
    if(callback && typeof callback ==  'function'){
        dfs.cat(ipfsPath,callback);
    }else {
        return new Promise(dfs.cat(ipfsPath));
    }
}

export {
    dfsAdd,
    dfsCat,
    dfsGot
};

