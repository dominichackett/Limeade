import { useState } from "react";
import Notification from "../Notification/Notification";

export default function Breed(props) {
  function nextStep() {
    const breed = document.getElementById("petBreed").value;
    if(breed == "choose")
    {
       setDialogType(2) //Error
       setNotificationTitle("Error")
       setNotificationDescription("Please select pet's breed.")
       setShow(true)
       return
    }
    props.handleBreed(breed);
    props.handleStep("6");
  }
   //  NOTIFICATION STATES & FUNCTIONS
 const [show, setShow] = useState(false);
 const [notificationTitle, setNotificationTitle] = useState();
 const [notificationDescription, setNotificationDescription] = useState();
 const [dialogType, setDialogType] = useState(1);
 const close = async () => {
   setShow(false);
 };
  return (
    <main className="flex w-full flex-1 h-full flex-col items-center justify-center px-20 text-center">
      <h1 className="text-4xl tracking-widest absolute left-80 top-52 whitespace-nowrap md:top-20">
        {props.title}
      </h1>
      <div className="mt-6 flex  flex-col items-center h-80 w-full justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
        <h3 className="text-3xl font-bold">What breed is {props.petName}?</h3>
        <select name="petBreed" id="petBreed" className="rounded-xl w-4/12">
          <option value="choose">Choose Breed</option>
          <option value="Pure">Pure Breed</option>
          <option value="Mixed">Mixed Breed</option>
        </select>

        <button
          onClick={nextStep}
          className="flex flex-col items-center justify-center w-40 h-12 bg-black text-white rounded-full"
        >
          Next
        </button>
        <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
      </div>
    </main>
  );
}
