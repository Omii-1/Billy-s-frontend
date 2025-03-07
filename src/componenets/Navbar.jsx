import React, { useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { authActions } from "../store/auth";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileNav, setMobileNav] = useState("hidden");

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  
  const links = useMemo(() => {
    let updatedLinks = [
      { title: "Home", link: "/" },
      { title: "Login", link: "/signin" },
      { title: "Create", link: "/create" },
      { title: "Logout" },
    ];

    if (!isLoggedIn) {
      return updatedLinks.slice(0, 2); // Show Home and Login only
    }

    if (isLoggedIn && role === "user") {
      return [updatedLinks[0], updatedLinks[3]]; // Show Home and Logout
    }

    if (isLoggedIn && role === "admin") {
      return updatedLinks.filter((item) => item.title !== "Login"); // Remove Login for admin
    }

    return updatedLinks;
  }, [isLoggedIn, role]);

  // Logout handler
  const handleOnClick = async (title) => {
    if (title === "Logout") {
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/logout`,
          {},
          { withCredentials: true, headers: { "Content-Type": "application/json" } }
        );
        dispatch(authActions.logout()); // Correct action
        dispatch(authActions.changeRole(null));
        navigate("/");
      } catch (error) {
        console.log("Logout error:", error);
      }
    }
  };

  return (
    <>
      <div className="sticky backdrop-blur-md top-0 left-0 flex z-50 mx-auto bg-zinc-800  text-white p-3 sm:py-4 sm:px-8 items-center  justify-between">
        <div className="flex items-center md:w-1/2 lg:w-2/3">
          <Link to="/" className="text-xl sm:text-2xl font-semibold">
            MovieHub
          </Link>
        </div>
        <div className="nav-links-bookheaven flex items-center gap-4 md:w-1/2 lg:w-1/3 ">
          <div className="hidden md:flex w-full justify-around gap-4">
            {links.map((items, i) => (
              <Link
                to={items.link}
                className="hover:text-blue-500 transition-all duration-300 md:text-xl"
                key={i}
                onClick={ () => handleOnClick(items.title) }
              >
                {items.title}
              </Link>
            ))}
          </div>

          <button
            onClick={() =>
              mobileNav === "hidden"
                ? setMobileNav("block")
                : setMobileNav("hidden")
            }
            className="md:hidden hover:text-yellow-100 hover:bg-zinc-700 rounded-full"
          >
            {mobileNav === "hidden" ? (
              <FiMenu className="h-8 w-8" />
            ) : (
              <FiX className="h-8 w-8" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`${mobileNav} fixed top-0 left-0 w-full z-40  backdrop-blur-md text-white text-xl flex flex-col items-center border-b border-zinc-600 pt-24 gap-5 p-4`}
      >
        {links.map((items, i) => (
          <Link
            onClick={() => setMobileNav("hidden")}
            to={items.link}
            className={`hover:text-blue-500 ${mobileNav}  transition-all duration-300`}
            key={i}
          >
            {items.title}
          </Link>
        ))}
      </div>
    </>
  );
}

export default Navbar;
