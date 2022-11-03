import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis, useMoralisFile } from "react-moralis";
import Notification from "../Notification/Notification";
import { USDCABI, USDCAddress } from "../Contracts/USDCContract";
import {
  LimeManagerABI,
  LimeManagerAddress,
} from "../Contracts/LimeManagerContract";
import { ethers } from "ethers";

export default function Summary(props) {
  const { Moralis, user, web3, isWeb3Enabled, enableWeb3 } = useMoralis();
  const { saveFile } = useMoralisFile();

  const router = useRouter();
  const [coverage, setCoverage] = useState(0);
  const [premium, setPremium] = useState(0);
  const [usdcApproved, setUsdcApproved] = useState(false);
  const [myPolicy, setMyPolicy] = useState();
  // NOTIFICATIONS functions
  const [notificationTitle, setNotificationTitle] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [dialogType, setDialogType] = useState(1);

  const [show, setShow] = useState(false);
  async function purchasePolicy() {
    try {
      const LimeManagerContract = new ethers.Contract(
        LimeManagerAddress,
        LimeManagerABI,
        web3.getSigner()
      );
      //alert(JSON.stringify(myPolicy))
      let transaction = await LimeManagerContract.createPolicy(
        myPolicy.id,
        myPolicy.get("name"),
        myPolicy.get("breed"),
        myPolicy.get("age"),
        myPolicy.get("coverage"),
        myPolicy.get("premium"),
        myPolicy.get("petType")
      );

      await transaction.wait();
      console.log(transaction);
      setDialogType(1); //Success
      setNotificationTitle("Purchase");
      setNotificationDescription("Purchase Successful.");
      setShow(true);
    } catch (error) {
      setDialogType(2); //Failed
      setNotificationTitle("Purchase Failed");
      setNotificationDescription(
        error.data ? error.data.message : error.message
      );

      setShow(true);
    }
  }

  useEffect(() => {
    if (!isWeb3Enabled) enableWeb3();
  }, []);

  const approveUSDC = async () => {
    try {
      const USDCContract = new ethers.Contract(
        USDCAddress,
        USDCABI,
        web3.getSigner()
      );
      let transaction = await USDCContract.approve(
        LimeManagerAddress,
        ethers.constants.MaxUint256
      );

      await transaction.wait();
      setDialogType(1); //Success
      setNotificationTitle("Approve USDC Successful");
      setNotificationDescription("Approval Successful.");
      setShow(true);
      setUsdcApproved(true);
      // Call Function to subscribe
    } catch (error) {
      setDialogType(2); //Failed
      setNotificationTitle("Approve USDC Failed");
      setNotificationDescription(error.message);

      setShow(true);
    }
  };

  async function getQuote() {
    // storing variables
    const name = props.petName;
    const gender = props.petGender;
    const age = props.petAge;
    const breed = props.petBreed;
    const medical = props.medicalHistory;
    const petType = props.petType;
    const imgFile = document.getElementById("file-upload").files[0];

    let ipfsFile = "";

    if (imgFile) {
      console.log("uploading pet photo");
      await saveFile("imgfile", imgFile, { saveIPFS: true }).then(
        async (hash) => {
          ipfsFile = hash._ipfs;
        }
      );
    }
    // storing variables in Moralis
    const Pet = new Moralis.Object.extend("Pet");
    const pet = new Pet();
    pet.set("owner", user.get("ethAddress"));
    pet.set("name", name);
    pet.set("gender", gender);
    pet.set("age", age);
    pet.set("breed", breed);
    pet.set("medicalHistory", JSON.stringify(medical));
    pet.set("petImg", ipfsFile);
    pet.set("petType", petType);
    pet.save().then(async (p) => {
      // setDialogType(1); //Success
      // setNotificationTitle("Successful");
      // setNotificationDescription("Getting Quote now...");
      // setShow(true);
      //alert(JSON.stringify(props.medicalHistory))
      const result = await Moralis.Cloud.run("getQuote", {
        petData: {
          petType: p.get("petType"),
          medicalHistory: props.medicalHistory,
        },
      });

      const Policy = new Moralis.Object.extend("Policy");
      const policy = new Policy();
      policy.set("owner", p.get("owner"));
      policy.set("name", p.get("name"));
      policy.set("gender", p.get("gender"));
      policy.set("age", parseInt(p.get("age")));
      policy.set("breed", p.get("breed"));
      policy.set("petType", p.get("petType"));
      policy.set("coverage", result.coverage);
      policy.set("premium", result.premium);
      policy.set("active", false);
      policy.set("pet", p);

      policy.save().then((pl) => {
        setPremium(pl.get("premium"));
        setCoverage(pl.get("coverage"));
        setDialogType(1);
        setNotificationTitle("Policy");
        setNotificationDescription("Policy information ready for purchase.");
        setShow(true);
        setMyPolicy(pl);
      });
    });

    //once you got a quote, create pet profile in moralis database--- if thers a pet profile, show a different starting screen, with an option to add another pet.
    // props.handleStep("1");
  }

  const close = async () => {
    setShow(false);
  };
  return (
    <main className="flex w-full flex-1 h-full flex-col items-center justify-center px-20 text-center">
      <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
      <h1 className="text-4xl tracking-widest whitespace-nowrap md:top-20">
        {props.title}
      </h1>
      <div className="mt-6 flex  flex-col items-center h-full w-full justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
        <h3 className="text-3xl font-bold">
          Here's a summary of {props.petName}'s information
        </h3>
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Name</p>
            <p className="text-base font-bold">{props.petName}</p>
          </div>
          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Gender</p>
            <p className="text-base font-bold">{props.petGender}</p>
          </div>
          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Age</p>
            <p className="text-base font-bold">{props.petAge} Years old</p>
          </div>
          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Breed</p>
            <p className="text-base font-bold">{props.petBreed}</p>
          </div>
          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl text-red-600">Coverage</p>
            <p className="text-base font-bold text-red-600">${coverage}</p>
          </div>
          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl text-red-600">Premium</p>
            <p className="text-base font-bold text-red-600">${premium}</p>
          </div>

          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Ear Infection</p>
            <p className="text-base font-bold">
              {props.medicalHistory.head?.ear ? "Yes" : "No"}
            </p>
          </div>

          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Kennel Cough</p>
            <p className="text-base font-bold">
              {props.medicalHistory.head?.cough ? "Yes" : "No"}
            </p>
          </div>

          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Eye Issues</p>
            <p className="text-base font-bold">
              {props.medicalHistory.head?.eye ? "Yes" : "No"}
            </p>
          </div>
          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Diarrhea</p>
            <p className="text-base font-bold">
              {props.medicalHistory.stomach?.diarr ? "Yes" : "No"}
            </p>
          </div>
          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Urinary - UTI</p>
            <p className="text-base font-bold">
              {props.medicalHistory.stomach?.urin ? "Yes" : "No"}
            </p>
          </div>

          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Broken Leg</p>
            <p className="text-base font-bold">
              {props.medicalHistory.leg?.leg ? "Yes" : "No"}
            </p>
          </div>

          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Lameness of Limbs</p>
            <p className="text-base font-bold">
              {props.medicalHistory.leg?.limb ? "Yes" : "No"}
            </p>
          </div>

          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Soft Tissue Injury</p>
            <p className="text-base font-bold">
              {props.medicalHistory.leg?.injury ? "Yes" : "No"}
            </p>
          </div>
          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Giardia</p>
            <p className="text-base font-bold">
              {props.medicalHistory.parasites?.gia ? "Yes" : "No"}
            </p>
          </div>

          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Fleas or Ticks</p>
            <p className="text-base font-bold">
              {props.medicalHistory.parasites?.flea ? "Yes" : "No"}
            </p>
          </div>
          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Ear mites</p>
            <p className="text-base font-bold">
              {props.medicalHistory.parasites?.mites ? "Yes" : "No"}
            </p>
          </div>

          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Allergies</p>
            <p className="text-base font-bold">
              {props.medicalHistory.chronics?.allergies ? "Yes" : "No"}
            </p>
          </div>

          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Diabetes</p>
            <p className="text-base font-bold">
              {props.medicalHistory.chronics?.diabetes ? "Yes" : "No"}
            </p>
          </div>
          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Cancer</p>
            <p className="text-base font-bold">
              {props.medicalHistory.chronics?.cancer ? "Yes" : "No"}
            </p>
          </div>
          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Kidney Disease</p>
            <p className="text-base font-bold">
              {props.medicalHistory.chronics?.kidneydisease ? "Yes" : "No"}
            </p>
          </div>

          <div className="flex flex-col items-center justify-start ">
            <p className="text-xl">Upload Photo</p>

            <div className="mt-1 sm:col-span-2 sm:mt-0">
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-full p-2 bg-gray-800 font-medium text-white focus-within:outline-none  hover:text-gray-200"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex  items-center space-x-4 mt-4 mb-4 ">
        <button
          disabled={premium > 0}
          onClick={getQuote}
          className="flex flex-col items-center justify-center w-40 h-12 bg-black text-white rounded-full"
        >
          Get quote
        </button>

        <button
          disabled={premium <= 0 || usdcApproved}
          onClick={approveUSDC}
          className="flex flex-col items-center justify-center w-40 h-12 bg-black text-white rounded-full"
        >
          Approve USDC
        </button>
        <button
          disabled={premium <= 0 || usdcApproved == false}
          hidden={usdcApproved == true}
          onClick={purchasePolicy}
          className="ml-4 flex flex-col items-center justify-center w-40 h-12 bg-black text-white rounded-full"
        >
          Buy Policy
        </button>
      </div>
    </main>
  );
}
