
type Request = {
  description: string;
  value: bigint;
  recipient: string;
  complete: boolean;
  approvalCount: bigint;
  approvals: Record<string, boolean>; // Addresses mapped to approval status
};

export interface CampaignContract {
  name(): Promise<string>;
  manager(): Promise<string>;
  contributors(address: string): Promise<boolean>;
  minContribution(): Promise<bigint>;
  requests(index: number): Promise<Request>;
  contributorCount(): Promise<bigint>;

  restricted(): Promise<void>;

  contribute(options: { value: bigint }): Promise<void>;

  createRequest(
    description: string,
    value: bigint,
    recipient: string
  ): Promise<void>;

  approveRequest(index: number): Promise<void>;

  finalizeRequest(index: number): Promise<void>;

  getSummary(): Promise<[
    string, // name
    string, // manager
    bigint, // balance
    bigint, // minContribution
    bigint, // requests.length
    bigint // contributorCount
  ]>;

  getRequestsCount(): Promise<bigint>;
}
