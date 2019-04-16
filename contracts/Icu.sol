pragma solidity >=0.4.21 < 0.6.0;
contract NightNightSix{
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


    Enterprise[] public enterprises;
   
    //post enterprise info
    function postEnterprise() public payable {
        require(enterprise.name != "","enterprise name can not be empty!");
        this.enterprises.push(enterprise);
    }
     //post discuss
    function postDiscuss(uint entId,Discuss discuss) public payable {
        require(Discuss.content != "","content can not be empty!");
        this.enterprises.push(enterprise);
    }

    //get the enterprise
    function enterprise(uint entId) public returns(Enterprise enterprise) {
        for(uint i = 0;i < this.enterprises.length;i++){
            if(entId == this.enterprises[i].entId){
                enterprise = this.enterprises[i];
            }
        }
    }

}
