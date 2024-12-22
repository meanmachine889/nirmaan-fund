/* eslint-disable @typescript-eslint/no-explicit-any */
import { pageProps } from "@/app/campaign/[address]/page";
import ReqFormDialog from "./requestFormDialog";
import React, { useEffect, useState } from "react";
import getCampaign from "../../ethereum/campaign";
import { RequestTable } from "./requestTable";

export default function Requests({ params }: pageProps) {
  const resolvedParams = React.use(params);
  const [campaign, setCampaign] = useState<any>(null);
  const [requestCount, setRequestCount] = useState<number>(0);
  const [requests, setRequests] = useState<any[]>([]);
  const [totalContributors, setTotalContributors] = useState(0);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const campaignInstance = getCampaign(resolvedParams.address);
        setCampaign(campaignInstance);
        const count = await campaignInstance.methods.getRequestsCount().call();
        setRequestCount(Number(count));
        const count1 = await campaignInstance.methods.contributorCount().call();
        setTotalContributors(count1 ? Number(count1) : 0);
      } catch (error) {
        console.error("Error fetching campaign:", error);
      }
    };

    fetchCampaign();
  }, [resolvedParams.address]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!campaign) return;
      const requests = await Promise.all(
        Array(requestCount)
          .fill(null)
          .map((_, index) => campaign.methods.requests(index).call())
      );
      setRequests(requests);
      console.log(requests);
    };

    fetchRequests();
  }, [campaign, requestCount]);

  return (
    <div className="flex w-full flex-col gap-4 sm:gap-7 items-start justify-start p-4 sm:p-6 md:p-9 mb-20 sm:mb-24 md:mb-[10rem]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center w-full justify-between sm:justify-start gap-4 sm:gap-9">
        <p className="text-lg sm:text-xl">
          Transaction Requests{" "}
          <span className="text-gray-400">({requests?.length})</span>
        </p>
        <ReqFormDialog params={params} />
      </div>
      <div className="w-full overflow-x-auto">
        <RequestTable
          requests={requests}
          totalContributors={totalContributors}
          address={resolvedParams.address}
        />
      </div>
    </div>
  );
}
