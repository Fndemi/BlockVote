// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;

    enum Phase {
        Registering,
        Voting,
        Ended
    }

    Phase public currentPhase;

    uint256 public votingEndTime;

    struct Candidate {
        string name;
        string department;
        uint256 voteCount;
    }

    mapping(address => string) public studentDepartment;
    mapping(address => bool) public hasVoted;
    mapping(string => Candidate[]) public departmentCandidates;

    event VoterRegistered(address voter, string department);
    event CandidateAdded(string name, string department);
    event VoteCasted(address voter, string department, uint256 candidateIndex);
    event VotingStarted(uint256 endTime);

    constructor() {
        admin = msg.sender;
        currentPhase = Phase.Registering;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier inPhase(Phase p) {
        require(currentPhase == p, "Wrong phase");
        _;
    }

    function setPhase(uint256 phase, uint256 durationInMinutes) public onlyAdmin {
        currentPhase = Phase(phase);

        // If entering Voting phase, set end time
        if (Phase(phase) == Phase.Voting) {
            votingEndTime = block.timestamp + (durationInMinutes * 1 minutes);
            emit VotingStarted(votingEndTime);
        }
    }

    function registerVoter(string memory _department) public inPhase(Phase.Registering) {
        require(bytes(studentDepartment[msg.sender]).length == 0, "Already registered");
        studentDepartment[msg.sender] = _department;
        emit VoterRegistered(msg.sender, _department);
    }

    function addCandidate(string memory _name, string memory _department) public onlyAdmin inPhase(Phase.Registering) {
        departmentCandidates[_department].push(Candidate(_name, _department, 0));
        emit CandidateAdded(_name, _department);
    }

    function vote(uint256 _candidateIndex) public inPhase(Phase.Voting) {
        require(block.timestamp <= votingEndTime, "Voting period has ended");
        require(!hasVoted[msg.sender], "Already voted");

        string memory dept = studentDepartment[msg.sender];
        require(bytes(dept).length > 0, "Not registered");

        Candidate[] storage candidates = departmentCandidates[dept];
        require(_candidateIndex < candidates.length, "Invalid candidate");

        candidates[_candidateIndex].voteCount++;
        hasVoted[msg.sender] = true;

        emit VoteCasted(msg.sender, dept, _candidateIndex);
    }

    function getCandidates(string memory dept) public view returns (Candidate[] memory) {
        return departmentCandidates[dept];
    }
}
