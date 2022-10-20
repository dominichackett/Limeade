import { useRouter } from "next/router";
import { useState } from "react";
import { useMoralis, useMoralisFile } from "react-moralis";
import Notification from "../Notification";

export default function Summary(props) {
  const { Moralis, user } = useMoralis();
  const { saveFile } = useMoralisFile();

  const router = useRouter();

  // NOTIFICATIONS functions
  const [notificationTitle, setNotificationTitle] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [dialogType, setDialogType] = useState(1);

  const [show, setShow] = useState(false);

  async function getQuote() {
    // storing variables
    const name = props.petName;
    const gender = props.petGender;
    const age = props.petAge;
    const breed = props.petBreed;
    const medical = props.medicalHistory;
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
    pet.set("medicalHistory", medical);
    pet.set("petImg", ipfsFile);
    pet.save().then(() => {
      // setDialogType(1); //Success
      // setNotificationTitle("Successful");
      // setNotificationDescription("Getting Quote now...");
      // setShow(true);
      router.push("/overview");
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
      <h1 className="text-4xl tracking-widest absolute left-80 top-52 whitespace-nowrap">
        {props.title}
      </h1>
      <div className="mt-6 flex  flex-col items-center h-96 w-full justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
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
            <p className="text-xl">Medical History</p>
            <p className="text-base font-bold">{props.medicalHistory}</p>
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

        <button
          onClick={getQuote}
          className="flex flex-col items-center justify-center w-40 h-12 bg-black text-white rounded-full"
        >
          Get quote
        </button>
      </div>
    </main>
  );
}
