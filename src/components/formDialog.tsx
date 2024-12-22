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
import { useState } from "react";
import web3 from "../../ethereum/web3";
import factoryInstance from "../../ethereum/factory";
import { DialogTitle } from "@radix-ui/react-dialog";



export default function FormDialog() {
  const [minimumETH, setMinimumETH] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const handleClick = async () => {
    try {
      setLoading(true);
      setError(null);
      const accounts = await web3?.eth.getAccounts();
      await factoryInstance?.methods
        .deploy(minimumETH, name)
        .send({
          from: accounts![0],
        });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setMinimumETH("");
      window.location.reload();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-3 items-center shadow-sm bg-[#212121] hover:bg-gray-800 text-gray-300">
          <Plus size={24} />
          <p>New Campaign</p>
        </Button>
      </DialogTrigger>
      <DialogHeader>
        <DialogTitle></DialogTitle>
      </DialogHeader>
      <DialogContent className="sm:max-w-md font-[family-name:var(--font-geist-mono)]">
        <p className="text-sm text-gray-400 -mb-2">Name</p>
        <div className="flex items-center space-x-2">
          <Input
            className="rounded-xl h-12 border-2 outline-none ring-0 focus:ring-0 focus-visible:ring-0"
            id="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <p className="text-sm text-gray-400 -mb-2">Minimum Contribution</p>
        <div className="flex items-center space-x-2">
          <div className="flex flex-1">
            <div className="bg-[#212121] flex items-center justify-center rounded-l-lg text-gray-400 text-sm w-12 h-12">
              Wei
            </div>
            <Input
              className="rounded-l-none h-12 rounded-r-xl border-2 outline-none ring-0 focus:ring-0 focus-visible:ring-0"
              id="ETH"
              onChange={(e) => setMinimumETH(e.target.value)}
              value={minimumETH}
            />
          </div>
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
