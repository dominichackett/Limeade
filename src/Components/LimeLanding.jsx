import Image from "next/image";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import LandingOptions from "./LandingOptions";

export default function PetForm() {
  const { user, isAuthenticated } = useMoralis();

  const [userAddress, setUserAddress] = useState();
  const [title, setTitle] = useState();

  const Title = "Welcome, " + userAddress;

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
  useEffect(() => {
    if (!isAuthenticated) {
      setTitle("Welcome, please Log in.");
    } else {
      setTitle("Welcome, " + userAddress);
    }
  }, [user]);

  //   LOOPING THRU STEPS

  return (
    <main className="flex w-full flex-1 h-full flex-col items-center justify-center px-20 text-center">
      {/*  GET STARTED  */}
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-row items-center justify-evenly space-x-96 absolute top-96">
          <div>
            <Image src={"/catimg.png"} width={200} height={200} />
          </div>
          <div>
            <Image src={"/dogimg.png"} width={200} height={200} />
          </div>
        </div>
        <div className="w-full">
          <LandingOptions title={Title} />
        </div>
      </div>
    </main>
  );
}
