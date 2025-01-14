/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/FF0o2W0gAew
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export function Compnent2() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [subdomainInput, setSubdomainInput] = useState("")
  const [subdomainAvailable, setSubdomainAvailable] = useState(false)
  const [contractTitle, setContractTitle] = useState("")
  const [contractDescription, setContractDescription] = useState("")
  const [contractFile, setContractFile] = useState(null)
  const [contracts, setContracts] = useState([])
  const [activeContract, setActiveContract] = useState(null)

  const handleConnectWallet = async () => {
    await connectWallet();
    setWalletConnected(true);
  };


  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
      setWalletConnected(true)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }
  const validateSubdomain = async () => {
    try {
      const subdomain = subdomainInput.trim()
      if (
        subdomain.length < 3 ||
        subdomain.length > 63 ||
        subdomain.startsWith("-") ||
        subdomain.endsWith("-") ||
        !/^[a-z0-9-]+$/.test(subdomain)
      ) {
        setSubdomainAvailable(false)
        return
      }
      const isAvailable = await checkSubdomainAvailability(subdomain)
      setSubdomainAvailable(isAvailable)
    } catch (error) {
      console.error("Error validating subdomain:", error)
      setSubdomainAvailable(false)
    }
  }
  const createContract = async () => {
    try {
      const newContract = {
        title: contractTitle,
        description: contractDescription,
        file: contractFile,
        signed: false,
        tokenId: await mintToken(),
        approvedAddresses: [],
        expirationDate: null,
      }
      setContracts([...contracts, newContract])
      setContractTitle("")
      setContractDescription("")
      setContractFile(null)
    } catch (error) {
      console.error("Error creating contract:", error)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex justify-between items-center">
        <div className="text-2xl font-bold">DApp Contract</div>
        <Button
          variant="outline"
          onClick={handleConnectWallet}
          className={walletConnected ? "bg-secondary text-secondary-foreground" : ""}
        >
          {walletConnected ? "Connected" : "Connect Wallet"}
        </Button>
      </header>
      <div className="flex-1 grid grid-cols-[200px_1fr] gap-4 p-6">
        <nav className="bg-muted rounded-lg p-4 space-y-2 flex flex-col items-center">
          <Link href="#" className="block text-muted-foreground hover:text-foreground" prefetch={false}>
            Create Contract
          </Link>
          <Link href="#" className="block text-muted-foreground hover:text-foreground" prefetch={false}>
            View Contracts
          </Link>
          <Link href="/s2c" className="block text-muted-foreground hover:text-foreground">
            Sign to Contract
          </Link>
        </nav>
        <main>
          <div className="bg-background rounded-lg shadow p-6 space-y-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold">Create Contract</h2>
            <form onSubmit={createContract} className="space-y-4 w-full max-w-md">
              <div>
                <Label htmlFor="title">Contract Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={contractTitle}
                  onChange={(e) => setContractTitle(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subdomain">Subdomain</Label>
                  <Input
                    id="subdomain"
                    type="text"
                    value={subdomainInput}
                    onChange={(e) => setSubdomainInput(e.target.value)}
                    placeholder="Enter subdomain"
                    className="w-full"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={validateSubdomain} className="w-full">
                    {subdomainAvailable ? "Available" : "Check Availability"}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Contract Description</Label>
                <Textarea
                  id="description"
                  value={contractDescription}
                  onChange={(e) => setContractDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="file">Contract File</Label>
                <Input type="file" onChange={(e) => setContractFile(e.target.files[0])} />
              </div>
              <Button type="submit" className="w-full">
                Create Contract
              </Button>
            </form>
          </div>
          <div className="bg-background rounded-lg shadow p-6 space-y-4 mt-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold">Contracts</h2>
            {contracts.length === 0 ? (
              <p>No contracts yet. Create a new contract to get started.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {contracts.map((contract, index) => (
                  <Card key={index} className="relative">
                    <CardHeader>
                      <CardTitle>{contract.title}</CardTitle>
                      <CardDescription>{contract.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <Button variant="outline" onClick={() => signContract(contract)} disabled={contract.signed}>
                          {contract.signed ? "Signed" : "Sign"}
                        </Button>
                        {contract.signed && (
                          <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
                            Signed
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => updateENSRecord(subdomainInput, contract.tokenId)}
                        disabled={!subdomainAvailable}
                      >
                        Set ENS Record
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
