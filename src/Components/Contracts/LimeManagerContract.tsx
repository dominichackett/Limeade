export const LimeManagerAddress = "0xD4872828bB0Aef8E109D1561a8a2F2399d59926f";
export const LimeManagerABI = [
   'function member(address) public view returns (bool)',
   'function agent(address) public view returns (bool)',
   'function polygonIdEnabled() public view returns (bool)',
   'function agentsSignUp() public',
   'function memberSignUp() public',
   'function staked() public view returns (uint256)',
  "function createPolicy(string calldata policy_id,string calldata name,string calldata breed,uint256 age,uint256 coverage,uint256 premium, string calldata petType)public ",
];