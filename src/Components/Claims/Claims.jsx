import { useEffect, useState } from "react";
import { useMoralis, useMoralisFile } from "react-moralis";
import Past from "./Past";
import Notification from "../Notification/Notification";

const navigation = [
  { name: "New", id: 2, current: false },
  {
    name: "Past",
    id: 1,
    current: true,
  },
];

export default function PetForm() {
  const { user, Moralis, isAuthenticated } = useMoralis();
  const { saveFile } = useMoralisFile();

  const [selected, setSelected] = useState("Past");

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
      setStep("3");
    } else if (step == "3") {

      setStep("2");
    }
  };

  async function submitProof() {
    // submit proof of claim document to moralis/ipfs database

    const policy_id = document.getElementById("type").value;
    const imgProof = document.getElementById("file-upload").files[0];
    const desc= document.getElementById("desc").value;

    if(desc== "" || document.getElementById("file-upload").files <=0)
    {
       setDialogType(2)
       setNotificationDescription("File or Description not given.")
       setNotificationTitle("error")
       setShow(true)
       return
    }

    let ipfsFile = "";

    if (imgProof) {
      console.log("uploading pet photo");
      await saveFile("imgProof", imgProof, { saveIPFS: true }).then(
        async (hash) => {
          ipfsFile = hash._ipfs;
        }
      );
    }

    const Claims = new Moralis.Object.extend("Claims");
    const claim = new Claims();
    const Policy = new Moralis.Object.extend("Policy")
    const policy = new Policy()
    policy.id = policy_id

    claim.set("policy", policy);
    claim.set("imgProof", ipfsFile);
    claim.set("state",0)
    claim.set("description",desc)
    claim.set("owner",user.get("ethAddress"))
    claim.set("dateSubmitted",new Date())
    claim.save().then(() => {
      //handleStep("2");
    });
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
                  <Past />
                </div>
              ) : (
                <div className="w-full">
                  <div className="w-full flex items-center justify-center">
                    <div className="flex flex-col w-6/12 items-center justify-center">
                      <div className="mt-6 flex  flex-col items-center justify-around py-8  rounded-xl sm:w-full">
                        <div className="flex flex-col space-y-8 w-full items-center justify-center">
                          <h3 className="text-4xl font-bold tracking-wide whitespace-nowrap">
                            Select the policy you would like to claim
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
                            Next Step
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

      {/*  UPLOAD PROOF OF CLAIM  */}
      <div hidden={step != "3"} className="w-full ">
        <div className="w-full flex items-center justify-center">
          <div className="flex flex-col w-6/12 items-center justify-center">
            <div className="mt-6 flex  flex-col items-center h-96 justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
              <div>
              <h1 className="text-3xl font-bold mb-4">Description</h1>
        <input
          className="rounded-xl tracking-wider mb-4"
          placeholder="Description"
          type="text"
          name="desc"
          id="desc"
        />
              </div>
              <div>

                <h3 className="text-4xl font-bold tracking-wide ">
                  Upload Proof of Claim
                </h3>
                <div className="py-4">
                  <div className="mt-1">
                    <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md  font-medium text-black-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
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
                        <p className="text-xs text-gray-500">
                          PNG or JPG up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={submitProof}
                className="mb-4 p-4 flex flex-col items-center font-semibold justify-center w-40 h-12 bg-black text-white rounded-full"
              >
                Submit
              </button>
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
