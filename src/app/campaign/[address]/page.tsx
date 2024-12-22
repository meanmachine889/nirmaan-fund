/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import getCampaign from "../../../../ethereum/campaign";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ContributionForm from "@/components/contributionForm";
import { Loader2 } from "lucide-react";
import { ErrorDialog } from "@/components/errorDialog";
import Requests from "@/components/requests";

export type pageProps = {
  params: Promise<{
    address: string;
  }>;
};

export default function Page({ params }: pageProps) {
  const resolvedParams = React.use(params);
  const [campaign, setCampaign] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const campaignInstance = getCampaign(resolvedParams.address);
        setCampaign(campaignInstance);
      } catch (error) {
        console.error("Error fetching campaign:", error);
      }
    };

    fetchCampaign();
  }, [resolvedParams.address]);

  const fetchCampaignSummary = async () => {
    if (!campaign) return;
    try {
      const summaryData = await campaign.methods.getSummary().call();
      setSummary(summaryData);
    } catch (error) {
      console.error("Error fetching campaign summary:", error);
    }
  };

  useEffect(() => {
    fetchCampaignSummary();
  }, [campaign]);

  return (
    <div className="container">
      {summary ? (
        <div className="flex flex-col lg:flex-row w-[100%] md:items-start items-center justify-between p-4 sm:p-6 md:p-9 gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 px-auto lg:grid-cols-3 gap-3 w-[100%] lg:w-2/3">
            <Card className="bg-[#151515] border-2 border-[#212121]">
              <CardHeader>
                <CardTitle className="font-medium text-sm sm:text-base flex gap-2 items-end text-gray-500">
                  Name
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col text-lg sm:text-xl text-gray-300 justify-around items-start gap-3 p-4">
                <CardDescription className="text-base sm:text-lg text-gray-300 truncate w-full">
                  {summary[0]}
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-[#151515] border-2 sm:col-span-2 border-[#212121]">
              <CardHeader>
                <CardTitle className="font-medium text-sm sm:text-base flex gap-2 items-end text-gray-500">
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col text-sm sm:text-base text-gray-300 justify-around items-start gap-3 p-4">
                <CardDescription className="text-sm sm:text-base text-gray-300 truncate w-full">
                  {resolvedParams.address}
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-[#151515] border-2 border-[#212121]">
              <CardHeader>
                <CardTitle className="font-medium text-sm sm:text-base flex gap-2 items-end text-gray-500">
                  Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col text-lg sm:text-xl text-gray-300 justify-around items-start gap-3 p-4">
                <CardDescription className="text-lg sm:text-xl flex items-end gap-3 text-gray-300">
                  <span className="truncate">{summary[2]}</span>
                  <span className="font-medium text-sm sm:text-base flex gap-2 items-end whitespace-nowrap">
                    Wei
                  </span>
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-[#151515] border-2 border-[#212121]">
              <CardHeader>
                <CardTitle className="font-medium text-sm sm:text-base flex gap-2 items-end text-gray-500">
                  Transaction Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col text-lg sm:text-xl text-gray-300 justify-around items-start gap-3 p-4">
                <CardDescription className="text-lg sm:text-xl text-gray-300 truncate w-full">
                  {summary[4]}
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-[#151515] border-2 border-[#212121]">
              <CardHeader>
                <CardTitle className="font-medium text-sm sm:text-base flex gap-2 items-end text-gray-500">
                  Minimum Contribution
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col text-lg sm:text-xl text-gray-300 justify-around items-start gap-3 p-4">
                <CardDescription className="text-lg sm:text-xl flex items-end gap-3 text-gray-300">
                  <span className="truncate">{summary[3]}</span>
                  <span className="font-medium text-sm sm:text-base flex gap-2 items-end whitespace-nowrap">
                    Wei
                  </span>
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-[#151515] border-2 sm:col-span-2 border-[#212121]">
              <CardHeader>
                <CardTitle className="font-medium text-sm sm:text-base flex gap-2 items-end text-gray-500">
                  Manager
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col text-sm sm:text-base text-gray-300 justify-around items-start gap-3 p-4">
                <CardDescription className="text-sm sm:text-base text-gray-300 truncate w-full">
                  {summary[1]}
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-[#151515] border-2 border-[#212121]">
              <CardHeader>
                <CardTitle className="font-medium text-sm sm:text-base flex gap-2 items-end text-gray-500">
                  Contributors
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col text-lg sm:text-xl text-gray-300 justify-around items-start gap-3 p-4">
                <CardDescription className="text-lg sm:text-xl text-gray-300 truncate w-full">
                  {summary[5]}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-1 w-full lg:w-1/3 items-start justify-center mt-6 lg:mt-0">
            <ContributionForm
              campaign={campaign}
              setIsError={setIsError}
              setErrorMessage={setErrorMessage}
            />
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen items-center justify-center p-9">
          <Loader2 size={24} className="animate-spin text-gray-500" />
        </div>
      )}
      <div className="w-[100%] max-w-screen flex items-center justify-center">
        <Requests params={params} />
      </div>
      <ErrorDialog
        isOpen={isError}
        onClose={() => setIsError(false)}
        errorMessage={errorMessage}
      />
    </div>
  );
}
