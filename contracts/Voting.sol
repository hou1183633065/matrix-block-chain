//声明solidity编译所需版本号
pragma solidity ^0.5.0;
// 创建名为Voting的合约
contract Voting{
    // 创建名为candidates的bytes32数组
    bytes32 [] candidates;
    // 创建名为candidatesVotingCount的映射，键为bytes32值为uint
    mapping(bytes32 => uint) candidatesVotingCount;
    // 初始化合约，创建候选人数组
    function createVoting(bytes32[] memory _candidates) public {
        candidates = _candidates;
    }
    // 通过映射，增加候选人票数
    function votingToPerson(bytes32 _person) public {
        // 断言是否为真，否则中断执行
        require(isValidToPerson(_person));
        // 映射中候选人票数自加1
        candidatesVotingCount[_person] += 1;
    }
    // 通过映射，查询候选人总票数
    function votingTotalPerson(bytes32 _person) public view returns(uint) {
        // 断言是否为真，否则中断执行
        require(isValidToPerson(_person));
        // 返回映射中候选人票数
        return candidatesVotingCount[_person];
    }
    // 是否为映射中存在的候选人
    function isValidToPerson(bytes32 _person) private view returns(bool) {
        for(uint i = 0; i < candidates.length; i++) {
            if(candidates[i]==_person) {
                return true;
            }
        }
        return false;
    }
    // 测试返回数据方法
    function getNum(uint _num) public pure returns(uint) {
        return ++ _num;
    }
}