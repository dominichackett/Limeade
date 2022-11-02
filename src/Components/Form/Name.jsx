import { useState } from "react";
import Notification from "../Notification/Notification";
export default function Name(props) {
  function nextStep() {
    const petName = document.getElementById("petName").value;
    if(petName == "" || petName ==undefined)
    {
       setDialogType(2) //Error
       setNotificationTitle("Error")
       setNotificationDescription("Please enter pet's name")
       setShow(true)
       return
    }

    props.handleName(petName);
    props.handleStep("3");
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
        <h3 className="text-3xl font-bold">What's your pets name?</h3>
        <input
          className="rounded-xl tracking-wider"
          placeholder="name"
          type="text"
          name="petName"
          id="petName"
        />

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
