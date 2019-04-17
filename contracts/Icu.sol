pragma solidity >=0.4.22 <0.6.0;
contract Icu{
    struct Discuss{
        string poster;
        string content;
        string timeStr;
    }
    struct Enterprise{
        uint entId;
        string name;
        string department;
        string city;
        string workSystem;
        bytes proof; 
        string timeStr;
        address poster;
        Discuss[] discusses;
    }

    constructor() public{
    }
    Enterprise[] public enterprises;
    //post enterprise info
    function postEnterprise(
        uint entId, 
        string memory name, 
        string memory department,
        string memory city, 
        string memory workSystem,
        bytes memory proof,
        string memory timeStr,
        address poster) public payable {
       // require(name!= "","enterprise name can not be empty!");
        Discuss[] storage discusses;
        Enterprise storage ent = Enterprise(
            {
            entId:enterprises.length+1,
            name:name,
            department:department,
            city:city,
            workSystem:workSystem,
            timeStr:timeStr,
            proof:proof,
            poster:poster,
            discusses:discusses});
        enterprises.push(ent);
    }
     //post discuss
    function postDiscuss(string memory entName,string memory poster,string memory content,string memory timeStr) public payable {
        require(bytes(content).length > 0,"content can not be empty!");
        
        Discuss storage discuss = Discuss({poster:poster,content:content,timeStr:timeStr});
         for(uint i = 0;i < enterprises.length;i++){
            string memory an = enterprises[i].name;
            if(keccak256(abi.encodePacked(entName)) == keccak256(abi.encodePacked(an))){
                 enterprises[i].discusses.push(discuss);
            }
        }
        
    }

}
