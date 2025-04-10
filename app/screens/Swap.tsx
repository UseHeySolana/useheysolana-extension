"use client";

import { useState, useEffect } from "react";
import { ChevronDownIcon, ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import {
  Connection,
  Keypair,
  VersionedTransaction,
  PublicKey,
} from "@solana/web3.js";
import fetch from "cross-fetch";
import bs58 from "bs58";

// Define token type
interface Token {
  symbol: string;
  name: string;
  mint: string; // Token mint address
  logo: string; // URL to logo
  balance: number;
  usdValue: number; // USD value per token (mocked for now)
  decimals: number; // Number of decimals for the token
}

// Mock wallet with provided keys
const mockWallet = {
  publicKey: new PublicKey("C9wZxi7fCdT5zCUKrE9Gc7PsirwFS9QGEZpaAH6aybty"),
  signTransaction: async (transaction: VersionedTransaction) => {
    const privateKey = bs58.decode(
      "3FvkGBz41FJAeeNtYgJkXC9BX7pUXvzF8Nff1wGYk9bgNQNTzAChbs2MfCJG7WPTec1zNhSCxigfqMop4RV8zXid"
    );
    const keypair = Keypair.fromSecretKey(privateKey);
    transaction.sign([keypair]);
    return transaction;
  },
};

export default function SwapTokens() {
  // Solana connection
  const connection = new Connection(
    "https://api.mainnet-beta.solana.com",
    "confirmed"
  );

  // State for tokens, amounts, and selection
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState<number>(0);
  const [toAmount, setToAmount] = useState<number>(0);
  const [networkFee, setNetworkFee] = useState<number>(0.00432); // Mock network fee in SOL
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch token list from Jupiter Token List API
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch("https://token.jup.ag/strict");
        const tokenList = await response.json();

        // Map the API response to our Token interface
        const mappedTokens: Token[] = tokenList.map((token: any) => ({
          symbol: token.symbol,
          name: token.name,
          mint: token.address,
          logo: token.logoURI || "/placeholder.png",
          balance: 0,
          usdValue: 1,

          decimals: token.decimals,
        }));

        // Set tokens and default selections
        setTokens(mappedTokens);

        // Set default tokens (e.g., SOL and USDC)
        const solToken = mappedTokens.find(
          (token) =>
            token.mint === "So11111111111111111111111111111111111111112"
        );
        const usdcToken = mappedTokens.find(
          (token) =>
            token.mint === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        );

        setFromToken(solToken || mappedTokens[0]);
        setToToken(usdcToken || mappedTokens[1]);
      } catch (error) {
        console.error("Error fetching token list:", error);
        alert("Failed to fetch token list. Please try again later.");
      }
    };

    fetchTokens();
  }, []);

  // Fetch quote when fromAmount, fromToken, or toToken changes
  useEffect(() => {
    const fetchQuote = async () => {
      if (!fromToken || !toToken || fromAmount <= 0) {
        setToAmount(0);
        return;
      }

      setLoading(true);
      try {
        // Convert amount to smallest unit based on token decimals
        const amountInSmallestUnit = Math.round(
          fromAmount * Math.pow(10, fromToken.decimals)
        );

        // Fetch quote from Jupiter API
        const quoteResponse = await (
          await fetch(
            `https://quote-api.jup.ag/v6/quote?inputMint=${fromToken.mint}&outputMint=${toToken.mint}&amount=${amountInSmallestUnit}&slippageBps=50`
          )
        ).json();

        // Calculate toAmount based on token decimals
        const outAmount =
          parseInt(quoteResponse.outAmount) / Math.pow(10, toToken.decimals);
        setToAmount(outAmount);
      } catch (error) {
        console.error("Error fetching quote:", error);
        setToAmount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [fromAmount, fromToken, toToken]);

  // Handle amount input
  const handleFromAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    setFromAmount(amount);
  };

  // Set max amount
  const handleMax = () => {
    const balance = fromToken?.balance || 0;
    setFromAmount(balance);
  };

  // Swap tokens (switch from and to)
  const handleSwapTokens = () => {
    if (fromToken && toToken) {
      setFromToken(toToken);
      setToToken(fromToken);
      setFromAmount(toAmount);
      setToAmount(fromAmount);
    }
  };

  // Perform the swap using Jupiter API
  const handleSwap = async () => {
    if (!fromToken || !toToken || fromAmount <= 0) {
      alert("Please enter a valid amount to swap.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Get quote
      const amountInSmallestUnit = Math.round(
        fromAmount * Math.pow(10, fromToken.decimals)
      );
      const quoteResponse = await (
        await fetch(
          `https://quote-api.jup.ag/v6/quote?inputMint=${fromToken.mint}&outputMint=${toToken.mint}&amount=${amountInSmallestUnit}&slippageBps=50`
        )
      ).json();

      // Step 2: Get serialized transaction
      const { swapTransaction } = await (
        await fetch("https://quote-api.jup.ag/v6/swap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quoteResponse,
            userPublicKey: mockWallet.publicKey.toString(),
            wrapAndUnwrapSol: true,
            dynamicComputeUnitLimit: true,
            prioritizationFeeLamports: {
              priorityLevelWithMaxLamports: {
                maxLamports: 10000000,
                priorityLevel: "veryHigh",
              },
            },
            dynamicSlippage: { maxBps: 300 },
          }),
        })
      ).json();

      // Step 3: Deserialize and sign the transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      let transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      // Sign the transaction with the wallet
      transaction = await mockWallet.signTransaction(transaction);

      // Step 4: Execute the transaction
      const latestBlockHash = await connection.getLatestBlockhash();
      const rawTransaction = transaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid,
      });

      alert(`Swap successful! Transaction: https://solscan.io/tx/${txid}`);
    } catch (error) {
      console.error("Error performing swap:", error);
      alert("Swap failed. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 w-full max-w-md">
        <button className="p-2 rounded-full bg-white shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-black">Swap Tokens</h1>
      </div>

      {/* Swap Card */}
      <div className="rounded-xl p-4 w-full max-w-md">
        {/* From Token */}
        <div className="bg-white shadow-sm rounded-[20px] p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                className="text-[50px] text-black font-bold bg-transparent outline-none w-32"
                placeholder="0.000"
              />
              <p className="text-sm text-gray-500">
                $
                {fromToken
                  ? (fromAmount * fromToken.usdValue).toFixed(2)
                  : "0.00"}
              </p>
            </div>
            <div className="flex items-center bg-gray-200 p-2 rounded-full">
              {fromToken && (
                <>
                  <img
                    src={fromToken.logo}
                    alt={fromToken.name}
                    className="w-[25px] h-[25px] rounded-full"
                  />
                  <select
                    value={fromToken.mint}
                    onChange={(e) => {
                      const selectedToken = tokens.find(
                        (token) => token.mint === e.target.value
                      );
                      if (selectedToken) setFromToken(selectedToken);
                    }}
                    className="bg-transparent text-black font-xl w-[100px] text-center focus:outline-none"
                  >
                    {tokens.map((token) => (
                      <option key={token.mint} value={token.mint}>
                        {token.name} ({token.symbol})
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-sm text-gray-500">
              Available balance: {fromToken?.balance || 0} {fromToken?.symbol}
            </p>
            <button
              onClick={handleMax}
              className="px-3 py-1 bg-gray-200 rounded-full text-sm font-semibold"
            >
              max
            </button>
          </div>
        </div>

        {/* Swap Icon */}
        <div className="flex justify-center -my-2">
          <button
            onClick={handleSwapTokens}
            className="p-2 bg-gray-200 rounded-full"
          >
            <ArrowsUpDownIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* To Token */}
        <div className="bg-gray-100 rounded-xl p-4 mt-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">{toAmount.toFixed(4)}</p>
              <p className="text-sm text-gray-500">
                ${toToken ? (toAmount * toToken.usdValue).toFixed(2) : "0.00"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {toToken && (
                <>
                  <img
                    src={toToken.logo}
                    alt={toToken.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <select
                    value={toToken.mint}
                    onChange={(e) => {
                      const selectedToken = tokens.find(
                        (token) => token.mint === e.target.value
                      );
                      if (selectedToken) setToToken(selectedToken);
                    }}
                    className="bg-transparent font-semibold"
                  >
                    {tokens.map((token) => (
                      <option key={token.mint} value={token.mint}>
                        {token.name} ({token.symbol})
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Network Fee */}
        <div className="flex justify-between mt-4">
          <p className="text-sm text-gray-500">Network fee</p>
          <p className="text-sm font-semibold">{networkFee} SOL</p>
        </div>
      </div>

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={loading}
        className={`mt-6 w-full max-w-md py-3 bg-purple-600 text-white rounded-full font-semibold ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Swapping..." : "Swap"}
      </button>
    </div>
  );
}
