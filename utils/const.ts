import contract from "../NFT1155.json";

export const CONTRACT_ABI = contract.abi;
export const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || contract.address;
