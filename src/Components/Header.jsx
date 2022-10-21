import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

const navigation = [
  { name: "Get Quote", href: "/quotes" },
  { name: "Account", href: "/account" },
  { name: "Claim", href: "/claim" },
  { name: "Liquidity", href: "/liquidity" },
  { name: "Stake", href: "/stake" },
  { name: "Agency", href: "/agency" },
];

export default function Header() {
  const { logout, user, isAuthenticated, authenticate } = useMoralis();

  const [userAddress, setUserAddress] = useState();
  const [isConnected, setIsConnected] = useState(true);

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

  function connectPolygonID() {
    // add logic for polygon id
  }

  function handleClick() {
    if (isAuthenticated) {
      logout();
    } else {
      authenticate();
    }
  }

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
          <div className="ml-16">
            <div className=" flex flex-row px-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="hidden md:flex md:items-center md:space-x-6">
          {isAuthenticated && (
            <button
              onClick={connectPolygonID}
              className="inline-flex items-center justify-center rounded-full border border-transparent bg-black px-4 py-2 text-white hover:bg-gray-700"
            >
              Polygon ID{" "}
              {isConnected ? (
                <CheckCircleIcon className="text-green-500 ml-2 h-5" />
              ) : (
                <ExclamationTriangleIcon className="h-5 ml-2 text-white" />
              )}
            </button>
          )}
          <button
            onClick={handleClick}
            className="inline-flex items-center rounded-full border border-transparent bg-black px-4 py-2 font-medium  text-white hover:bg-gray-700"
          >
            {isAuthenticated ? userAddress : "Login"}
          </button>
        </div>
      </nav>
    </div>
  );
}
