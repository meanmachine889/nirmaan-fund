const solc = require('solc');
const fs = require('fs-extra');
const path = require('path');


const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

const input = {
    language: "Solidity",
    sources: {
        'Campaign.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode']
            }
        }
    }
};


const output = JSON.parse(solc.compile(JSON.stringify(input)));

fs.ensureDir(buildPath);

for (const contractName in output.contracts['Campaign.sol']) {
    const contract = output.contracts['Campaign.sol'][contractName];
    fs.outputJSONSync(
        path.resolve(buildPath, `${contractName}.json`),
        contract
    );
}

console.log("Contracts successfully compiled and written to the build folder.");