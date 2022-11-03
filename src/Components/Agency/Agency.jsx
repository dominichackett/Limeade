import Image from "next/image";
import { useEffect, useState } from "react";
import { useMoralis, useMoralisFile } from "react-moralis";
import AgencyTable from "../Agency/AgencyTable";

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

  const [userAddress, setUserAddress] = useState();

  const [polygonIdAuthenticated, setPolygonIdAuthenticated] = useState(true);

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

  async function submitProof() {
    // submit proof of claim document to moralis/ipfs database

    const policyType = document.getElementById("type").value;
    const imgProof = document.getElementById("file-upload").files[0];

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

    claim.set("policyType", policyType);
    claim.set("imgProof", ipfsFile);
    claim.save().then(() => {
      handleStep("2");
    });
  }

  return (
    <main className="flex w-full flex-1 h-full flex-col items-center justify-center px-20 text-center">
      {/*  LOGIN W POLYGON ID  */}
      <div hidden={step != "1"} className="w-full ">
        <div className="w-full flex items-center justify-center">
          <div className="flex flex-col w-6/12 items-center justify-center">
            <div className="mt-6 flex  flex-col items-center  justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
              <div>
                <h3 className="text-4xl font-bold tracking-wide ">
                  Sign-in with Polygon ID
                </h3>
                <p className="text-2xl tracking-wide">
                  to begin validating claims
                </p>
              </div>
              <div className="py-4 rounded-xl">
                <Image
                  src={"/img/qrcode.png"}
                  width={200}
                  height={200}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*  OVERVIEW: VALIDATE / DENY APPLICATIONS  */}
      <div hidden={step != "2"} className="w-full">
        <div className="w-full flex items-center justify-center">
          <div className="flex flex-row sm:w-9/12 w-full xl:w-6/12 items-center justify-center">
            <div className="mt-6 flex flex-col items-center justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl ">
              <div>
                <h3 className="text-4xl font-bold tracking-wide ">
                  Claim Records
                </h3>
                <p className="text-2xl tracking-wide">
                  Get rewarded for validating claims
                </p>
              </div>
              <div className="w-full">
                <AgencyTable />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  UPLOAD PROOF OF CLAIM  */}
      <div hidden={step != "3"} className="w-full ">
        <div className="w-full flex items-center justify-center">
          <div className="flex flex-col w-6/12 items-center justify-center">
            <div className="mt-6 flex  flex-col items-center h-80 justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
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
                className="flex flex-col items-center font-semibold justify-center w-40 h-12 bg-black text-white rounded-full"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
