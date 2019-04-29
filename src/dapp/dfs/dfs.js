const Dfs = require('ipfs');

/*
var ipfsAPI = require('ipfs-api')
 
// connect to ipfs daemon API server
var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'}) // leaving out the arguments will default to these values
 
// or connect with multiaddr
var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')
 
// or using options
var ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'})
 
// or specifying a specific API path
var ipfs = ipfsAPI({host: '1.1.1.1', port: '80', 'api-path': '/ipfs/api/v0'})
*/
//创建并返回分布式文件系统dfs节点
var dfs;
if(dfs==undefined || dfs == null) {
    dfs = new Dfs();
    console.log('new dfs',dfs);
}
// console.log('dfs state',dfs.state);
// if(dfs.state == 'stoped'){
//     dfs.on('ready',()=>{
//         // // Your node is now ready to use \o/
//         console.log('Node is ready to use!')
//
//         dfs.start(error => {
//
//             if (error) {
//                 return console.error('Node failed to start!', error)
//             }
//             console.log('Node started!')
//         });
//     });
// }else if (dfs.state == 'running'){
//
// }

  //// stopping a node
  //node.stop(() => {
    //// node is now 'offline'
 // })

// dfs.on('error',error=>{
//   console.log('error listen:',error.message);
// });


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
    console.log('dfsCat path:',ipfsPath)
    if(ipfsPath == undefined || ipfsPath == null || ipfsPath.length <= 0) {
        console.log('hash can not be empty!')
        return;
    }
    if(callback && typeof callback == 'function'){
      console.log("callback");
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

