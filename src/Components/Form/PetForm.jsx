import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Start from "./Start";
import Name from "./Name";
import Type from "./Type";
import AgeNGender from "./AgeNGender";
import Breed from "./Breed";
import Ownership from "./Ownership";
import Head from "./Head";
import Stomache from "./Stomache";

export default function PetForm() {
  const { user } = useMoralis();

  const [userAddress, setUserAddress] = useState();
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

  //   LOOPING THRU STEPS
  const [step, setStep] = useState("1");

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

  //   STEP 2 HANDLER - NAME
  const [petName, setPetName] = useState();
  const handleName = (name) => {
    setPetName(name);
  };

  //   STEP 3 HANDLER - TYPE
  const [petType, setPetType] = useState();
  const handleType = (type) => {
    setPetType(type);
  };

  //   STEP 4 HANDLER - AGE & GENDER
  const [petAge, setPetAge] = useState();
  const [petGender, setPetGender] = useState();
  const handleAge = (age) => {
    setPetAge(age);
  };
  const handleGender = (gender) => {
    setPetGender(gender);
  };

  //   STEP 5 HANDLER - BREED

  const [petBreed, setPetBreed] = useState();
  const handleBreed = (breed) => {
    setPetBreed(breed);
  };

  // STEP 6 HANDLER - OWNERSHIP

  const [petOwnership, setPetOwnership] = useState();
  const handleOwnership = (ownership) => {
    setPetOwnership(ownership);
  };

  // STEP 7 HANDLE HEAD ISSUES

  const [eye, setEye] = useState();
  const [cough, setCough] = useState();
  const [ear, setEar] = useState();

  const handleEye = (eye) => {
    setEye(eye);
  };
  const handleEar = (ear) => {
    setEar(ear);
  };
  const handleCough = (cough) => {
    setCough(cough);
  };

  //   STEP 8 HANDLE STOMACHE ISSUES
  const [diarrhea, setDiarrhea] = useState();
  const [urinary, setUrinary] = useState();
  const handleDiarrhea = (diarr) => {
    setDiarrhea(diarr);
  };
  const handleUrinary = (urin) => {
    setUrinary(urin);
  };

  return (
    <main className="flex w-9/12 flex-1 h-full flex-col items-center justify-center px-20 text-center">
      {/*  GET STARTED  */}
      <div className="flex flex-col w-full items-center">
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
        {/* TYPE INPUT */}
        <div hidden={step != "3"} className="w-9/12">
          <Type
            title={`Very cute, ${petName}!`}
            handleStep={handleStep}
            handleType={handleType}
          />
        </div>
        {/* AGE & GENDER */}
        <div hidden={step != "4"} className="w-9/12">
          <AgeNGender
            title={`Tell me more about ${petName}...`}
            handleStep={handleStep}
            handleAge={handleAge}
            handleGender={handleGender}
          />
        </div>
        {/* BREED */}
        <div hidden={step != "5"} className="w-9/12">
          <Breed
            title={`Just a few more Questions...`}
            petName={petName}
            handleStep={handleStep}
            handleBreed={handleBreed}
          />
        </div>
        {/* LENGTH OF OWNERSHIP */}
        <div hidden={step != "6"} className="w-9/12">
          <Ownership
            title={`Almost done...`}
            petName={petName}
            handleStep={handleStep}
            handleOwnership={handleOwnership}
          />
        </div>
        {/* LASTLY HEALTH ISSUES - HEAD */}
        <div hidden={step != "7"} className="w-9/12">
          <Head
            title={`And lastly...`}
            petName={petName}
            handleStep={handleStep}
            handleEye={handleEye}
            handleCough={handleCough}
            handleEar={handleEar}
          />
        </div>
        {/* LASTLY HEALTH ISSUES - STOMACHE */}
        <div hidden={step != "8"} className="w-9/12">
          <Stomache
            title={`And lastly...`}
            petName={petName}
            handleStep={handleStep}
            handleDiarrhea={handleDiarrhea}
            handleUrinary={handleUrinary}
          />
        </div>
      </div>
    </main>
  );
}
