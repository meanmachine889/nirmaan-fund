"use client";

import { useEffect, useState } from "react";
import { connectWallet, getCurrentAccount } from "../../ethereum/web3";
import Avatar from "boring-avatars";
import { Button } from "./ui/button";
import Image from "next/image";
import { Copy, LayoutGrid } from 'lucide-react';
import FormDialog from "./formDialog";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WalletButton = ({ account, handleConnect } : {account: any, handleConnect: any}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        {account ? (
          <div className="flex items-center justify-between gap-3 border border-[#2b2a2a] bg-[#0f0f0f] rounded-xl py-1 p-2">
            <Avatar name={account} variant="marble" size={24} />
            <p className="hidden sm:block text-gray-400 text-sm">{`${account?.slice(0, 7)}...${account?.slice(-2)}`}</p>
            <Button
              variant={"ghost"}
              className="hidden sm:flex group hover:bg-black items-center gap-3 p-0"
              onClick={() => navigator.clipboard.writeText(account)}
            >
              <Copy className="text-gray-400 group-hover:text-gray-300" size={16} />
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleConnect}
            className="flex items-center gap-3 bg-[#151515] border-2 border-[#2b2a2a] shadow-sm text-gray-300 hover:bg-gray-800"
          >
            <Image
              src="https://res.cloudinary.com/dnfv0h10u/image/upload/v1734696572/mm_wled2p.svg"
              width={24}
              height={24}
              alt=""
            />
            <span className="hidden sm:inline">Connect Wallet</span>
          </Button>
        )}
      </TooltipTrigger>
      <TooltipContent side="top" className="sm:hidden">
        {account ? `${account?.slice(0, 7)}...${account?.slice(-2)}` : "Connect Wallet"}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default function Navbar() {
  const [account, setAccount] = useState<string | null>(null);

  const handleConnect = async () => {
    const connectedAccount = await connectWallet();
    setAccount(connectedAccount);
  };

  useEffect(() => {
    const fetchAccount = async () => {
      const currentAccount = await getCurrentAccount();
      setAccount(currentAccount);
    };

    fetchAccount();
  }, []);

  return (
    <div className="fixed z-40 md:bottom-[4vw] bottom-[20vw] sm:bottom-10 w-full px-4 flex justify-center items-center font-[family-name:var(--font-poppins)]">
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[60%] xl:w-[45%] z-40 h-[60px] sm:h-[80px] bg-[#060606] p-2 sm:p-4 items-center rounded-xl border-2 border-[#212121] shadow-sm flex justify-between">
        <WalletButton account={account} handleConnect={handleConnect} />
        <div className="flex gap-2 sm:gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <FormDialog/>
              </TooltipTrigger>
              <TooltipContent side="top" className="sm:hidden">
                New Construction Project
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/">
                  <Button className="p-2 sm:p-3 shadow-sm bg-[#212121] text-gray-300 hover:bg-gray-800">
                    <LayoutGrid className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="hidden sm:inline ml-2">Projects</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="sm:hidden">
                Projects
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

