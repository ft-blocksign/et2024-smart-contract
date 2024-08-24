import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("SimpleSignContract", function () {
  async function deploySSCFixture() {
    const [owner, userA, userB, userC] = await hre.ethers.getSigners();
    const others: any[] = [userA, userB, userC];

    const TF = await hre.ethers.getContractFactory("Forwarder");
    const tf = await TF.deploy("SAMPLE")
    await tf.waitForDeployment();
    const SSC = await hre.ethers.getContractFactory("SimpleSignContract");
    const ssc = await SSC.deploy(
      "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e", // ENSアドレス (例: Registry)
      "0x8FADE66B79cC9f707aB26799354482EB93a5B7dD", // Resolverアドレス
      await tf.getAddress()
    );

    await ssc.waitForDeployment();
    
    return { ssc, tf, owner, others };
  }

  describe("Deployment", function () {
    it("Should be deployed", async function () {
      const { ssc, owner } = await loadFixture(deploySSCFixture);

      expect(await ssc.currentOwner()).to.equal(owner.address);
    });

    it("Check NAME & SYMBOL", async function () {
      const { ssc, owner } = await loadFixture(deploySSCFixture);

      expect(await ssc.name()).to.equal("SSC_NAME");
      expect(await ssc.symbol()).to.equal("SSC_SYMBOL");
    });
  });

  describe("Manage NFT", function () {
    it("Should MINT", async function () {
      const { ssc, tf, owner, others } = await loadFixture(deploySSCFixture);

      const issuer = owner.address;
      const authorizedAddresses = [others[0].address, others[1].address];
      const encryptedData = "QmW2WQi7j6c7Ug1MdQjnk2l3pQEmw5xENFi4yD7xQsRBXh";  // Sample IPFS hash or any other encrypted data
      const expirationTime = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;  // 1 year from now
      // const subdomain = "this-is-subdomain";
    
      const tx = await ssc.mint(issuer, authorizedAddresses, encryptedData, expirationTime);
      const receipt = await tx.wait();
      console.log(receipt);

      // ドキュメントへの参加確認 //
      const tokenId = await ssc.connect(owner).getIssuerContracts();
      expect(await ssc.isAuthorized(tokenId[0] , others[0].address)).eq(true);
      expect(await ssc.isAuthorized(tokenId[0] , others[1].address)).eq(true);
      expect(await ssc.isAuthorized(tokenId[0] , others[2].address)).eq(false);
  
      // 署名: 状態確認 > 署名 > 状態確認  //
      expect(await ssc.isSignd(tokenId[0] , others[0].address)).not.eq(true);
      expect(await ssc.isSignd(tokenId[0] , others[1].address)).not.eq(true);
      await ssc.connect(others[0]).sign2Contract(tokenId[0]);
      await ssc.connect(others[1]).sign2Contract(tokenId[0]);
      expect(await ssc.isSignd(tokenId[0] , others[0].address)).eq(true);
      expect(await ssc.isSignd(tokenId[0] , others[1].address)).eq(true);
    });
  });
});
