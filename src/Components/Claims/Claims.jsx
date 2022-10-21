import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
// import LandingOptions from "./LandingOptions";

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

  return (
    <main className="flex w-full flex-1 h-full flex-col items-center justify-center px-20 text-center">
      {/*  GET STARTED  */}
      <div className="flex flex-col  w-6/12 items-center">
        <div className="mt-6 flex  flex-col items-center h-80 justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
          <nav className="rounded-full font-bold ring-2 ring-black flex flex-row items-cennter justify-between w-3/12">
            <div className="flex items-center px-2 justify-center w-6/12 py-1 text-black rounded-full">
              <button className="px-2 rounded-full">New</button>
            </div>
            <div className="flex items-center justify-center px-2 w-6/12 bg-black text-white rounded-full">
              <button className="px-2 rounded-full">Past</button>
            </div>
          </nav>
          <div>
            <h3 className="text-4xl font-bold tracking-wide ">
              Make a new claim
            </h3>
            <p className="text-2xl tracking-wide">
              on your pet insurance policy
            </p>
          </div>
          <button className="flex flex-col items-center font-semibold justify-center w-40 h-12 bg-black text-white rounded-full">
            Make a claim
          </button>
        </div>
      </div>
    </main>
  );
}
