import { ethers } from "hardhat";

async function main() {
	const name: string = "SAMPLE";

	const TF = await ethers.getContractFactory("Forwarder");
	const tf = await TF.deploy(name);
	await tf.waitForDeployment();
	console.log("Forwarder deployed to:", await tf.getAddress());

	const SSC = await ethers.getContractFactory("SSC");
	const ssc = await SSC.deploy(await tf.getAddress());
	await ssc.waitForDeployment();
	console.log("SimpleSignContract deployed to:", await ssc.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});