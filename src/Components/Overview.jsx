import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

export default function Start(props) {
  const { Moralis, user } = useMoralis();
  const [userAddress, setUserAddress] = useState();
  const [pet, setPet] = useState([]);
  const router = useRouter();

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
    const Pet = new Moralis.Object.extend("Pet");
    const query = new Moralis.Query(Pet);
    // query.equalTo("owner", user.get("ethAddress"));
    query.find().then((result) => {
      setPet(result);
      console.log(result);
    });
  }, [user]);

  function nextStep() {
    props.handleStep("2");
  }
  return (
    <main className="flex w-full flex-1 h-full flex-col items-center justify-center px-20 text-center">
      <h1 className="text-4xl tracking-widest absolute left-80 top-52 whitespace-nowrap">
        Welcome, {userAddress}
      </h1>
      <div className="flex flex-row items-center mt-16 justify-evenly w-9/12 space-x-8">
        <div className="mt-6 flex  flex-col items-center h-80 w-full justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="flex flex-col items-center justify-start ">
              <p className="text-xl">Name</p>
              <p className="text-base font-bold">{}</p>
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
              <p className="text-xl">Medical History</p>
              <p className="text-base font-bold">{props.medicalHistory}</p>
            </div>
          </div>
        </div>
        {/* ADD ANOTHER PET */}

        <div className="mt-6 flex  flex-col items-center h-80 w-full justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
          <h3 className="text-3xl font-bold tracking-wide ">PET INSURANCE</h3>
          <p className="text-xl -mt-6 tracking-wider">for cats & dogs</p>
          <p className="text-2xl tracking-wide">Add another one of your pets</p>
          <button
            onClick={() => {
              router.push("/");
            }}
            className="flex flex-col items-center justify-center w-40 h-12 bg-black text-white rounded-full"
          >
            Add Pet
          </button>
        </div>
      </div>
    </main>
  );
}
