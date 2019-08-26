pragma solidity ^0.5.0;

contract Voting{
    
    bytes32 [] candidates;
    
    mapping(bytes32 => uint) candidatesVotingCount;
    
    constructor(bytes32[] memory _candidates) public {
        for(uint i=0;i< _candidates.length; i++) {
            candidates.push(_candidates[i]);
        }
        
    }
    
    function createVoting(bytes32[] memory _candidates) public {
        candidates = _candidates;
    }
    
    function votingToPerson(bytes32 _person) public {
        require(isValidToPerson(_person));
        candidatesVotingCount[_person] += 1;
    }
    
    function votingTotalPerson(bytes32 _person) public view returns(uint) {
        require(isValidToPerson(_person));
        return candidatesVotingCount[_person];
    }
    
    function isValidToPerson(bytes32 _person) private view returns(bool) {
        for(uint i = 0; i < candidates.length; i++) {
            if(candidates[i]==_person) {
                return true;
            }
        }
        return false;
    }
    
    function getNum(uint _num) public pure returns(uint) {
        return ++ _num;
    }
}