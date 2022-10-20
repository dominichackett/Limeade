export default function Chronics(props) {
  function nextStep() {
    const allergies = document.querySelector(
      'input[name="allergies"]:checked'
    ).value;
    const diabetes = document.querySelector(
      'input[name="diabetes"]:checked'
    ).value;
    const cancer = document.querySelector('input[name="cancer"]:checked').value;
    const kidneydiease = document.querySelector(
      'input[name="kidneydisease"]:checked'
    ).value;
    props.handleAllergies(allergies);
    props.handleDiabetes(diabetes);
    props.handleCancer(cancer);
    props.handleKidneys(kidneydiease);
    props.handleStep("11");
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
        <p className="text-xl tracking-wider">Chronic Issues</p>
        <div className="rounded-xl flex flex-col items-center space-y-2 w-4/12">
          <div className="flex flex-row items-center justify-between px-8 bg-white w-full rounded-xl p-2 space-x-4 ring-1 ring-gray-600">
            <input type="radio" name="allergies" value="allergies" />
            <p>Allergies</p>
          </div>
          <div className="flex flex-row items-center justify-between px-8 bg-white w-full rounded-xl p-2 space-x-4 ring-1 ring-gray-600">
            <input type="radio" name="diabetes" value="diabetes" />
            <p>Diabetes</p>
          </div>
          <div className="flex flex-row items-center justify-between px-8 bg-white w-full rounded-xl p-2 space-x-4 ring-1 ring-gray-600">
            <input type="radio" name="cancer" value="cancer" />
            <p>Cancer</p>
          </div>
          <div className="flex flex-row items-center justify-between px-8 bg-white w-full rounded-xl p-2 space-x-4 ring-1 ring-gray-600">
            <input type="radio" name="kidneydisease" value="kidneydisease" />
            <p>Kidney disease</p>
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
