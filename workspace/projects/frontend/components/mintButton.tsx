// components/MintButton.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { mintToken } from "@/lib/mint";

interface MintButtonProps {
  contractAddress: string;
  tokenId: string;
}

export function MintButton({ contractAddress, tokenId }: MintButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleMint = async () => {
    setLoading(true);
    try {
      await mintToken(contractAddress, tokenId);
      alert("Minting successful!");
    } catch (error) {
      alert("Minting failed. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleMint} disabled={loading}>
      {loading ? "Minting..." : "Mint Token"}
    </Button>
  );
}
