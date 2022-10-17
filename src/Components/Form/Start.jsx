import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

export default function Start() {
  const { user } = useMoralis();

  const [userAddress, setUserAddress] = useState();

  useEffect(() => {
    if (user) {
      setUserAddress(
        user.get("ethAddress").slice(0, 6).concat("...") +
          user.get("ethAddress").slice(38, 44)
      );
    } else {
      setUserAddress("undefined");
    }
  });

  const [Q1, setQ1] = useState();
  const [Q2, setQ2] = useState();
  const [Q3, setQ3] = useState();
  const [Q4, setQ4] = useState();

  function nextQuestion() {
    if (!Q1) {
      setQ1(true);
    } else if (Q1) {
      setQ2(true);
    } else if (Q1 && Q2) {
      setQ3(true);
    } else if (Q1 && Q2 && Q3) {
      setQ4(true);
    }
  }

  return (
    <main className="flex w-9/12 flex-1 flex-col items-center justify-center px-20 text-center">
      <h1 className="text-2xl tracking-widest pr-96 whitespace-nowrap">
        {!Q1 && `Welcome, ${userAddress}`}
        {Q1 && "Let's get started..."}
      </h1>
      {!Q1 && (
        <div className="mt-6 flex max-w-xl flex-col items-center justify-center py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
          <h3 className="text-xl font-bold tracking-wide ">PET INSURANCE</h3>
          <p className="text-base tracking-wider">for cats & dogs</p>
          <p className="py-2 text-xl tracking-wide">
            Lots of coverage, for little cost
          </p>
          <button
            onClick={nextQuestion}
            className="flex flex-col items-center justify-center w-40 h-10 bg-black text-white rounded-full"
          >
            Get Started
          </button>
        </div>
      )}
      {Q1 && (
        <div className="mt-6 flex max-w-xl flex-col items-center justify-center py-8 rounded-xl sm:w-full">
          <h3 className="text-xl font-bold tracking-wide ">
            What's your Pets Name?
          </h3>
          <input type="text" placeholder="Name" />

          <button
            onClick={nextQuestion}
            className="flex flex-col items-center justify-center w-40 h-10 bg-[#CAF46F] bg-opacity-70 text-black rounded-full"
          >
            Next Question
          </button>
        </div>
      )}
    </main>
  );
}
