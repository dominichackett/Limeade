import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Start from "./Start";
import Name from "./Name";
import Type from "./Type";

export default function PetForm() {
  const { user } = useMoralis();

  const [userAddress, setUserAddress] = useState();
  const [step, setStep] = useState("1");
  const Title = "Welcome, " + userAddress;

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

  const handleStep = () => {
    if (step == "1") {
      setStep("2");
    } else if (step == "2") {
      setStep("3");
    } else if (step == "3") {
      setStep("4");
    } else if (step == "4") {
      setStep("5");
    } else if (step == "5") {
      setStep("6");
    } else if (step == "6") {
      setStep("7");
    } else if (step == "7") {
      setStep("8");
    } else if (step == "8") {
      setStep("9");
    } else if (step == "9") {
      setStep("10");
    } else {
      setStep("1");
    }
  };

  const [petName, setPetName] = useState();
  const handleName = (petName) => {
    setPetName(petName);
  };

  return (
    <main className="flex w-9/12 flex-1 h-full flex-col items-center justify-center px-20 text-center">
      {/*  GET STARTED  */}
      <div className="flex flex-col w-9/12 items-center">
        <div hidden={step != "1"} className="w-9/12">
          <Start title={Title} handleStep={handleStep} />
        </div>
        {/* NAME INPUT */}
        <div hidden={step != "2"} className="w-9/12">
          <Name
            title={"Let's get started..."}
            handleStep={handleStep}
            handleName={handleName}
          />
        </div>
        {/* NAME INPUT */}
        <div hidden={step != "3"} className="w-9/12">
          <Type title={`Very cute, ${petName}!`} handleStep={handleStep} />
        </div>
      </div>
    </main>
  );
}
