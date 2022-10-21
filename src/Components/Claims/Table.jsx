const claims = [
  {
    id: 1,
    name: "001",
    date: "3/10/2022",
    description: "Neuter procedure",
    status: "Pending",
    price: "$40",
    isCurrent: false,
  },
  {
    id: 2,
    name: "002",
    date: "20/10/2022",
    description: "Anti-flea medication",
    status: "Approved",
    price: "$80",
    isCurrent: false,
  },
  {
    id: 3,
    name: "002",
    date: "20/10/2022",
    description: "Anti-flea medication",
    status: "Denied",
    price: "$80",
    isCurrent: false,
  },
  {
    id: 4,
    name: "002",
    date: "20/10/2022",
    description: "Anti-flea medication",
    status: "Denied",
    price: "$80",
    isCurrent: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 w-full">
      <div className="sm:flex sm:items-center"></div>
      <div className="-mx-4 mt-10 ring-1 ring-black sm:-mx-6 md:mx-0 md:rounded-lg">
        <table className="min-w-full divide-y divide-black">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Claim ID
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Date
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Description
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Claim
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Select</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {claims.map((plan, planIdx) => (
              <tr key={plan.id}>
                <td
                  className={classNames(
                    planIdx === 0 ? "" : "border-t border-transparent",
                    "relative py-4 pl-4 sm:pl-6 pr-3 text-sm"
                  )}
                >
                  <div className="font-medium text-gray-900">
                    {plan.name}
                    {plan.isCurrent ? (
                      <span className="ml-1 text-indigo-600">
                        (Current Plan)
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 flex flex-col text-gray-500 sm:block lg:hidden">
                    <span>
                      {plan.date} / {plan.description}
                    </span>
                    <span className="hidden sm:inline">·</span>
                    <span>{plan.status}</span>
                  </div>
                  {planIdx !== 0 ? (
                    <div className="absolute right-0 left-6 -top-px h-px bg-black" />
                  ) : null}
                </td>
                <td
                  className={classNames(
                    planIdx === 0 ? "" : "border-t border-black",
                    "hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                  )}
                >
                  {plan.date}
                </td>
                <td
                  className={classNames(
                    planIdx === 0 ? "" : "border-t border-black",
                    "hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                  )}
                >
                  {plan.description}
                </td>
                <td
                  className={classNames(
                    planIdx === 0 ? "" : "border-t border-black",
                    "hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell"
                  )}
                >
                  {plan.status}
                </td>
                {/* <td
                  className={classNames(
                    planIdx === 0 ? "" : "border-t border-gray-200",
                    "px-3 py-3.5 text-sm text-gray-500"
                  )}
                >
                  <div className="sm:hidden">{plan.price}/mo</div>
                  <div className="hidden sm:block">{plan.price}/month</div>
                </td> */}
                <td
                  className={classNames(
                    planIdx === 0 ? "" : "border-t border-transparent",
                    "relative py-3.5 pl-3  text-right text-sm font-medium"
                  )}
                >
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border hover:border-gray-300 text-white bg-black px-3 py-2 text-sm font-medium leading-4  shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white disabled:cursor-not-allowed disabled:opacity-30"
                    disabled={plan.isCurrent}
                  >
                    Claim funds<span className="sr-only">, {plan.name}</span>
                  </button>
                  {planIdx !== 0 ? (
                    <div className="absolute right-1 left-0 -top-px h-px bg-black" />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
