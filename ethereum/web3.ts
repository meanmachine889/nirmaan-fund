"use client";

import Web3 from "web3";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

let web3: Web3 | null = null;

if (typeof window !== "undefined" && window.ethereum) {
  web3 = new Web3(window.ethereum);
} else {
  const provider = new Web3.providers.HttpProvider(
    "https://sepolia.infura.io/v3/e65a06ed75dc4f2992895f07c0efba5f"
  );
  web3 = new Web3(provider);
}


export async function connectWallet(): Promise<string | null> {
  if (typeof window === "undefined" || !window.ethereum) {
    alert("MetaMask or a compatible wallet is not installed!");
    return null;
  }

  try {
    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[] | undefined;
    if (accounts && accounts.length > 0) {
      console.log("Connected account:", accounts[0]);
      return accounts[0];
    } else {
      console.warn("No accounts found.");
      return null;
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}

export async function getCurrentAccount(): Promise<string | null> {
  if (typeof window === "undefined" || !window.ethereum) {
    console.warn("No wallet detected.");
    return null;
  }

  try {
    const accounts = (await window.ethereum.request({
      method: "eth_accounts",
    })) as string[] | undefined;
    if (accounts && accounts.length > 0) {
      return accounts[0];
    } else {
      console.warn("No accounts connected.");
      return null;
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}


export default web3;
