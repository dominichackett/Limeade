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
import {
  LimeManagerABI,
  LimeManagerAddress,
} from "./Contracts/LimeManagerContract";
import { ethers } from "ethers";
import Notification from "./Notification/Notification";
import { tokenMetadata } from "../uitls/utils";

export default function Start(props) {
  const { Moralis, user, isAuthenticated, web3, isWeb3Enabled, enableWeb3 } =
    useMoralis();
  const [userAddress, setUserAddress] = useState();
  const [pet, setPet] = useState([]);
  const [gotMember, setGotMember] = useState(false);
  const [member, setMember] = useState(false);
  const [gotPolygonIdEnabled, setGotPolygonIdEnabled] = useState(false);
  const [polygonIdEnabled, setPolygonIdEnabled] = useState();
  const [gotAgent, setGotAgent] = useState(false);
  const [agent, setAgent] = useState();
  const router = useRouter();
  const [claims, setClaims] = useState([]);
  const [staked, setStaked] = useState();
  // NOTIFICATIONS functions
  const [notificationTitle, setNotificationTitle] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [dialogType, setDialogType] = useState(1);
  const [agentMetadata, setAgentMetadata] = useState();
  const [memberMetadata, setMemberMetadata] = useState();
  const [show, setShow] = useState(false);

  const close = async () => {
    setShow(false);
  };
  async function joinDOA() {
    try {
      const LimeManagerContract = new ethers.Contract(
        LimeManagerAddress,
        LimeManagerABI,
        web3.getSigner()
      );
      //alert(JSON.stringify(myPolicy))
      let transaction = await LimeManagerContract.memberSignUp();

      await transaction.wait();

      setDialogType(1); //Success
      setNotificationTitle("Member");
      setNotificationDescription("You are now a member.");
      setShow(true);
      setMember(true);
    } catch (error) {
      setDialogType(2); //Failed
      setNotificationTitle("Member");
      setNotificationDescription(
        error.data ? error.data.message : error.message
      );

      setShow(true);
    }
  }

  async function becomeAgent() {
    try {
      const LimeManagerContract = new ethers.Contract(
        LimeManagerAddress,
        LimeManagerABI,
        web3.getSigner()
      );
      //alert(JSON.stringify(myPolicy))
      let transaction = await LimeManagerContract.agentsSignUp();

      await transaction.wait();

      setDialogType(1); //Success
      setNotificationTitle("Agent");
      setNotificationDescription("You are now an agent.");
      setShow(true);
      setAgent(true);
    } catch (error) {
      setDialogType(2); //Failed
      setNotificationTitle("Agent");
      setNotificationDescription(
        error.data ? error.data.message : error.message
      );

      setShow(true);
    }
  }

  useEffect(() => {
    const Claim = Moralis.Object.extend("Claims");
    const query = new Moralis.Query(Claim);
    query.equalTo("owner", user.get("ethAddress"));
    query.limit(2);
    query.include("policy");
    query.descending("dateSubmitted");
    query.find().then((cl) => {
      setClaims(cl);
    });
  }, []);

  useEffect(() => {
    async function getMetadata() {
      try {
        const _agentMetadata = await tokenMetadata(1);
        setAgentMetadata(_agentMetadata);

        const _memberMetadata = await tokenMetadata(2);
        setMemberMetadata(_memberMetadata);
        console.log(_agentMetadata);
        console.log(_memberMetadata);
      } catch (error) {}
    }

    getMetadata();
  }, [gotAgent, gotMember, member, agent]);

  useEffect(() => {
    if (!isWeb3Enabled) enableWeb3();
  }, []);

  useEffect(() => {
    async function getStaked() {
      if (isAuthenticated && user && web3) {
        const limeManagerContract = new ethers.Contract(
          LimeManagerAddress,
          LimeManagerABI,
          web3.getSigner()
        );
        try {
        let transaction = await limeManagerContract.staked();
        setStaked(transaction.toNumber());
        }catch(error)
        {

        }
      }
    }
    getStaked();
  }, [isAuthenticated, web3, user]);

  useEffect(() => {
    async function getAgent() {
      if (isAuthenticated && user && web3) {
        const limeManagerContract = new ethers.Contract(
          LimeManagerAddress,
          LimeManagerABI,
          web3.getSigner()
        );
        try {
        let transaction = await limeManagerContract.agent(
          user.get("ethAddress")
        );
        setGotAgent(true);
        setAgent(transaction);
        }catch(error)
        {

        }
      }
    }
    getAgent();
  }, [isAuthenticated, web3, user]);

  useEffect(() => {
    if (!isWeb3Enabled) enableWeb3();
  }, []);
  useEffect(() => {
    async function getPolygonIdEnabled() {
      if (isAuthenticated && user && web3) {
        const limeManagerContract = new ethers.Contract(
          LimeManagerAddress,
          LimeManagerABI,
          web3.getSigner()
        );
        try{
        let transaction = await limeManagerContract.polygonIdEnabled();
        //const value = transaction;
        setGotPolygonIdEnabled(true);
        setPolygonIdEnabled(transaction);
        }catch(error)
        {
          
        }
      }
    }
    getPolygonIdEnabled();
  }, [isAuthenticated, web3, user]);

  useEffect(() => {
    async function getMember() {
      if (isAuthenticated && user && web3) {
        const limeManagerContract = new ethers.Contract(
          LimeManagerAddress,
          LimeManagerABI,
          web3.getSigner()
        );
        try {
        let transaction = await limeManagerContract.member(
          user.get("ethAddress")
        );
        //const value = transaction;
        setGotMember(true);
        setMember(transaction);
        }catch(error){

        }
      }
    }
    getMember();
  }, [isAuthenticated, web3, user]);

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
    const Policy = new Moralis.Object.extend("Policy");
    const query = new Moralis.Query(Policy);
    query.equalTo("owner", user.get("ethAddress"));
    query.include("pet");
    query.descending("createdAt");
    query.first().then((result) => {
      if (result)
        setPet({
          name: result.get("pet").get("name"),
          petImg: result.get("pet").get("petImg"),
          gender: result.get("pet").get("gender"),
          age: result.get("pet").get("age"),
          breed: result.get("pet").get("breed"),
        });
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
        <div className="flex  flex-col h-80 items-center w-full justify-start py-4 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
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
            <p className="text-xl font-wide tracking-widest">{pet?.name}</p>
          </div>
          <div className="py-2">
            <Image
              src={pet.petImg == "" ? "/img/noimage.jpg" : pet.petImg}
              className="rounded-full"
              height={100}
              width={100}
            />
          </div>
          <div className="flex flex-col w-6/12 ">
            <div className="flex flex-row items-center justify-around">
              <p className="text-lg">Gender</p>
              <p className="text-base font-bold">
                {pet?.gender?.toUpperCase()}
              </p>
            </div>
            <div className="flex flex-row items-center justify-around">
              <p className="text-lg">Age</p>
              <p className="text-base font-bold">{pet.age}</p>
            </div>
            <div className="flex flex-row items-center justify-around mb-6">
              <p className="text-lg">Breed</p>
              <p className="text-base font-bold">{pet?.breed?.toUpperCase()}</p>
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
              {claims.map((claim) => (
                <div className="flex flex-row items-center w-6/12 justify-between">
                  <p className="text-xl">{claim.get("description")}</p>
                  {claim.get("state") == 0 && (
                    <ExclamationCircleIcon className="h-5 text-orange-500" />
                  )}

                  {claim.get("state") == 1 && (
                    <CheckCircleIcon className="h-5 text-green-500" />
                  )}
                  {claim.get("state") == 2 && (
                    <XCircleIcon className="h-5 text-red-500" />
                  )}
                </div>
              ))}
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
                <p className="text-xl">{staked} LIME</p>
                <ShieldCheckIcon className="h-5 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Verify Member */}
        <div
          hidden={member == true}
          className="flex  flex-col h-80 items-center w-full justify-start py-6 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full"
        >
          <div className="flex flex-col items-center justify-start">
            <div className="flex flex-row items-center cursor-pointer rounded-full hover:ring-2 hover:ring-black hover:shadow-lg px-4 ">
              <p className="text-xl font-bold">Member Verification</p>
              <ArrowDownRightIcon className="h-4 ml-2 -rotate-90" />
            </div>
          </div>

          <div
            className="py-2"
            hidden={
              gotMember == false ||
              (gotMember == true && member == true) ||
              (gotPolygonIdEnabled == true && polygonIdEnabled == true)
            }
          >
            <button
              onClick={joinDOA}
              disabled={member == true}
              className="flex flex-col items-center justify-center w-40 h-12 bg-black text-white rounded-full"
            >
              Become a Member{" "}
            </button>
          </div>

          <div hidden={member == false} className="py-2">
            <img
              height={200}
              width={200}
              alt="Active Member"
              src={memberMetadata?.metadata.image}
            />
          </div>

          <div
            className="py-2"
            hidden={
              gotMember == false ||
              (gotMember == true && member == true) ||
              (gotPolygonIdEnabled == true && polygonIdEnabled == false)
            }
          >
            <Image src="/img/qrcodemember.PNG" height={378} width={378} />
          </div>

          {/* <div className="flex flex-col items-center justify-start">
            <p className="text-lg">Medical History</p>
            <p className="text-base font-bold">{props.medicalHistory}None</p>
          </div> */}
        </div>

        {/* Verify Member */}
        <div className="flex  flex-col h-80 items-center w-full justify-start py-6 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
          <div
            hidden={agent == true}
            className="flex flex-col items-center justify-start"
          >
            <div className="flex flex-row items-center cursor-pointer rounded-full hover:ring-2 hover:ring-black hover:shadow-lg px-4 ">
              <p className="text-xl font-bold"> Agent Verification</p>
              <ArrowDownRightIcon className="h-4 ml-2 -rotate-90" />
            </div>
          </div>

          <div
            hidden={
              gotAgent == false ||
              (gotAgent == true && agent == true) ||
              (gotPolygonIdEnabled == true && polygonIdEnabled == false)
            }
            className="py-2"
          >
            <Image src="/img/qrcodeagent.PNG" height={378} width={378} />
          </div>

          <div hidden={agent == false} className="py-2">
            <img
              height={200}
              width={200}
              alt="Active Agent"
              src={agentMetadata?.metadata.image}
            />
          </div>
          <div
            className="py-2"
            hidden={
              gotAgent == false ||
              (gotAgent == true && agent == true) ||
              (gotPolygonIdEnabled == true && polygonIdEnabled == true)
            }
          >
            <button
              onClick={becomeAgent}
              disabled={agent == true}
              className="flex flex-col items-center justify-center w-40 h-12 bg-black text-white rounded-full"
            >
              Become an Agent{" "}
            </button>
          </div>

          {/* <div className="flex flex-col items-center justify-start">
            <p className="text-lg">Medical History</p>
            <p className="text-base font-bold">{props.medicalHistory}None</p>
          </div> */}
        </div>
        {/* CLAIM OVERVIEW */}
        <Notification
          type={dialogType}
          show={show}
          close={close}
          title={notificationTitle}
          description={notificationDescription}
        />
      </div>
    </main>
  );
}
