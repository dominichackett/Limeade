export default function Parasites(props) {
  function nextStep() {
    const gia = document.querySelector('input[name="giardia"]:checked').value;
    const flea = document.querySelector('input[name="fleas"]:checked').value;
    const mites = document.querySelector(
      'input[name="earmites"]:checked'
    ).value;
    props.handleGia(gia);
    props.handleFlea(flea);
    props.handleMites(mites);
    props.handleStep("10");
  }
  return (
    <main className="flex w-full flex-1 h-full flex-col items-center justify-center px-20 text-center">
      <h1 className="text-4xl tracking-widest absolute left-80 top-52 whitespace-nowrap">
        {props.title}
      </h1>
      <div className="mt-6 flex  flex-col items-center h-96 w-full justify-around py-8 bg-[#CAF46F] bg-opacity-70 rounded-xl sm:w-full">
        <h3 className="text-3xl font-bold">
          Has {props.petName} had any of these issues?
        </h3>
        <p className="text-xl tracking-wider">Parasites</p>
        <div className="rounded-xl flex flex-col items-center space-y-2 w-4/12">
          <div className="flex flex-row items-center justify-around bg-white w-full rounded-xl p-2 space-x-4 ring-1 ring-gray-600">
            <input type="radio" name="giardia" value="giardia" />
            <p>Giardia</p>
          </div>
          <div className="flex flex-row items-center justify-around bg-white w-full rounded-xl p-2 space-x-4 ring-1 ring-gray-600">
            <input type="radio" name="fleas" value="fleas" />
            <p>Fleas or Ticks</p>
          </div>
          <div className="flex flex-row items-center justify-around bg-white w-full rounded-xl p-2 space-x-4 ring-1 ring-gray-600">
            <input type="radio" name="earmites" value="earmites" />
            <p>Ear mites</p>
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
