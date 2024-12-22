"use client";

import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import web3 from "../../ethereum/web3";
import { DialogTitle } from "@radix-ui/react-dialog";
import getCampaign from "../../ethereum/campaign";
import { pageProps } from "@/app/campaign/[address]/page";
import React from "react";

export default function ReqFormDialog({ params }: pageProps) {
  const resolvedParams = React.use(params);
  const [description, setDescription] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const handleClick = async () => {
    try {
      setError(null);
      setLoading(true);
      const accounts = await web3?.eth.getAccounts();
      const campaignInstance = getCampaign(resolvedParams.address);
      await campaignInstance.methods
        .createRequest(
          description,
          web3?.utils.toWei(value, "ether"),
          recipient
        )
        .send({ from: accounts![0] });
      window.location.reload();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
      setDescription("");
      setValue("");
      setRecipient("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-3 items-center shadow-sm bg-[#212121] hover:bg-gray-800 text-gray-300">
          <Plus size={24} />
          <p>New Request</p>
        </Button>
      </DialogTrigger>
      <DialogHeader>
        <DialogTitle></DialogTitle>
      </DialogHeader>
      <DialogContent className="sm:max-w-md md:mx-0 font-[family-name:var(--font-geist-mono)]">
        <p className="text-sm text-gray-400 -mb-2">Description</p>
        <div className="flex items-center space-x-2">
          <Input
            className="rounded-xl h-12 border-2 outline-none ring-0 focus:ring-0 focus-visible:ring-0"
            id="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>
        <p className="text-sm text-gray-400 -mb-2">Value (ETH)</p>
        <div className="flex items-center space-x-2">
          <div className="flex flex-1">
            <div className="bg-[#212121] flex items-center justify-center rounded-l-lg text-gray-300 text-sm w-12 h-12">
              <Image
                src="https://res.cloudinary.com/dnfv0h10u/image/upload/v1734717485/ethereum_jentue.svg"
                width={15}
                height={15}
                alt=""
              />
            </div>
            <Input
              className="rounded-l-none h-12 rounded-r-xl border-2 outline-none ring-0 focus:ring-0 focus-visible:ring-0"
              id="ETH"
              onChange={(e) => setValue(e.target.value)}
              value={value}
            />
          </div>
        </div>
        <p className="text-sm text-gray-400 -mb-2">Recipient</p>
        <div className="flex items-center space-x-2">
          <Input
            className="rounded-xl h-12 border-2 outline-none ring-0 focus:ring-0 focus-visible:ring-0"
            id="recipient"
            onChange={(e) => setRecipient(e.target.value)}
            value={recipient}
          />
        </div>
        <div className="sm:justify-start flex flex-col gap-3 mt-5">
          <Button
            type="button"
            className="w-fit"
            variant="secondary"
            onClick={handleClick}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={10} className="animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
          {error && (
            <div className="bg-red-900/50 border border-red-400 text-red-300 rounded-xl flex items-start justify-start px-5 py-6 w-[100%]">
              <p>{error}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
