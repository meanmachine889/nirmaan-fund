// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.19;

contract CampaignFactory {
    address[] public deployedContracts;
    string[] public contractNames;

    function deploy(uint minimum, string memory name) public {
        address temp = address(new Campaign(minimum, msg.sender, name));
        deployedContracts.push(temp);
        contractNames.push(name);       
    }

    function getDeployed() public view returns (address[] memory) {
        return deployedContracts;
    }

    function getDeployedNames() public view returns (string[] memory) {
        return contractNames;
    }
}

contract Campaign {
    struct Request {
        uint256 task_id;
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    struct Payments {
        uint256 task_id;
        string description;
        uint256 value;
        address recipient;
    }

    string public name;
    address public manager;
    mapping(address => bool) public contributors;
    uint256 public minContribution;
    Request[] public requests;
    Payments[] public payments;
    uint public contributorCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint256 min, address creator, string memory campaignName) {
        name = campaignName;
        manager = creator;
        minContribution = min;
        contributorCount = 0;
    }

    function contribute() public payable {
        require(msg.value >= minContribution);
        if(!contributors[msg.sender]) {
            contributorCount++;
        }
        contributors[msg.sender] = true;
    }

    function createRequest(
        string memory description,
        uint256 value,
        address recipient,
        uint256 task_id
    ) public restricted {
        Request storage newReq = requests.push();
        newReq.description = description;
        newReq.value = value;
        newReq.recipient = recipient;
        newReq.complete = false;
        newReq.approvalCount = 0;
        newReq.task_id = task_id;
    }

    function approveRequest(uint index) public {
        require(contributors[msg.sender]);
        require(!requests[index].approvals[msg.sender]);

        Request storage temp = requests[index];

        temp.approvalCount++;
        temp.approvals[msg.sender] = true;
    }

    function finalizeRequest(uint index) public payable restricted {
        Request storage temp = requests[index];
        require(!temp.complete, "Request already finalized");
        require(
            temp.approvalCount == contributorCount,
            "Not enough approvals"
        );
        require(
            address(this).balance >= temp.value,
            "Insufficient contract balance"
        );

        temp.complete = true;

        address recipient = temp.recipient;
        payable(recipient).transfer(temp.value);
        payments.push(Payments(temp.task_id, temp.description, temp.value, recipient));
    }

    function getSummary()
        public
        view
        returns (string memory, address, uint, uint, uint, uint, uint)
    {
        return (
            name,
            manager,
            address(this).balance,
            minContribution,
            requests.length,
            contributorCount,
            payments.length
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}
