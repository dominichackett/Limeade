export const LimeManagerAddress = "0xaD3c1CEe1f1Ff1dE907B4A589e666E573CE87C1f";
export const LimeManagerABI = [
  'function agentStaking(uint256 amount)public',
  'function removeAgentStake(uint256 amount)public',
   'function member(address) public view returns (bool)',
   'function payPremium(string calldata policy_id) public',
   'function agent(address) public view returns (bool)',
   'function polygonIdEnabled() public view returns (bool)',
   'function agentsSignUp() public',
   'function memberSignUp() public',
   'function staked() public view returns (uint256)',
   ' function denyClaim(string calldata claim_id,string calldata message)',
   'function validateClaim(string calldata claim_id,uint256 amountPaid) public',
   'function  claim(string calldata policy_id,string calldata id,string calldata description) public',
  "function createPolicy(string calldata policy_id,string calldata name,string calldata breed,uint256 age,uint256 coverage,uint256 premium, string calldata petType)public ",
];