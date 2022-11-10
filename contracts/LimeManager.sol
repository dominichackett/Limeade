// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./lib/GenesisUtils.sol";
import "./interfaces/ICircuitValidator.sol";
import "./verifiers/ZKPVerifier.sol";
import '@chainlink/contracts/src/v0.8/ChainlinkClient.sol';
contract LimeManager is ZKPVerifier,ChainlinkClient {
   using Chainlink for Chainlink.Request;
   using Counters for Counters.Counter;

   uint64 public constant MEMBER_REQUEST_ID = 1;
   uint64 public constant AGENT_REQUEST_ID = 2;
   uint8 public constant PROCESSING=0;
   uint8 public constant APPROVED=1;
   uint8 public constant DENIED=2;
   uint256 public stakedTotal;
   uint256 public payoutRate = 1;
   
   mapping (address => bool) public members;
   mapping (address =>bool ) public agents;
   mapping (address => uint) public stakePool;
   mapping (bytes32 => Policy) policyToValidate;
   mapping (string =>Policy) policies;
   mapping (string => Claim) claims;
   mapping (address => AgentStake) agentStakes;
   
   uint256 requiredStake  = 0;
   bytes32 private jobId;
   string url;
   Counters.Counter private claimsCounter;
   
   struct AgentStake{
      uint256 dateStaked;
	  uint256 amount;
	  bool isValue;
   }

   struct Policy{
      address owner;
	  string policy_id;
      string name;
      string breed;
      uint256 age;
      string zip;
      uint256 coverage;
      uint256 premium;
      string petType;
	  uint256 dateCreated;
	  uint256 paid;
	  uint256 lastPaid;
	 bool isValue;
   }
   
   
   struct Claim {
     string policy_id;
	 string description;
	 uint256 amountPaid;
	 uint256 dateSubmitted;
	 uint256 state;  //0 Processing  1 Approved 2 Denied
	 bool isValue;
   }

   event RequestCreatePolicy(bytes32 indexed requestId,string policy_id,uint256 dateCreated); 
   event RequestCreatePolicyFailed(bytes32 indexed requestId,string policy_id,uint256 dateFailed);
   event PremiumPaid(address indexed owner,string policy_id,uint256 premium,uint256 datePaid);
   event ClaimMade(address  indexed owner,  string policy_id,string claim_id,string description,uint256 dateMade);
   event ClaimApproved(address indexed agent,string claim_id,uint256 dateApproved,uint256 amountPaid);
   event ClaimDenied(address indexed agent,string claim_id,uint256 dateDenied,string message);
   event AgentStaked(address indexed agent,uint256 amount, uint256 dateStaked);
   event AgentUnStaked(address indexed agent,uint256 amount, uint256 dateUnStaked);
   
   
   address  LIME_ADDRESS;
   address USDC_ADDRESS = address(0xF6B5008f59e52143F3D21DfC774Ca2f8a40fE9f2); //My Test USDC
   IERC20 internal usdcToken; 
   IERC20 internal limeToken;
   address LimeNFT;
   bool public polygonIdEnabled=false;
   
constructor(string memory _url,address _limeToken,address _usdcAddress,address _limeNFT)  {
    setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
    setChainlinkOracle(0x40193c8518BB267228Fc409a613bDbD8eC5a97b3);
    jobId = 'c1c5e92880894eb6b27d3cae19670aa3';
    url = _url;
	
	if(_usdcAddress != address(0))
	  USDC_ADDRESS =  _usdcAddress;
	usdcToken = IERC20(USDC_ADDRESS);
    limeToken = IERC20(_limeToken);
	LIME_ADDRESS = _limeToken;
	LimeNFT  = _limeNFT;	
	
}

modifier isPolicy(string calldata policy_id) {
   require(policies[policy_id].isValue,"Not a valid Policy.");
   _;
}

modifier isPolicyHolder(string calldata policy_id) {
   require(policies[policy_id].isValue,"Not a valid Policy.");
   require(policies[policy_id].owner == msg.sender,"You are not the policy holder.");   
  _;
}



modifier isNotPolicyHolder(string  memory policy_id) {
   require(policies[policy_id].isValue,"Not a valid Policy.");
   require(policies[policy_id].owner != msg.sender,"You are the policy holder.");   
  _;
}


modifier isMember() {
    require((members[_msgSender()]== true &&  proofs[_msgSender()][MEMBER_REQUEST_ID] == true) || (members[_msgSender()]== true && polygonIdEnabled == false),"You are not a member.");
    _;
}

modifier isAgent() {
    require((agents[_msgSender()]== true &&  proofs[_msgSender()][AGENT_REQUEST_ID] == true) || (agents[_msgSender()]== true && polygonIdEnabled==false) ,"You are not an agent.");
    require(stakePool[_msgSender()] >= requiredStake, "You have not staked any Lime.");
    _;
}


modifier isClaim(string memory claim_id) {
  require(claims[claim_id].isValue== true,"Not a valid claim");
  _;
}


modifier isNotClaim(string memory claim_id) {
  require(claims[claim_id].isValue== false,"Claim already exist");
  _;
}


 /**
   * @dev Function to createPolicy
    * @param name -  Name of pet
	* @param breed - Breed of pet
	* @param age   - Age of pet
	* @param coverage - coverage amount 
	* @param premium  - Monthly premium
	* @param petType  - Pet Type 1 Dog 2 Cat
   
   **/

 function createPolicy(string calldata policy_id,
      string calldata name,
      string calldata breed,
      uint256 age,
     uint256 coverage,
      uint256 premium,
      string calldata petType)public isMember() {
     Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
	 string memory _url  = string.concat(url,"&name=",name,"&breed=",breed,"&age=",Strings.toString(age),"&coverage=",Strings.toString(coverage),"&premium=",Strings.toString(premium),"&petType=",petType);
  _url  = string.concat(_url,"&owner=",Strings.toHexString(uint256(uint160(msg.sender)), 20),"&policy_id=",policy_id);   
  req.add(
      'get',_url
    );
  req.add('path', 'result,validQuote');
 bytes32 rid =  sendChainlinkRequest(req, (1 * LINK_DIVISIBILITY) / 10); // 0,1*10**18 LINK
   policyToValidate[rid].owner = msg.sender;
   policyToValidate[rid].name = name;
   policyToValidate[rid].breed = breed;
   policyToValidate[rid].age = age;
   //policyToValidate[rid].zip = zip;
   policyToValidate[rid].coverage = coverage;
   policyToValidate[rid].premium = premium;
   policyToValidate[rid].petType = petType;   
   policyToValidate[rid].policy_id = policy_id;
 }  


 /**
   * @dev Function to fulfill chain link request to make sure its a valid policy
    * @param _requestId - Chainlink request id
	* @param validQuote - If quote submitted is valid
   
   **/

function fulfill(bytes32 _requestId, bool validQuote) public recordChainlinkFulfillment(_requestId) {
  if(validQuote)
  {
      policies[policyToValidate[_requestId].policy_id]=policyToValidate[_requestId];
	  policies[policyToValidate[_requestId].policy_id].dateCreated = block.timestamp;
	  policies[policyToValidate[_requestId].policy_id].isValue = true;
	  emit RequestCreatePolicy( _requestId,policyToValidate[_requestId].policy_id,block.timestamp);
	  
  }
  else
  {
     
     emit RequestCreatePolicyFailed(_requestId,policyToValidate[_requestId].policy_id,block.timestamp);
  }
}
//claim


 /**
   * @dev Function to claim damages
    *@param policy_id  - Policy to claim on
	*@param description of claim
   
   **/

 function claim(string calldata policy_id,string calldata id,string calldata description) public isPolicyHolder(policy_id) isNotClaim(id){
   
   claims[id].policy_id = policy_id;
   claims[id].description = description;
   claims[id].dateSubmitted  =  block.timestamp;
   claims[id].state = PROCESSING;
   claims[id].isValue = true;
   emit ClaimMade(msg.sender,policy_id,id,description,block.timestamp);


 }  


//payPremium

 /**
   * @dev Function to payPremium
    *@param  policy_id to pay
   
   **/

 function payPremium(string calldata policy_id) public isPolicyHolder(policy_id) {
   uint256 diff = (block.timestamp - policies[policy_id].lastPaid) / 60 / 60 / 24; //  days 
   require(policies[policy_id].lastPaid == 0 || diff == 30,"Payment not due.");
   uint256 senderBalanceRequired = policies[policy_id].premium*10**6;
   require(usdcToken.balanceOf(msg.sender) >= senderBalanceRequired, "Not enough balance");
   usdcToken.transferFrom(msg.sender,address(this), senderBalanceRequired);
   policies[policy_id].lastPaid = block.timestamp;
   policies[policy_id].paid += senderBalanceRequired;
   emit PremiumPaid(msg.sender,policy_id,senderBalanceRequired,block.timestamp);
 
 }  


 /**
   * @dev Function to validateClaim  -  Agents determine whether claims should be paid
    *@param claim_id  - Claim to approve or validate
	*@param amountPaid - amount to pay on claim
   
   **/

 function validateClaim(string calldata claim_id,uint256 amountPaid)public isClaim(claim_id) isAgent() isNotPolicyHolder(claims[claim_id].policy_id) {
   require(claims[claim_id].state == PROCESSING,"Claim already processed");
  
   require(usdcToken.balanceOf(address(this)) >= amountPaid*10**6, "Not enough balance");
   usdcToken.transfer(msg.sender, amountPaid*10**6);
   claims[claim_id].amountPaid = amountPaid*10**6;
   claims[claim_id].state = APPROVED;
   (bool _success, ) =  address(limeToken).call(abi.encodeWithSignature("mintLime(address,uint256)",msg.sender,payoutRate*10**18));
   require(_success,"Failed to Mint Rewards"); 
   
   emit ClaimApproved(msg.sender,claim_id,block.timestamp,amountPaid*10**6);

   
 }  

//denyClaim
/**
   * @dev Function to denyClaim
    *@param claim_id  - Claim to deny
    *@param message -  reason for denying the claim     
   **/

 function denyClaim(string calldata claim_id,string calldata message)public isClaim(claim_id) isAgent() isNotPolicyHolder(claims[claim_id].policy_id) {
   require(claims[claim_id].state == PROCESSING,"Claim already processed");
   claims[claim_id].state = DENIED;
   emit ClaimDenied(msg.sender,claim_id,block.timestamp,message);


 }



/**
   * @dev Function to allow agent to stake Lime
   *@param amount  - amount to stake
   *
   **/

 function agentStaking(uint256 amount)public isAgent() {
     require(amount > 0, "Stake amount must be more than zero.");
     require(limeToken.balanceOf(msg.sender) >=  amount*10**18,"Not enough lime tokens.");
	 stakedTotal += amount*10**18;
	 limeToken.transferFrom(msg.sender,address(this),amount*10**18);
	 agentStakes[msg.sender].isValue = true;
	 agentStakes[msg.sender].amount += amount*10**18;
	 agentStakes[msg.sender].dateStaked = block.timestamp;
	 emit AgentStaked(msg.sender, amount*10**18, block.timestamp);


 }

/**
   * @dev Function to allow agent to remove Lime stake
   *@param amount  - amount to unstake
   *
   **/

 function removeAgentStake(uint256 amount)public isAgent() {
     require(amount > 0, "Stake amount must be more than zero.");
     require(limeToken.balanceOf(address(this)) >=  amount*10**18,"Not enough lime tokens.");
     require(agentStakes[msg.sender].amount >=  amount*10**18,"Not enough lime tokens staked.");
		
	 stakedTotal -= amount*10**18;
	 limeToken.transfer(msg.sender,amount*10**18);
	 agentStakes[msg.sender].amount -= amount*10**18;
	 emit AgentUnStaked(msg.sender, amount*10**18, block.timestamp);
 }
 
 /**
   * @dev Function checks if agent
   *@param _address - Address to check
   *
   **/
   
 function agent(address _address) public view returns(bool) {
    if((agents[_address]== true &&  proofs[_address][AGENT_REQUEST_ID] == true) || (agents[_address]== true && polygonIdEnabled==false) )
	  return true;
	else
	return false;
 }
 
 
 
 /**
   * @dev Function checks if member
   *@param _address - Address to check
   *
   **/
   
 function member(address _address) public view returns(bool) {
    if((members[_address]== true &&  proofs[_address][MEMBER_REQUEST_ID] == true) || (members[_address]== true && polygonIdEnabled == false) )
	  return true;
	else
	return false;
 }
 
 /**
   * @dev Function to setPayoutRate to pay to agents for claims approved by agent
    * @param rate - Pay out rate
	* 
   
   **/
 
  function setPayoutRate(uint256 rate) public onlyOwner {
     require(rate > 0, "Rate should be greater than zero.");
	 payoutRate = rate;
  }

/**
   * @dev Function staked amount 
   *
   *
   **/
   
function staked() isAgent() public view returns (uint256) {
  return agentStakes[msg.sender].amount;
}

/**
   * @dev Function togglePolygonId  -  Disable or enable Polygon Id verification
    *@param enabled  - true or false
	
   
   **/
   
   function togglePolygonId(bool enabled) public onlyOwner{
   
      polygonIdEnabled = enabled;
   }
   
/**
   * @dev Function memberSignUp  -  Sign up as member only if Polygon Id is disabled
    *
   
   **/
   function memberSignUp() public {
      require(polygonIdEnabled == false ,"Polygon Id is enabled.");
	  require(members[msg.sender] ==false,"Already an agent.");
	  (bool _success, ) =  LimeNFT.call(abi.encodeWithSignature("mint(address,uint256)",msg.sender,2));
       require(_success,"Mint not successful.");
	  members[msg.sender] = true;

	  
   }
   
   
   /**
   * @dev Function agentsSignUp  -  Sign up as member only if Polygon Id is disabled
    *
   
   **/
   function agentsSignUp() public {
      require(polygonIdEnabled == false ,"Polygon Id is enabled.");
	  require(agents[msg.sender] ==false,"Already an agent.");
	  (bool _success, ) =  LimeNFT.call(abi.encodeWithSignature("mint(address,uint256)",msg.sender,1));
       require(_success,"Mint not successful.");
	  agents[msg.sender] = true;

	  
   }
   
 
 /**
   * @dev Function to setPayoutRate to pay to agents for claims approved by agent
    * @param _usdcAddress - Token Contract address for USDC 
	* 
   
   **/
 
 function setUSDC(address _usdcAddress) public onlyOwner {
    USDC_ADDRESS =  _usdcAddress;
	usdcToken = IERC20(USDC_ADDRESS);
 } 
   
 function _beforeProofSubmit(
        uint64, /* requestId */
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal view override {
        // check that the challenge input of the proof is equal to the msg.sender 
        address addr = GenesisUtils.int256ToAddress(
            inputs[validator.getChallengeInputIndex()]
        );
        require(
            _msgSender() == addr,
            "address in the proof is not a sender address"
        );
    }


    function _afterProofSubmit(
        uint64 requestId,
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal override {


        require( requestId == MEMBER_REQUEST_ID || requestId == AGENT_REQUEST_ID,"Invalid request ID.");
        
        if(requestId == MEMBER_REQUEST_ID)
        {
            require(
            requestId == MEMBER_REQUEST_ID && members[_msgSender()] == false,
            "proof can not be submitted more than once"
        );
            members[_msgSender()] = true;
		   (bool _success, ) =  LimeNFT.call(abi.encodeWithSignature("mint(address,uint256)",msg.sender,2));
            require(_success,"Mint not successful.");
        }


       if(requestId == AGENT_REQUEST_ID)
        {
            require(
            requestId == AGENT_REQUEST_ID && agents[_msgSender()] == false,
            "proof can not be submitted more than once"
        );
            agents[_msgSender()] = true;
			(bool _success, ) =  LimeNFT.call(abi.encodeWithSignature("mint(address,uint256)",msg.sender,1));
            require(_success,"Mint not successful.");
        }

    
    }
}