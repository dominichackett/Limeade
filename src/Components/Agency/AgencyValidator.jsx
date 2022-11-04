import Image from "next/image";
import { useEffect, useState } from "react";
import { useMoralis, useMoralisFile } from "react-moralis";
import AgencyTable from "../Agency/AgencyTable";
import ClaimValidation from "../Agency/ClaimValidation";
import { useRouter } from 'next/router'
import Notification from "../Notification/Notification";
import {
  LimeManagerABI,
  LimeManagerAddress,
} from "../Contracts/LimeManagerContract";
import { ethers } from "ethers";

export default function PetForm() {
  const { user ,web3,isWeb3Enabled, enableWeb3 } = useMoralis();
  const { saveFile } = useMoralisFile();
  const router = useRouter()

  const [polygonIdAuthenticated, setPolygonIdAuthenticated] = useState(true);

  //   LOOPING THRU STEPS
  const [step, setStep] = useState("1");

  //  NOTIFICATION STATES & FUNCTIONS
 const [show, setShow] = useState(false);
 const [notificationTitle, setNotificationTitle] = useState();
 const [notificationDescription, setNotificationDescription] = useState();
 const [dialogType, setDialogType] = useState(1);
 const close = async () => {
   setShow(false);
 };
 useEffect(() => {
  if (!isWeb3Enabled) enableWeb3();
}, []);

  useEffect(() => {
    if (polygonIdAuthenticated) {
      setStep("2");
    } else setStep("1");
  }, []);

  const handleStep = () => {
    if (step == "1") {
      setStep("2");
    } else if (step == "2") {
      setStep("3");
    } else if (step == "3") {
      setStep("2");
    }
  };

  function handleValidation() {
    // logicxxx
  }

  async function approveClaim() {
    const amountpaid = document.getElementById("amountpaid").value;
    
    if(isNaN(parseInt(amountpaid)))
    {
      setDialogType(2); //Error
      setNotificationTitle("Approve Claim");
      setNotificationDescription("Please enter amount.");
      setShow(true);
      return
    }

    if(parseInt(amountpaid) > parseInt(router.query.coverage) )
    {
      setDialogType(2); //Error
      setNotificationTitle("Approve Claim");
      setNotificationDescription("Amount paid cannot be greater than coverage.");
      setShow(true);
      return
    }

    try {
      const LimeManagerContract = new ethers.Contract(
        LimeManagerAddress,
        LimeManagerABI,
        web3.getSigner()
      );
      //alert(JSON.stringify(myPolicy))
      let transaction = await LimeManagerContract.validateClaim(
          router.query.cid,amountpaid     
      );

      await transaction.wait();
      console.log(transaction);
      setDialogType(1); //Success
      setNotificationTitle("Claim");
      setNotificationDescription("Claim Approved.");
      setShow(true);
      setRefreshClaims(new Date())
      handleStep("2")
    } catch (error) {
      setDialogType(2); //Failed
      setNotificationTitle("Claim Approval Failed");
      setNotificationDescription(
        error.data ? error.data.message : error.message
      );

      setShow(true);
    }
  }

  async function denyClaim() {
    const message = document.getElementById("message").value;

    if(message=="" )
    {
      setDialogType(2); //Error
      setNotificationTitle("Deny Claim");
      setNotificationDescription("Enter denial reason.");
      setShow(true);
      return
    }
    
    try {
      const LimeManagerContract = new ethers.Contract(
        LimeManagerAddress,
        LimeManagerABI,
        web3.getSigner()
      );
      //alert(JSON.stringify(myPolicy))
      let transaction = await LimeManagerContract.denyClaim(
          router.query.cid,message     
      );

      await transaction.wait();
      console.log(transaction);
      setDialogType(1); //Success
      setNotificationTitle("Claim");
      setNotificationDescription("Claim Denied.");
      setShow(true);
      setRefreshClaims(new Date())
      handleStep("2")
    } catch (error) {
      setDialogType(2); //Failed
      setNotificationTitle("Claim Deny");
      setNotificationDescription(
        error.data ? error.data.message : error.message
      );

      setShow(true);
    }
  }

  return (
    <main className="mb-4 flex w-full flex-1 h-full flex-col items-center justify-center px-20 text-center">
      {/*  OVERVIEW: VALIDATE / DENY APPLICATIONS  */}
      <div hidden={step != "2"} className="w-full">
        
        <div className="w-full flex items-center justify-center">
          
          <div className="flex flex-row w-6/12 items-center justify-center">
            <div className="mt-6 flex flex-col items-center justify-around space-y-4  bg-opacity-70 rounded-xl sm:w-full">
              <div>
                <h3 className="text-4xl font-bold tracking-wide ">
                  Claim Records
                </h3>
                <p className="text-2xl tracking-wide">
                  Get rewarded for validating claims
                </p>
              </div>
              <div className="w-full">
                <ClaimValidation />
              </div>
              <div className="flex flex-row items-center justify-between w-6/12">
                <button
                  onClick={approveClaim}
                  disabled={router.query.state!=0}
                  className="flex flex-col items-center font-semibold justify-center w-40 h-12 bg-black text-white rounded-full"
                >
                  Validate
                </button>
                <button
                  onClick={denyClaim}
                  disabled={router.query.state!=0}
                  className="flex flex-col items-center font-semibold justify-center w-40 h-12 bg-black text-white rounded-full"
                >
                  Deny
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </div> <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
    </main>
  );
}
