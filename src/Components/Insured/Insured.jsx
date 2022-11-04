import { useEffect, useState } from "react";
import { useMoralis, useMoralisFile } from "react-moralis";
import Past from "./Past";
import Notification from "../Notification/Notification";
import {
  LimeManagerABI,
  LimeManagerAddress,
} from "../Contracts/LimeManagerContract";

const navigation = [
  { name: "New", id: 2, current: true },
  {
    name: "Past",
    id: 1,
    current: false,
  },
];
import { ethers } from "ethers";

export default function Insured() {
  const { user, Moralis,web3,isWeb3Enabled, enableWeb3 } = useMoralis();
  const [selected, setSelected] = useState("New");

  const [userAddress, setUserAddress] = useState();
  const [policies,setPolicies] = useState([])
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






//Get User Policies
  useEffect(()=>{

    if(user)
    {
    const Policy = Moralis.Object.extend("Policy")
    const query = new Moralis.Query(Policy)
    query.equalTo("owner",user.get("ethAddress"))
    query.descending("createdAt")
    query.include("pet")
    query.find().then((result)=>{
        setPolicies(result)
    })
  }
  },[user])

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

      const policy_id = document.getElementById("type").value;
      if(policy_id=="choose")
      {
        setDialogType(2) //Error
        setNotificationDescription("Please select a policy.")
        setNotificationTitle("Error")
        setShow(true)
      }
      else
       payPremium()
    } else if (step == "3") {

      setStep("2");
    }
  };

  
  async function payPremium() {
    const policy_id = document.getElementById("type").value;

    try {
      const LimeManagerContract = new ethers.Contract(
        LimeManagerAddress,
        LimeManagerABI,
        web3.getSigner()
      );
      //alert(JSON.stringify(myPolicy))
      let transaction = await LimeManagerContract.payPremium(
        policy_id       
      );

      await transaction.wait();
      console.log(transaction);
      setDialogType(1); //Success
      setNotificationTitle("Claim");
      setNotificationDescription("Claim submitted successfully.");
      setShow(true);
      
    } catch (error) {
      setDialogType(2); //Failed
      setNotificationTitle("Claim Submission Failed");
      setNotificationDescription(
        error.data ? error.data.message : error.message
      );

      setShow(true);
    }
  }

  return (
    <main className="flex w-full flex-1 h-full flex-col items-center justify-center px-20 text-center">
      {/*  MAKE CLAIM  */}
      <div hidden={step != "1"} className="w-full ">
        <div className="w-full flex items-center justify-center">
          <div className="flex flex-col w-6/12 items-center justify-center">
            <div className="mt-6 flex  flex-col items-center h-80 justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
              <div>
                <h3 className="text-4xl font-bold tracking-wide ">
                  Make a payment
                </h3>
                <p className="text-2xl tracking-wide">
                  on your pet insurance policy
                </p>
              </div>
              <button
                onClick={handleStep}
                className="flex flex-col items-center font-semibold justify-center w-40 h-12 bg-black text-white rounded-full"
              >
                Pay
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
              <nav
                className={`rounded-full font-bold ring-2  ring-black flex flex-row items-cennter justify-between w-3/12`}
              >
                {/* {navigation.map((item, id) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      setSelected(item.name);
                    }}
                    className={` ${
                      selected == "Past" ? "bg-black" : "bg-white"
                    } flex items-center justify-center px-2 w-6/12 bg-black text-white rounded-full`}
                  >
                    {item.name}
                  </a>
                ))} */}
                <div className="flex items-center px-2 justify-center w-6/12 py-1 text-black rounded-full">
                  <button
                    onClick={() => {
                      setSelected("New");
                    }}
                    className="px-2 rounded-full"
                  >
                    New
                  </button>
                </div>
                <div className="flex items-center justify-center px-2 w-6/12 bg-black text-white rounded-full">
                  <button
                    onClick={() => {
                      setSelected("Past");
                    }}
                    className="px-2 rounded-full"
                  >
                    Past
                  </button>
                </div>
              </nav>
              {selected == "Past" ? (
                <div className="w-full">
                  <Past  />
                </div>
              ) : (
                <div className="w-full">
                  <div className="w-full flex items-center justify-center">
                    <div className="flex flex-col w-6/12 items-center justify-center">
                      <div className="mt-6 flex  flex-col items-center justify-around py-8  rounded-xl sm:w-full">
                        <div className="flex flex-col space-y-8 w-full items-center justify-center">
                          <h3 className="text-4xl font-bold tracking-wide whitespace-nowrap">
                            Select the policy you would like to pay
                          </h3>
                          <select
                            id="type"
                            name="type"
                            className="text-2xl rounded-full tracking-wide"
                          >
                            <option value="choose">Please select a policy</option>
                            {policies.map((policy)=> (       
                               <option value={policy.id}>{`${policy.get("pet").get("name")} - ${policy.get("premium")}`}</option>
                            ))}
                           
                          </select>
                          <button
                            onClick={handleStep}
                            className="flex flex-col items-center font-semibold justify-center w-40 h-12 bg-black text-white rounded-full"
                          >
                            Pay Premium
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

     
      <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
    </main>
  );
}
