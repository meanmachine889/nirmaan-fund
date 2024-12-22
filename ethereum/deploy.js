// eslint-disable-next-line @typescript-eslint/no-require-imports
const HDWalletProvider = require("@truffle/hdwallet-provider");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const {Web3} = require("web3");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const compiledFactory = require("./build/CampaignFactory.json");


const provider = new HDWalletProvider(
  "actress math worth keen rate imitate asthma oak crystal image garage side",
  "https://sepolia.infura.io/v3/e65a06ed75dc4f2992895f07c0efba5f"
);
const web3 = new Web3(provider);

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    const balance = await web3.eth.getBalance(accounts[0]);
    console.log("Balance:", balance);

    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(compiledFactory.abi)
      .deploy({ data: compiledFactory.evm.bytecode.object })
      .send({ from: accounts[0], gas: "2500000" });

    console.log("Contract deployed to", result.options.address);
    provider.engine.stop();
  } catch (error) {
    console.error("Deployment failed:", error);
    provider.engine.stop();
  }
};
deploy();
