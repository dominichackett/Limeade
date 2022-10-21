import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Table from "./Table";

export default function PetForm() {
  const { user, isAuthenticated } = useMoralis();

  const [userAddress, setUserAddress] = useState();

  useEffect(() => {
    if (user) {
      setUserAddress(
        user.get("ethAddress").slice(0, 6).concat("...") +
          user.get("ethAddress").slice(38, 44)
      );
    } else {
      setUserAddress("please log in!");
    }
  });

  //   LOOPING THRU STEPS
  const [step, setStep] = useState("1");

  const handleStep = () => {
    if (step == "1") {
      setStep("2");
    } else if (step == "2") {
      setStep("3");
    } else if (step == "3") {
      setStep("4");
    }
  };

  return (
    <main className="flex w-full flex-1 h-full flex-col items-center justify-center px-20 text-center">
      {/*  MAKE CLAIM  */}
      <div hidden={step != "1"} className="w-full ">
        <div className="w-full flex items-center justify-center">
          <div className="flex flex-col w-6/12 items-center justify-center">
            <div className="mt-6 flex  flex-col items-center h-80 justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
              {/* <nav className="rounded-full font-bold ring-2 ring-black flex flex-row items-cennter justify-between w-3/12">
            <div className="flex items-center px-2 justify-center w-6/12 py-1 text-black rounded-full">
              <button className="px-2 rounded-full">New</button>
            </div>
            <div className="flex items-center justify-center px-2 w-6/12 bg-black text-white rounded-full">
              <button className="px-2 rounded-full">Past</button>
            </div>
          </nav> */}
              <div>
                <h3 className="text-4xl font-bold tracking-wide ">
                  Make a new claim
                </h3>
                <p className="text-2xl tracking-wide">
                  on your pet insurance policy
                </p>
              </div>
              <button
                onClick={handleStep}
                className="flex flex-col items-center font-semibold justify-center w-40 h-12 bg-black text-white rounded-full"
              >
                Claim
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*  SELECT: NEW / PAST  */}
      <div hidden={step != "2"} className="w-full">
        <div className="w-full flex items-center justify-center">
          <div className="flex flex-row w-6/12 items-center justify-center">
            <div className="mt-6 flex flex-col items-center justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
              <nav className="rounded-full font-bold ring-2 ring-black flex flex-row items-cennter justify-between w-3/12">
                <div className="flex items-center px-2 justify-center w-6/12 py-1 text-black rounded-full">
                  <button className="px-2 rounded-full">New</button>
                </div>
                <div className="flex items-center justify-center px-2 w-6/12 bg-black text-white rounded-full">
                  <button className="px-2 rounded-full">Past</button>
                </div>
              </nav>
              <div className="w-full">
                <Table />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
