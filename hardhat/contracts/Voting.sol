//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.27;

contract Voting {

    struct Candidate {
        uint256 id;
        string name;
        string lastname;
        string party;
        uint256 votes; 
    }
    
    // List of candidates
    Candidate[] public listOfCandidates;
    // Admin address
    address public admin;
    // Mapping voters's addresses
    mapping(address => bool) public voters;
    // List of voters
    address[] public listOfVoters;
    // Start and end time
    uint256 voteStart;
    uint256 voteEnd;
    // Election status
    bool electionStarted;

    modifier checkIfAdmin() {
        require(msg.sender == admin, "Only admin can start election.");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function startElection(uint256 _startDate, uint256 _endDate) public checkIfAdmin {
        require(electionStarted == false, "Election has started!");
        require((voteEnd == 0) && (voteStart == 0) && (_startDate + 1000000 > block.timestamp) && (_endDate > _startDate), "Election has already started!");
        voteStart = _startDate;
        voteEnd = _endDate;
    }

    function endElection() public {
        electionStarted = false;
        voteStart = 0;
        voteEnd = 0;
    }

    function addCandidate(string memory _name, string memory _lastname, string memory _party) public checkIfAdmin () {
        listOfCandidates.push(Candidate({id: listOfCandidates.length, name: _name, lastname:_lastname, party:_party, votes: 0}));
    }

    function voterStatus(address _voter_address) public view returns (bool) {
        return voters[_voter_address] == true;
    }

    function vote(uint256 _id) public {
        require(!voterStatus(msg.sender), "You already voted.");
        listOfCandidates[_id].votes++;
        voters[msg.sender] = true;
        listOfVoters.push(msg.sender);
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        return listOfCandidates;
    }

    function getDates() public view returns (uint256, uint256) {
        return (voteStart, voteEnd);
    }

    function resetAllVoters() public checkIfAdmin {
        for(uint256 i = 0; i < listOfVoters.length; i++) {
            voters[listOfVoters[i]] = false;
        }
        delete listOfVoters;
    }
}