import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Start from "./Start";
import Name from "./Name";
import Type from "./Type";
import AgeNGender from "./AgeNGender";
import Breed from "./Breed";
import Ownership from "./Ownership";
import Head from "./MedicalHistory/Head";
import Stomache from "./MedicalHistory/Stomache";
import Leg from "./MedicalHistory/Leg";
import Parasites from "./MedicalHistory/Parasites";
import Chronics from "./MedicalHistory/Chronics";
import Summary from "./Summary";
import Overview from "../Overview";

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
    } else if (step == "10") {
      setStep("11");
    } else if (step == "11") {
      setStep("12");
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

  // STEP 9 HANDLE LEG & LIMBS

  const [leg, setLeg] = useState();
  const [limb, setLimb] = useState();
  const [injury, setInjury] = useState();

  const handleLeg = (l) => {
    setLeg(l);
  };
  const handleLimb = (lim) => {
    setLimb(lim);
  };
  const handleInjury = (inj) => {
    setInjury(inj);
  };

  // STEP 10 PARASITES

  const [gia, setGia] = useState();
  const [fleas, setFleas] = useState();
  const [mites, setMites] = useState();

  const handleGia = (gia) => {
    setGia(gia);
  };
  const handleFlea = (flea) => {
    setFleas(flea);
  };
  const handleMites = (mites) => {
    setMites(mites);
  };

  //   STEP 11 CHRONICS
  const [allergies, setAllergies] = useState();
  const [diabetes, setDiabetes] = useState();
  const [cancer, setCancer] = useState();
  const [kidneys, setKidneys] = useState();
  const handleAllergies = (all) => {
    setAllergies(all);
  };

  const handleDiabetes = (diab) => {
    setDiabetes(diab);
  };

  const handleCancer = (canc) => {
    setCancer(canc);
  };

  const handleKidneys = (kid) => {
    setKidneys(kid);
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
        {/* LASTLY HEALTH ISSUES - LEG / LIMB */}
        <div hidden={step != "9"} className="w-9/12">
          <Leg
            title={`And lastly...`}
            petName={petName}
            handleStep={handleStep}
            handleLeg={handleLeg}
            handleLimb={handleLimb}
            handleInjury={handleInjury}
          />
        </div>
        {/* LASTLY HEALTH ISSUES - PARASITES */}
        <div hidden={step != "10"} className="w-9/12">
          <Parasites
            title={`And lastly...`}
            petName={petName}
            handleStep={handleStep}
            handleGia={handleGia}
            handleFlea={handleFlea}
            handleMites={handleMites}
          />
        </div>
        <div hidden={step != "11"} className="w-9/12">
          <Chronics
            title={`And lastly...`}
            petName={petName}
            handleStep={handleStep}
            handleAllergies={handleAllergies}
            handleDiabetes={handleDiabetes}
            handleCancer={handleCancer}
            handleKidneys={handleKidneys}
          />
        </div>
        <div hidden={step != "12"} className="w-9/12">
          <Summary
            title={`Thanks!`}
            petName={petName}
            petGender={petGender}
            petAge={petAge}
            petBreed={petBreed}
            medicalHistory={"None"}
            handleStep={handleStep}
          />
        </div>
        {/* <div hidden={step != "13"} className="w-9/12">
          <Overview
            title={Title}
            petName={petName}
            petGender={petGender}
            petAge={petAge}
            petBreed={petBreed}
            medicalHistory={"None"}
            handleStep={handleStep}
          />
        </div> */}
      </div>
    </main>
  );
}
