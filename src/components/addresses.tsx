"use client";
import { useEffect, useState } from "react";
import factoryInstance from "../../ethereum/factory";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const Addresses = () => {
  const [campaigns, setCampaigns] = useState<void | [] | (unknown[] & [])>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [names, setNames] = useState<void | [] | (unknown[] & [])>([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const campaigns = await factoryInstance.methods.getDeployed().call();
        setCampaigns(campaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchNames = async () => {
      try {
        const names = await factoryInstance.methods.getDeployedNames().call();
        setNames(names);
      } catch (error) {
        console.error("Error fetching names:", error);
      }
    };

    fetchCampaigns();
    fetchNames();
  }, []);

  return (
    <div className="flex mb-[10rem] flex-col gap-4 sm:gap-6 md:gap-9 items-start justify-start min-h-full h-full w-full font-[family-name:var(--font-geist-mono)] p-4 sm:p-6 md:p-9">
      {isLoading ? (
        <div className="w-[100%] h-[100vh] flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
          {campaigns?.length ? (
            campaigns?.map((address: string, index: number) => (
              <Card
                key={address}
                className="bg-[#151515] border-2 border-[#212121] flex flex-col"
              >
                <CardHeader className="border-b-2 border-[#212121] p-4">
                  <CardTitle className="font-medium flex gap-2 items-end text-gray-300 text-sm sm:text-base">
                    <span className="text-xs text-gray-400">({index + 1})</span>
                    <span className="truncate">{names![index]}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-between items-start gap-3 p-4 flex-grow">
                  <CardDescription className="w-full">
                    <span className="truncate block">{address}</span>
                  </CardDescription>
                  <Link href={`/campaign/${address}`}>
                    <Button variant="outline">Visit</Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-300">No active campaigns</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Addresses;
