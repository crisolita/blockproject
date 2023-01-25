import { ethers } from "ethers";
// import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../utils/const";
// const provider = new ethers.providers.JsonRpcProvider(
//   process.env.PROVIDER as string
// );
// const signer = provider.getSigner(process.env.SIGNER as string);
// const wallet = new ethers.Wallet(process.env.PRIVATEKEY as string, provider);
// const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
// const contractWithSigner = contract.connect(wallet);

// // contractWithSigner.functions.mint('0xe21b595Ce68F8b0949B759c9401D227C80AFE3d0', 1)
// // const dai = ethers.utils.parseUnits("1.0", 18);
// // tx = daiWithSigner.transfer("ricmoo.firefly.eth", dai);
// // console.log("🚀 ~ file: web3.ts ~ line 10 ~ contract", contract)

// export default contractWithSigner;
export async function createWallet(password: string) {
  try {
    const wallet = ethers.Wallet.createRandom(password);
    return wallet;
  } catch (e) {
    console.log(e);
  }
}
export async function manageKeys(password: string) {
  try {
  } catch (e) {
    console.log(e);
  }
}
