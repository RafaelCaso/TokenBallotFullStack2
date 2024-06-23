import { useState } from "react";

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
        onChange={(e) => setBallotNumber(Number(e.target.value))}
      />

      <label htmlFor="voteAmount">Vote Amount</label>
      <input
        id="voteAmount"
        type="number"
        value={voteAmount}
        onChange={(e) => setVoteAmount(Number(e.target.value))}
      />
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

export default Vote;