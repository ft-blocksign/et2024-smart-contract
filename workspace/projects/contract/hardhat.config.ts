import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ignition-ethers";
// import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";

import * as dotenv from "dotenv";
dotenv.config();

const ACCOUNT_SEACRET: string = process.env.PRIVATE_KEY || "";
// const MUMBAI_URL = process.env.MUMBAI_URL || "";
const SEPOLIA_URL = process.env.SEPOLIA_URL || "";
const ETHERSCAN_API = process.env.ETHERSCAN_API || "";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  gasReporter: {
    enabled: true,
    currency: 'USD', 
  },

  defaultNetwork: "hardhat",
  networks: {
		hardhat: {
			blockGasLimit: 10000000,
		},
    	sepolia: {
			url: `https://eth-sepolia.g.alchemy.com/v2/${SEPOLIA_URL}`,
			accounts: [`0x${ACCOUNT_SEACRET}`],
		},
		scrollSepolia: {
			url: "https://sepolia-rpc.scroll.io/" || "",
			accounts: [`0x${ACCOUNT_SEACRET}`],
		},
		// mumbai: {
		// 	url: `https://polygon-mumbai.g.alchemy.com/v2/${MUMBAI_URL}`,
		// 	accounts: [`0x${ACCOUNT_SEACRET}`],
		// },
	},
	etherscan: {
		// Your API key for Etherscan
		// Obtain one at https://etherscan.io/
		apiKey: ETHERSCAN_API
	},
	sourcify: {
		enabled: false,
	},
};

export default config;
