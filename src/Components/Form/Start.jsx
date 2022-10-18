export default function Start(props) {
  function nextStep() {
    props.handleStep("2");
  }
  return (
    <main className="flex w-full flex-1 h-full flex-col items-center justify-center px-20 text-center">
      <h1 className="text-4xl tracking-widest absolute left-80 top-52 whitespace-nowrap">
        {props.title}
      </h1>
      <div className="mt-6 flex  flex-col items-center h-80 w-full justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
        <h3 className="text-3xl font-bold tracking-wide ">PET INSURANCE</h3>
        <p className="text-xl -mt-6 tracking-wider">for cats & dogs</p>
        <p className="text-2xl tracking-wide">
          Lots of coverage, for little cost
        </p>
        <button
          onClick={nextStep}
          className="flex flex-col items-center justify-center w-40 h-12 bg-black text-white rounded-full"
        >
          Get Started
        </button>
      </div>
    </main>
  );
}
