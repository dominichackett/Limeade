export default function Leg(props) {
  function nextStep() {
    const leg = document.querySelector('input[name="leg"]:checked')?.value;
    const limb = document.querySelector('input[name="limb"]:checked')?.value;
    const injury = document.querySelector(
      'input[name="injury"]:checked'
    )?.value;
    let legInjury = { leg: leg, limb: limb, injury: injury };
    props.handleLeg(legInjury);
    props.handleStep("9");
  }
  return (
    <main className="mb-6 flex w-full flex-1 h-full flex-col items-center justify-center px-20 text-center">
      <h1 className="text-4xl tracking-widest  whitespace-nowrap md:top-20">
        {props.title}
      </h1>
      <div className="mt-6 flex  flex-col items-center h-96 w-full justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
        <h3 className="text-3xl font-bold">
          Has {props.petName} had any of these issues?
        </h3>
        <p className="text-xl tracking-wider">Limb/Leg Issues</p>
        <div className="rounded-xl flex flex-col items-center space-y-2 ">
          <div className="flex flex-row items-center justify-between px-8 bg-white w-full rounded-xl p-2 space-x-4 ring-1 ring-gray-600">
            <input type="radio" name="leg" value="leg" />
            <p>Broken leg</p>
          </div>
          <div className="flex flex-row items-center justify-between px-8 bg-white w-full rounded-xl p-2 space-x-4 ring-1 ring-gray-600">
            <input type="radio" name="limb" value="limb" />
            <p>Lameless of limb(s)</p>
          </div>
          <div className="flex flex-row items-center justify-between px-8 bg-white w-full rounded-xl p-2 space-x-4 ring-1 ring-gray-600">
            <input type="radio" name="injury" value="injury" />
            <p>Soft tissue injury</p>
          </div>
        </div>

        <button
          onClick={nextStep}
          className="flex flex-col items-center justify-center w-40 h-10 bg-black text-white rounded-full"
        >
          Next
        </button>
      </div>
    </main>
  );
}
