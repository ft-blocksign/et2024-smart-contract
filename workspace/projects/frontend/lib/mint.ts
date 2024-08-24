'use server'

import ABI from "@/abi/SimpleSignContract.json"

// lib/mint.ts
export const mintToken = async (contractAddress: string, tokenId: string) => {
	if (typeof window !== "undefined" && window.ethereum) {
	  const provider = new ethers.providers.Web3Provider(window.ethereum);
	  const signer = provider.getSigner();
  
	  try {
		// コントラクトの ABI とインスタンスを作成
		const contractABI = ABI;
		const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
		// トランザクションのデータを作成
		const tx = await contract.mint(tokenId); // mint 関数の名前と引数はコントラクトの仕様に合わせて変更してください
  
		// トランザクションがブロックに含まれるまで待つ
		await tx.wait();
  
		console.log("Minting successful", tx);
		return tx;
	  } catch (error) {
		console.error("Error minting token:", error);
	  }
	} else {
	  console.error("Ethereum provider not found");
	}
  };
  