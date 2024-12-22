'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from "lucide-react"
import web3 from "../../ethereum/web3"

type formParams = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    campaign : any;
    setIsError : (isError : boolean) => void; 
    setErrorMessage : (errorMessage : string) => void;
}

export default function ContributionForm({campaign, setIsError, setErrorMessage} : formParams) {
  const [contribution, setcontribution] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
        const accounts = await web3?.eth.getAccounts();
        await campaign.methods.contribute().send({
            from: accounts![0],
            value: contribution,
        });
        window.location.reload();
    } catch (error) {
        setErrorMessage((error as Error).message);
        setIsError(true);
    } finally {
        setLoading(false);
        setcontribution("");
    }

  }

  return (
    <Card className="w-full max-w-md bg-[#151515] border-2 border-[#212121]">
      <CardHeader>
        <CardTitle className="text-gray-300">Contribute</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex">
              <div className="bg-[#212121] flex items-center justify-center rounded-l-lg text-gray-400 text-sm w-12 h-12">
                Wei
              </div>
              <Input
                id="ETH"
                value={contribution}
                onChange={(e) => setcontribution(e.target.value)}
                className="rounded-l-none h-12 rounded-r-xl border-2 flex-1"
              />
            </div>
          </div>
          <Button type="submit" className="flex items-center gap-1 bg-[#151515] border-2 border-[#2b2a2a] shadow-sm text-gray-300 hover:bg-gray-800">
            {loading ? <><Loader2 size={12} className="animate-spin"/></> : <div className="flex gap-1 items-center">Send <ArrowRight size={16} className="ml-2" /></div>}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

