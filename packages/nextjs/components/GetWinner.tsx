import { useState } from "react";

function GetWinner() {
  const [data, setData] = useState<{ result: string }>();

  if(!data){
  return(
    <button
    className="btn btn-active btn-neutral"
    onClick={() => {
      fetch("http://localhost:3001/winner")
        .then((res) => res.json())
        .then((data) => {
          setData(data);
        });
    }}
    >
      Get Winner
    </button>
  )}
  return <div>Winner: {data.result}</div>
}

export default GetWinner;