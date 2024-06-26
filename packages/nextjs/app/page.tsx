"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount, useBalance, useReadContract, useSignMessage } from "wagmi";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">The Thunder Dome!</span>
          </h1>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/pages/index.tsx
            </code>
          </p>
          <PageBody />
          <WalletInfo />
          <GrantRole />
          <RandomWord />
        </div>
      </div>
    </>
  );
};

function PageBody() {
  return (
    <>
      <p className="text-center text-lg">Here we are!</p>
    </>
  );
}

function WalletInfo() {
  const { address, isConnecting, isDisconnected, chain } = useAccount();
  if (address)
    return (
      <div>
        <p>Your account address is {address}</p>
        <p>Connected to the network {chain?.name}</p>
        <WalletAction></WalletAction>
        <WalletBalance address={address as `0x${string}`}></WalletBalance>
        <TokenInfo address={address as `0x${string}`}></TokenInfo>
        <ApiData address={address as `0x${string}`} />
        <Vote address={address as `0x${string}`} />
        <GetWinner />
      </div>
    );
  if (isConnecting)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div>
        <p>Wallet disconnected. Connect wallet to continue</p>
      </div>
    );
  return (
    <div>
      <p>Connect wallet to continue</p>
    </div>
  );
}

function WalletAction() {
  const [signatureMessage, setSignatureMessage] = useState("");
  const { data, isError, isPending, isSuccess, signMessage } = useSignMessage();
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing signatures</h2>
        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Enter the message to be signed:</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={signatureMessage}
            onChange={e => setSignatureMessage(e.target.value)}
          />
        </div>
        <button
          className="btn btn-active btn-neutral"
          disabled={isPending}
          onClick={() =>
            signMessage({
              message: signatureMessage,
            })
          }
        >
          Sign message
        </button>
        {isSuccess && <div>Signature: {data}</div>}
        {isError && <div>Error signing message</div>}
      </div>
    </div>
  );
}

function WalletBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useBalance wagmi hook</h2>
        Balance: {data?.formatted} {data?.symbol}
      </div>
    </div>
  );
}

function TokenInfo(params: { address: `0x${string}` }) {
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useReadContract wagmi hook</h2>
        <TokenName></TokenName>
        <TokenBalance address={params.address}></TokenBalance>
      </div>
    </div>
  );
}

function TokenName() {
  const { data, isError, isLoading } = useReadContract({
    address: "0x22d3f4c962d5e8d9ba065aa88f00043465b7d9bb",
    abi: [
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
          {
            name: "",
            type: "string",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "name",
  });

  const name = typeof data === "string" ? data : 0;

  if (isLoading) return <div>Fetching name…</div>;
  if (isError) return <div>Error fetching name</div>;
  return <div>Token name: {name}</div>;
}

function TokenBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useReadContract({
    address: "0x22d3f4c962d5e8d9ba065aa88f00043465b7d9bb",
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: "_owner",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            name: "balance",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: [params.address],
  });
  const balance = typeof data === "bigint" ? data : 0n;
  const displayBalance = formatEther(balance);

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return <div>Balance: {displayBalance}</div>;
}

function RandomWord() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://randomuser.me/api/")
      .then(res => res.json())
      .then(data => {
        setData(data.results[0]);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useState and useEffect from React library</h2>
        <h1>
          Name: {data.name.title} {data.name.first} {data.name.last}
        </h1>
        <p>Email: {data.email}</p>
      </div>
    </div>
  );
}

function ApiData(params: { address: `0x${string}` }) {
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing API Coupling</h2>
        <TokenAddressFromApi />
        <RequestTokens address={params.address} />
        <Delegate address={params.address} />
      </div>
    </div>
  );
}

function TokenAddressFromApi() {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/contract-address")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading token address from API...</p>;
  if (!data) return <p>No token address information</p>;

  return (
    <div>
      <p>Token address from API: {data.result}</p>
    </div>
  );
}

function RequestTokens(params: { address: string }) {
  const [data, setData] = useState<{ result: boolean }>();
  const [isLoading, setLoading] = useState(false);

  const [amount, setAmount] = useState(0);

  const body = { address: params.address, amount: amount };

  if (isLoading) return <p>Requesting tokens from API...</p>;
  if (!data)
    return (
      <div>
        <input type="string" value={amount} onChange={e => setAmount(Number(e.target.value))} />
        <button
          className="btn btn-active btn-neutral"
          onClick={() => {
            setLoading(true);
            fetch("http://localhost:3001/mint-tokens", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            })
              .then(res => res.json())
              .then(data => {
                setData(data);
                setLoading(false);
              });
          }}
        >
          Request tokens
        </button>
      </div>
    );

  return (
    <div>
      <p>Result from API: {data.result ? "worked" : "failed"}</p>
    </div>
  );
}

function GetWinner() {
  const [data, setData] = useState<{ result: string }>();

  if (!data) {
    return (
      <div className="card w-96 bg-primary text-primary-content mt-4">
        <button
          className="btn btn-active btn-neutral"
          onClick={() => {
            fetch("http://localhost:3001/winner")
              .then(res => res.json())
              .then(data => {
                setData(data);
              });
          }}
        >
          Get Winner
        </button>
      </div>
    );
  }
  return <div>Winner: {data.result}</div>;
}

function Vote(params: { address: string }) {
  const voterAddress = params.address;
  const [ballotNumber, setBallotNumber] = useState(0);
  const [voteAmount, setVoteAmount] = useState(0);

  return (
    <div>
      <label htmlFor="ballotNumber">Ballot Number</label>
      <input
        id="ballotNumber"
        type="number"
        value={ballotNumber}
        onChange={e => setBallotNumber(Number(e.target.value))}
      />

      <label htmlFor="voteAmount">Vote Amount</label>
      <input id="voteAmount" type="number" value={voteAmount} onChange={e => setVoteAmount(Number(e.target.value))} />
      <button
        className="btn btn-active btn-neutral"
        onClick={() => {
          fetch("http://localhost:3001/vote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              position: ballotNumber.toString(),
              amount: voteAmount.toString(),
              address: voterAddress,
            }),
          });
        }}
      >
        Vote
      </button>
    </div>
  );
}

function GrantRole() {
  const [address, setAddress] = useState("");
  return (
    <div>
      <label htmlFor="address">Address</label>
      <input id="address" type="text" value={address} onChange={e => setAddress(e.target.value)} />
      <button
        className="btn btn-active btn-neutral"
        onClick={() => {
          fetch("http://localhost:3001/grant-role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              address: address,
            }),
          });
        }}
      >
        Grant Role
      </button>
    </div>
  );
}

function Delegate(params: { address: string }) {
  return (
    <div>
      <button
        className="btn btn-active btn-neutral"
        onClick={() => {
          fetch("http://localhost:3001/delegate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              address: params.address,
            }),
          });
        }}
      >
        Delegate
      </button>
    </div>
  );
}

export default Home;
