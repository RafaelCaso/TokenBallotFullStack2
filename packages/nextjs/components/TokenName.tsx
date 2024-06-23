import { useReadContract } from "wagmi";
import * as tokenJson from "../../../backend/src/assets/JamToken.json";
import { useState } from "react";

function TokenName() {
  const [data, setData] = useState<{ result: string }>();
  const getData =  fetch("http://localhost:3001/winner")
  .then((res) => res.json())
  .then((data) => {
    setData(data);
  });

  const name = typeof data === "string" ? data : 0;

  return <div>Token name: {name}</div>;
}

export default TokenName;