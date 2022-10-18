export default function Summary(props) {
  function nextStep() {
    //  get quote and move on
    props.handleStep("1");
  }
  return (
    <main className="flex w-full flex-1 h-full flex-col items-center justify-center px-20 text-center">
      <h1 className="text-4xl tracking-widest absolute left-80 top-52 whitespace-nowrap">
        {props.title}
      </h1>
      <div className="mt-6 flex  flex-col items-center h-80 w-full justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
        <h3 className="text-3xl font-bold">
          Here's a summary of {props.petName}'s information
        </h3>
        <div className="flex flex-col items-center justify-start ">
          <p>Name</p>
          <p>{props.petName}</p>
        </div>
        <div className="flex flex-col items-center justify-start ">
          <p>Gender</p>
          <p>{props.petGender}</p>
        </div>
        <div className="flex flex-col items-center justify-start ">
          <p>Age</p>
          <p>{props.petAge} Years old</p>
        </div>
        <div className="flex flex-col items-center justify-start ">
          <p>Breed</p>
          <p>{props.petBreed}</p>
        </div>
        <div className="flex flex-col items-center justify-start ">
          <p>Medical History</p>
          <p>{props.medicalHistory}</p>
        </div>

        <button
          onClick={nextStep}
          className="flex flex-col items-center justify-center w-40 h-12 bg-black text-white rounded-full"
        >
          Get My Quote
        </button>
      </div>
    </main>
  );
}
