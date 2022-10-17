import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

export default function Header() {
  const { logout, user } = useMoralis();

  const [userAddress, setUserAddress] = useState();

  useEffect(() => {
    if (user) {
      setUserAddress(
        user.get("ethAddress").slice(0, 6).concat("...") +
          user.get("ethAddress").slice(38, 44)
      );
    } else {
      setUserAddress("not logged in");
    }
  });

  return (
    <div className="bg-white pt-6 pb-6">
      <nav
        className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 "
        aria-label="Global"
      >
        <div className="flex flex-1 items-center">
          <div className="flex w-full items-center justify-between md:w-auto">
            <a href="#">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto sm:h-10"
                src="/limeade-screen.png"
                alt=""
              />
            </a>
          </div>
        </div>
        <div className="hidden md:flex md:items-center md:space-x-6">
          <button
            onClick={logout}
            className="inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white hover:bg-gray-700"
          >
            {userAddress}
          </button>
        </div>
      </nav>
    </div>
  );
}
