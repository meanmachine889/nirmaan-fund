"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import getCampaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import { ErrorDialog } from "./errorDialog";
import { Loader2 } from "lucide-react";

interface Request {
  description: string;
  value: bigint;
  recipient: string;
  complete: boolean;
  approvalCount: bigint;
}

export const RequestTable = ({
  requests,
  totalContributors,
  address,
}: {
  requests: Request[];
  totalContributors: number;
  address: string;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [campaign, setCampaign] = useState<any>();
  const [loadingIndex, setLoading] = useState<number>(-1);
  const [finalizeLoading, setFinalizeLoading] = useState<number>(-1);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const campaignInstance = getCampaign(address);
        setCampaign(campaignInstance);
      } catch (error) {
        console.error("Error fetching campaign:", error);
      }
    };

    fetchCampaign();
  }, [address]);

  const handleApprove = async (index: number) => {
    const accounts = await web3?.eth.getAccounts();
    try {
      setLoading(index);
      await campaign.methods.approveRequest(index).send({
        from: accounts![0],
      });
      setLoading(-1);
      window.location.reload();
    } catch (error) {
      setIsError(true);
      setErrorMessage((error as Error).message);
    } finally {
      setLoading(-1);
    }
  };

  const handleFinalize = async (index: number) => {
    const accounts = await web3?.eth.getAccounts();
    try {
      setFinalizeLoading(index);
      await campaign.methods.finalizeRequest(index).send({
        from: accounts![0],
      });
      setFinalizeLoading(-1);
      window.location.reload();
    } catch (error) {
      setIsError(true);
      setErrorMessage((error as Error).message);
    } finally {
      setFinalizeLoading(-1);
    }
  };
  return (
    <div className="rounded-lg overflow-auto bg-[#151515] border-2 border-[#2c2c2c]">
      <Table>
        <TableHeader className="bg-[#090909] border-[#2c2c2c] border-b-2">
          <TableRow>
            <TableHead className="text-gray-400 min-w-[120px]">
              Description
            </TableHead>
            <TableHead className="text-gray-400 min-w-[100px]">
              Value (Wei)
            </TableHead>
            <TableHead className="text-gray-400 min-w-[120px]">
              Recipient
            </TableHead>
            <TableHead className="text-gray-400 min-w-[80px]">
              Complete
            </TableHead>
            <TableHead className="text-gray-400 min-w-[120px]">
              Approval Count
            </TableHead>
            <TableHead className="text-gray-400 min-w-[100px]"></TableHead>
            <TableHead className="text-gray-400 min-w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(requests) && requests.length > 0 ? (
            requests.map((request, index) => (
              <TableRow key={index}>
                <TableCell className="text-gray-300 break-words">
                  {request.description}
                </TableCell>
                <TableCell className="text-gray-300 break-all">
                  {request.value.toString()}
                </TableCell>
                <TableCell className="text-gray-300 break-all">
                  {request.recipient}
                </TableCell>
                <TableCell className="text-gray-300">
                  {request.complete ? "Yes" : "No"}
                </TableCell>
                <TableCell className="text-gray-300">
                  {request.approvalCount.toString()}/{totalContributors}
                </TableCell>
                <TableCell className="text-gray-300">
                  <Button
                    className="bg-[#2b2b2b] text-green-500 w-full sm:w-auto"
                    disabled={request.complete}
                    onClick={() => handleApprove(index)}
                  >
                    {loadingIndex == index ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      "Approve"
                    )}
                  </Button>
                </TableCell>
                <TableCell className="text-gray-300">
                  <Button
                    className="bg-[#2b2b2b] text-red-500 w-full sm:w-auto"
                    onClick={() => handleFinalize(index)}
                    disabled={request.complete}
                  >
                    {request.complete ? (
                      <p className="text-red-300">Finalized</p>
                    ) : finalizeLoading == index ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      "Finalize"
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-gray-500" colSpan={7}>
                No requests
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ErrorDialog
        isOpen={isError}
        onClose={() => setIsError(false)}
        errorMessage={errorMessage}
      />
    </div>
  );
};
