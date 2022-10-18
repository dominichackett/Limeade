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
