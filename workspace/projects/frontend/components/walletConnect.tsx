'use client'
// lib/walletConnect.ts
export const connectWallet = async (): Promise<void> => {
	if (typeof window !== "undefined" && window.ethereum) {
	  try {
		await window.ethereum.request({ method: "eth_requestAccounts" });
	  } catch (error) {
		console.error("Error connecting wallet:", error);
	  }
	} else {
	  console.error("Ethereum provider not found");
	}
};
  