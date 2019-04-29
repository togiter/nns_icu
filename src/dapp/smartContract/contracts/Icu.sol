pragma solidity >=0.5.0 <0.7.0;
contract Icu{
    /*
    * query key enterprise hash(data will be saved in ipfs) with name,color
    * 
    */
    struct Enterprise{
        bytes32  name; 
        bytes32 hashStr;
    }
    //检索(name)通过日记结构来进行
    event logEnterprise(address from,uint256 indexed enterpriseId, bytes32 indexed name,bytes32 hashStr);
    uint256 enterprisesCount;
    mapping(uint256=>Enterprise) enterprises;

    modifier out(uint256 entId){
        require(enterprisesCount >= entId && entId > 0,"enterpriseId must be empty ");
        _;
    }
    function saveEnterprise(bytes32 name,bytes32 hashStr) public{
        enterprisesCount++;
        enterprises[enterprisesCount] = Enterprise(name,hashStr);
        emit logEnterprise(msg.sender,enterprisesCount,name,hashStr);
    } 

    function getEnterprise(uint256 entId) public view out(entId) returns(bytes32 name,bytes32 hashStr) {
        Enterprise storage ent = enterprises[entId];
        name = ent.name;
        hashStr = ent.hashStr;
        

        //return (ent.name,ent.hashStr);
    }

    function getEnterprisesCount() public view returns (uint256){
        return enterprisesCount;
    }
}
/*
*事件，日志这两个概念。事件发生后被记录到区块链上成为了日志。总的来说，事件强调功能，一种行为；日志强调存储，内容。
*事件是以太坊EVM提供的一种日志基础设施。事件可以用来做操作记录，存储为日志。也可以用来实现一些交互功能，比如通知UI，返回函数调用结果等。
*当定义的事件触发时，我们可以将事件存储到EVM的交易日志中，日志是区块链中的一种特殊数据结构。日志与合约关联，与合约的存储合并存入区块链中。
*只要某个区块可以访问，其相关的日志就可以访问。但在合约中，我们不能直接访问日志和事件数据（即便是创建日志的合约）
*链接：https://www.jianshu.com/p/131c07c6f72f
*/