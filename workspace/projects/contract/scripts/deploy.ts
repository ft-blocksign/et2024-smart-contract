import { ethers } from "hardhat";

async function main() {
	const ensAddress: string = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
	const resolverAddress: string = "0x8FADE66B79cC9f707aB26799354482EB93a5B7dD";
	const name: string = "SAMPLE";

	const TF = await ethers.getContractFactory("Forwarder");
	const tf = await TF.deploy(name);
	await tf.waitForDeployment();
	console.log("Forwarder deployed to:", await tf.getAddress());

	const SSC = await ethers.getContractFactory("SimpleSignContract");
	const ssc = await SSC.deploy(ensAddress, resolverAddress, await tf.getAddress());
	await ssc.waitForDeployment();
	console.log("SimpleSignContract deployed to:", await ssc.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});