import React, { useEffect, useState } from "react";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { API_BASE_URL } from "../data/data";

const CompanyProfile = () => {
  const [companyName, setCompanyName] = useState("");
  const [adress, setAdress] = useState("");
  const [steuerNr, setSteuerNr] = useState("");
  const [ustidNumber, setUstidNumber] = useState("");
  const [steuerId, setSteuerId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [companies, setCompanies] = useState([]);

  const Submit = (e) => {
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}/companyName`, {
        companyName,
        adress,
        steuerNr,
        ustidNumber,
        steuerId,
        phoneNumber,
      })
      .then((result) => {
        console.log(result);
        setCompanyName("");
        setAdress("");
        setSteuerNr("");
        setUstidNumber("");
        setSteuerId("");
        setPhoneNumber("");
        setSuccessMessage("Company saved successfully!");
        setErrorMessage("");

        fetchCompanies();
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage("Failed to save company. Please try again.");
        setSuccessMessage("");
      });
  };

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getCompanies`);
      setCompanies(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const deleteCompany = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/companyName/${id}`);
      setCompanies(companies.filter((company) => company._id !== id));
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };
  return (
    <div className="flex justify-center w-full">
      <div className="flex justify-center  w-full">
        <form
          onSubmit={Submit}
          className="m-2  pr-2 pl-2 pt-2 w-full h-full border pb-4 rounded-md shadow-md bg-backgroundColor"
        >
          <div className="flex flex-col mb-4">
            <label htmlFor="companyName" className="mb-2 text-gray-700">
              Company Name:
            </label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
              placeholder="Company Name"
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="address" className="mb-2 text-gray-700">
                Address:
              </label>
              <input
                id="address"
                type="text"
                value={adress}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Address"
                onChange={(e) => setAdress(e.target.value)}
              />
            </div>
            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="steuerNr" className="mb-2 text-gray-700">
                Steuer Nr:
              </label>
              <input
                id="steuerNr"
                type="text"
                value={steuerNr}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Steuer Nr"
                onChange={(e) => setSteuerNr(e.target.value)}
              />
            </div>
          </div>

          <div className="flex ">
            <div className="flex flex-col mb-1 w-full ">
              <label htmlFor="number" className="mb-2 text-gray-700">
                Number:
              </label>
              <PhoneInputWithCountrySelect
                id="number"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Enter phone Number"
                value={phoneNumber} // Set phone number value
                onChange={(newValue) => {
                  setPhoneNumber(newValue); // Update local state
                  // Update parent state
                }}
                defaultCountry="DE"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="ustIdNr" className="mb-2 text-gray-700">
                Ust-idNr:
              </label>
              <input
                id="ustIdNr"
                type="text"
                value={ustidNumber}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Ust-idNr"
                onChange={(e) => setUstidNumber(e.target.value)}
              />
            </div>

            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="steuerId" className="mb-2 text-gray-700">
                Steuer ID:
              </label>
              <input
                id="steuerId"
                type="text"
                value={steuerId}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Steuer ID"
                onChange={(e) => setSteuerId(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col justify-end mb-1 mr-2">
            <button
              type="submit"
              className="lg:bg-backgroundButton pt-2 pb-2 py-6 px-6 mb-4 mt-4 text-textColorButton hover:bg-[#2e85c5] float-right border rounded-lg !important sm:rounded-sm"
              style={{ borderRadius: "5px" }}
            >
              Add Company
            </button>
          </div>
        </form>
      </div>
      <div className="flex place-center justify-center  w-full">
        <div className="m-2  pr-2 pl-2 pt-2 w-[380px] h-full border pb-4 rounded-md shadow-md bg-backgroundColor">
          <div className="py-1 px-3 mb-4 bg-backgroundColorAll rounded-md ">
            Company List
          </div>
          <ul className="flex flex-col">
            {companies.map((company) => (
              <div
                key={company._id}
                className="flex justify-between items-center py-1 px-3 border-b hover:bg-hoverColor"
              >
                <Link to="#" className="flex-grow">
                  {company.companyName}
                </Link>
                <button
                  onClick={() => deleteCompany(company._id)}
                  className="ml-2"
                >
                  <MdDeleteForever className="hover:text-red-500" />
                </button>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
