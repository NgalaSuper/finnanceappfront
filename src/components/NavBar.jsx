import React, { useState } from "react";
import Logo from "../assets/images/Logo1.png";
import { Link } from "react-router-dom";
import { IoSearch } from "react-icons/io5";

const NavBar = ({ setSearch, setSearchTerm, searchTerm }) => {
  console.log('setSearch:',setSearch);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);  // Update the local state on typing
    setSearch(value);  // Pass the value to the parent (Landing component)
  };

  return (
    <nav className="w-screen h-16 bg-backgroundColor lg:flex m-0">
      <div className="w-60 h-16 border-r border-borderColor">
        <Link to="/">
          <img
            src={Logo}
            alt="Logo Company"
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
      <div className="w-full relative outline-none">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <IoSearch className="text-borderColor text-textColorCancel " />
        </span>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          className="w-full h-16 pl-10 pr-3 py-2 border-b border-borderColor bg-backgroundColor outline-none focus:ring-0 focus:outline-none focus:border-transparent"
          onChange={handleChange}  // Update both local and parent state
        />
      </div>
    </nav>
  );
};

export default NavBar;
