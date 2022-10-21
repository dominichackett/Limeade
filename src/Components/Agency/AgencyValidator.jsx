import Image from "next/image";
import { useEffect, useState } from "react";
import { useMoralis, useMoralisFile } from "react-moralis";
import AgencyTable from "../Agency/AgencyTable";
import ClaimValidation from "../Agency/ClaimValidation";

export default function PetForm() {
  const { user, Moralis, isAuthenticated } = useMoralis();
  const { saveFile } = useMoralisFile();

  const [polygonIdAuthenticated, setPolygonIdAuthenticated] = useState(true);

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

  function handleValidation() {
    // logicxxx
  }

  return (
    <main className="flex w-full flex-1 h-full flex-col items-center justify-center px-20 text-center">
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
                  get rewarded for validating claims
                </p>
              </div>
              <div className="w-full">
                <ClaimValidation />
              </div>
              <div className="flex flex-row items-center justify-between w-6/12">
                <button
                  onClick={handleValidation}
                  className="flex flex-col items-center font-semibold justify-center w-40 h-12 bg-black text-white rounded-full"
                >
                  Validate
                </button>
                <button
                  onClick={handleValidation}
                  className="flex flex-col items-center font-semibold justify-center w-40 h-12 bg-black text-white rounded-full"
                >
                  Deny
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
