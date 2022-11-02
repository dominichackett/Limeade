import {
  ArchiveBoxArrowDownIcon,
  CheckCircleIcon,
  ChevronDoubleRightIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowDownRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

export default function Start(props) {
  const { Moralis, user } = useMoralis();
  const [userAddress, setUserAddress] = useState();
  const [pet, setPet] = useState([]);
  const router = useRouter();

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

  //   NOT GETTING THE PETS INFO CORRECTLY WITH THE USE EFFECT BELOW - IT SHOWS OBJECT ID BUT NO FURTHER DETAILS

  useEffect(() => {
    const Pet = new Moralis.Object.extend("Pet");
    const query = new Moralis.Query(Pet);
    // query.equalTo("owner", user.get("ethAddress"));
    query.find().then((result) => {
      setPet(result);
      console.log(result);
    });
  }, [user]);

  function nextStep() {
    props.handleStep("2");
  }
  return (
    <main className="flex w-full flex-1 h-full flex-col items-center justify-center px-20 text-center">
      <h1 className="text-4xl mt-12 tracking-widest  whitespace-nowrap">
        Your Account, {userAddress}
      </h1>

      <div className=" grid grid-cols-3 mt-20 mb-40 gap-4 justify-between">
        {/* PET OVERVIEW */}
        <div className="flex  flex-col h-80 items-center w-full justify-start py-6 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
          <div className="flex flex-col items-center justify-start">
            <div
              onClick={() => {
                router.push("/insured");
              }}
              className="flex flex-row items-center cursor-pointer rounded-full hover:ring-2 hover:ring-black hover:shadow-lg px-4 "
            >
              <p className="text-xl font-bold">Current Insurance</p>
              <ArrowDownRightIcon className="h-4 ml-2 -rotate-90" />
            </div>
          </div>
          <div className="py-2 ">
            <p className="text-xl font-wide tracking-widest">
              {props.petName}Oates
            </p>
          </div>
          <div className="py-2">
            <Image
              src="/testimg/oates.JPG"
              className="rounded-full"
              height={100}
              width={100}
            />
          </div>
          <div className="flex flex-col w-6/12">
            <div className="flex flex-row items-center justify-around">
              <p className="text-lg">Gender</p>
              <p className="text-base font-bold">{props.petGender}Male</p>
            </div>
            <div className="flex flex-row items-center justify-around">
              <p className="text-lg">Age</p>
              <p className="text-base font-bold">{props.petAge}2</p>
            </div>
            <div className="flex flex-row items-center justify-around">
              <p className="text-lg">Breed</p>
              <p className="text-base font-bold">{props.petBreed}Mixed</p>
            </div>
          </div>
          {/* <div className="flex flex-col items-center justify-start">
            <p className="text-lg">Medical History</p>
            <p className="text-base font-bold">{props.medicalHistory}None</p>
          </div> */}
        </div>
        {/* CLAIM OVERVIEW */}
        <div className=" flex  flex-col items-center h-80 w-full justify-start py-6 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
          <div className="flex flex-col items-center w-full justify-start">
            <div
              onClick={() => {
                router.push("/claims");
              }}
              className="flex flex-row items-center cursor-pointer hover:ring-2 hover:ring-black hover:shadow-xl px-4 hover:ring-opacity-75 hover:rounded-full"
            >
              <p className="text-xl font-bold">Current Claims</p>
              <ArrowDownRightIcon className="h-4 ml-2 -rotate-90" />
            </div>
            <div className="flex flex-col items-center w-full mt-16 justify-center ">
              <div className="flex flex-row items-center w-6/12 justify-between">
                <p className="text-xl">Vaccine Claim</p>
                <CheckCircleIcon className="h-5 text-green-500" />
              </div>
              <div className="flex flex-row items-center w-6/12 justify-between">
                <p className="text-xl">Yearly Checkup</p>
                <ExclamationCircleIcon className="h-5 text-orange-500" />
              </div>
              <div className="flex flex-row items-center w-6/12 justify-between">
                <p className="text-xl">...</p>
                <XCircleIcon className="h-5 text-red-500" />
              </div>
            </div>
          </div>
        </div>
        {/* STAKE OVERVIEW */}

        <div className="flex  flex-col items-center h-80 w-full justify-start py-6 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
          <div className="flex flex-col items-center w-full justify-start">
            <div
              onClick={() => {
                router.push("/stake");
              }}
              className="flex flex-row items-center cursor-pointer hover:ring-2 hover:ring-black hover:shadow-xl px-4 hover:ring-opacity-75 hover:rounded-full"
            >
              <p className="text-xl font-bold">Staking</p>
              <ArrowDownRightIcon className="h-4 ml-2 -rotate-90" />
            </div>

            <div className="flex flex-col items-center w-full mt-16 justify-center ">
              <div className="flex flex-row items-center w-9/12 justify-between">
                <p className="text-xl">17,330.86 LIME</p>
                <ShieldCheckIcon className="h-5 text-green-500" />
              </div>
              <div className="flex flex-row items-center w-9/12 justify-between">
                <p className="text-xl">5,030.86 USDC</p>
                <ShieldCheckIcon className="h-5 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Verify Member */}
        <div className="flex  flex-col h-80 items-center w-full justify-start py-6 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
          <div className="flex flex-col items-center justify-start">
            <div className="flex flex-row items-center cursor-pointer rounded-full hover:ring-2 hover:ring-black hover:shadow-lg px-4 ">
              <p className="text-xl font-bold">Member Verification</p>
              <ArrowDownRightIcon className="h-4 ml-2 -rotate-90" />
            </div>
          </div>

          <div className="py-2">
            <Image src="/img/qrcodemember.PNG" height={378} width={378} />
          </div>

          {/* <div className="flex flex-col items-center justify-start">
            <p className="text-lg">Medical History</p>
            <p className="text-base font-bold">{props.medicalHistory}None</p>
          </div> */}
        </div>

        {/* Verify Member */}
        <div className="flex  flex-col h-80 items-center w-full justify-start py-6 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
          <div className="flex flex-col items-center justify-start">
            <div className="flex flex-row items-center cursor-pointer rounded-full hover:ring-2 hover:ring-black hover:shadow-lg px-4 ">
              <p className="text-xl font-bold"> Agent Verification</p>
              <ArrowDownRightIcon className="h-4 ml-2 -rotate-90" />
            </div>
          </div>

          <div className="py-2">
            <Image src="/img/qrcodeagent.PNG" height={378} width={378} />
          </div>

          {/* <div className="flex flex-col items-center justify-start">
            <p className="text-lg">Medical History</p>
            <p className="text-base font-bold">{props.medicalHistory}None</p>
          </div> */}
        </div>
        {/* CLAIM OVERVIEW */}
      </div>
    </main>
  );
}
