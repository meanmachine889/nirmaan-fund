import web3 from "./web3";
import campaignFactory from "./build/CampaignFactory.json";

const instance = new web3!.eth.Contract(
    campaignFactory.abi,
    process.env.NEXT_PUBLIC_ADDRESS
);

export default instance;