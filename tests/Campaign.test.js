const { Web3 } = require("web3");
const ganache = require("ganache");
const assert = require("assert");

const web3 = new Web3(ganache.provider());

const campaign = require("../ethereum/build/Campaign.json");
const factory = require("../ethereum/build/CampaignFactory.json");

let accounts;
let factoryInstance;
let campaignAddress;
let campaignInstance;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factoryInstance = await new web3.eth.Contract(factory.abi)
    .deploy({
      data: factory.evm.bytecode.object,
    })
    .send({
      from: accounts[0],
      gas: "2000000",
    });

  await factoryInstance.methods.deploy("100").send({
    from: accounts[0],
    gas: "2000000",
  });

  [campaignAddress] = await factoryInstance.methods.getDeployed().call();

  campaignInstance = await new web3.eth.Contract(campaign.abi, campaignAddress);
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factoryInstance.options.address);
    assert.ok(campaignInstance.options.address);
  });

  it("marks caller as manager", async () => {
    const manager = await campaignInstance.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows one to contribute", async () => {
    await campaignInstance.methods.contribute().send({
      from: accounts[1],
      value: "101",
    });

    const contri = await campaignInstance.methods
      .contributors(accounts[1])
      .call();

    assert(contri);
  });

  it("allows minimum contribution", async () => {
    try {
      await campaignInstance.methods.contribute().send({
        from: accounts[2],
        value: "99",
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("allows manager to make requests", async () => {
    await campaignInstance.methods
      .createRequest("Buy condoms", "10", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    const request = await campaignInstance.methods.requests(0).call();
    assert.equal(request.description, "Buy condoms");
  });

  it("processes requests", async () => {
    await campaignInstance.methods.contribute().send({
      from: accounts[1],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaignInstance.methods
      .createRequest("Buy condoms", web3.utils.toWei("5", "ether"), accounts[2])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    await campaignInstance.methods.approveRequest(0).send({
      from: accounts[1],
      gas: "1000000",
    });
    await campaignInstance.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });
    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    console.log(balance);
    assert(balance > 104);
  });
});
