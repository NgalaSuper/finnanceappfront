import React, { useEffect, useState } from "react";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import SaveandPrintButton from "./SaveandPrintButton";
import CancelButton from "./CancelButton";
import NeuArtikelButton from "./NeuArtikelButton";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";
import {
  Listbox
} from "@headlessui/react";
import { IoIosArrowDropdown } from "react-icons/io";
import { API_BASE_URL } from "../data/data";

const InvoiceCompanyForm = ({
  onCompanyNameChange,
  dateInvoice,
  formDataArray,
  onCompanyDetailsChange,
  onAdd,
  ondateInvoiceChange,
  onUstIdNrChange,
  onRechnungNrChange,
  rechnungNr,
  totalNetto,
  ustIdNr,
  calculatedTotalNetto,
  totalWithMwSt,
  calculateTotals,
  invoiceTotals,
  setFormatDataArray,
}) => {
  const [value, setValue] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyDetails, setSelectedCompanyDetails] = useState({});
  // State for selected company

  // Declare state for form fields
  const [postArtikle, setPostArtikle] = useState(1);
  const [bezeinchnung, setBezeinchnung] = useState("");
  const [menge, setMenge] = useState("");
  const [enzielprise, setEnzielprise] = useState("");
  const [netopreis, setNetopreis] = useState("");

  const getDetailsCompany = (companyId) => {
    console.log(`Fetching details for company ID: ${companyId}`); // Log the company ID
    axios
      .get(`${API_BASE_URL}/getCompanies/${companyId}`)
      .then((response) => {
        const companyData = response.data;
        setSelectedCompanyDetails(companyData);
        onCompanyDetailsChange(companyData);
      })
      .catch((error) => {
        console.error("Error fetching company details", error);
      });
  };

  useEffect(() => {
    if (selectedCompany) {
      // Ensure the company is selected
      getDetailsCompany(selectedCompany);
    }
  }, [selectedCompany]);

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
    getDetailsCompany();
  }, []);

  useEffect(() => {
    const quantity = parseFloat(menge) || 0;
    const unitPrice = parseFloat(enzielprise) || 0;
    const total = quantity * unitPrice;
    setNetopreis(total.toFixed(2));
  }, [menge, enzielprise]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!postArtikle || !bezeinchnung || !menge || !enzielprise) {
      alert("Please fill out all fields");

      console.log(formDataArray);
      return;
    }

    const formData = {
      postArtikle,
      bezeinchnung,
      menge,
      enzielprise,
      netopreis,
    };
    onAdd(formData);
    setPostArtikle((prevPostArtikle) => prevPostArtikle + 1);
    setBezeinchnung("");
    setMenge("");
    setEnzielprise("");
    setNetopreis("");
  };

  console.log('RechnungNr:',rechnungNr);

  if (loading) return <p>Loading companies...</p>;
  if (error) return <p>Error fetching companies: {error}</p>;

  return (
    <div className="w-1/2 h-auto shadow-md bg-backgroundColor rounded-lg border-t-[5px] border-gray-400 ">
      <div className="w-[580px] bg-backgroundColor h-auto  mt-2 ml-1 font-manrope ">
        <div className=" pr-2 pl-2 pt-2 w-[580px] h-1/2 border pb-4 rounded-md  bg-backgroundColor">
          <div className="flex mb-4">
            {/* Company Name Dropdown */}
            <div className="flex flex-col w-1/2 mr-4">
              <label htmlFor="companyName" className=" text-gray-700">
                Company Name:
              </label>
              <Listbox
                value={selectedCompany}
                onChange={(value) => {
                  if (value === "addNewCompany") {
                    navigate("/profile");
                  } else {
                    setSelectedCompany(value);
                    onCompanyNameChange(value);
                    console.log("Selected Company:", value);
                  }
                }}
              >
                <Listbox.Button className="relative mt-2 rounded-lg border border-gray-300 bg-white py-2 px-4 text-left">
                  {selectedCompany || "Select Company Name"}
                </Listbox.Button>
                <div className="relative w-full">
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-lg">
                    {companies.map((company) => (
                      <Listbox.Option
                        key={company.id}
                        value={company.companyName}
                        className="cursor-pointer py-2 px-4 hover:bg-hoverColor w-full"
                      >
                        {company.companyName}
                      </Listbox.Option>
                    ))}
                    <Listbox.Option
                      key="addNewCompany"
                      value="addNewCompany"
                      className="cursor-pointer py-2 px-4 hover:bg-hoverColor"
                    >
                      Add New Company
                    </Listbox.Option>
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

            {/* Ust-idNr Input */}
            <div className="flex flex-col w-1/2">
              <label htmlFor="RechnungNr" className="mb-2 text-gray-700">
                Rechnung Nr:
              </label>
              <input
                id="RechnungNr"
                type="text"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Rechnung Number"
                onChange={(e) => onRechnungNrChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="date" className="mb-2 text-gray-700">
                Datum:
              </label>
              <input
                id="date"
                type="date"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                onChange={(e) => ondateInvoiceChange(e.target.value)}
              />
            </div>
            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="ustIdNr" className="mb-2 text-gray-700">
                Ust-idNr:
              </label>
              <input
                id="ustIdNr"
                type="text"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Ust-idNr"
                onChange={(e) => onUstIdNrChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex space-x-4"></div>
        </div>

        <div className="mt-2 pr-2 pl-2 pt-2 w-[580px] h-1/2 border rounded-md pb-4 bg-backgroundColor">
          <div className="flex flex-col mb-1 w-1/1">
            <label htmlFor="bezeinchnung" className="mb-2 text-gray-700">
              Bezeichnung/ Spezifikation:
            </label>
            <select
              id="bezeinchnung"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
              value={bezeinchnung}
              onChange={(e) => setBezeinchnung(e.target.value)}
            >
              <option value="Transportkosten">Transportkosten</option>
              <option value="Bager">Bager</option>
              <option value="Eskevator">Eskevator</option>
              <option value="Transportkosten">Transportkosten</option>
            </select>
          </div>

          <div className="flex space-x-4">
            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="postArtikle" className="mb-2 text-gray-700">
                Pos ArtikelNr:
              </label>
              <input
                id="postArtikle"
                type="number"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Pos ArtikelNr"
                value={postArtikle}
                onChange={(e) => setPostArtikle(e.target.value)}
              />
            </div>

            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="menge" className="mb-2 text-gray-700">
                Menge:
              </label>
              <input
                id="menge"
                type="number"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Menge"
                value={menge}
                onChange={(e) => setMenge(e.target.value)}
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="enzielprise" className="mb-2 text-gray-700">
                Einzelpreise:
              </label>
              <input
                id="enzielprise"
                type="number"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Einzelpreise"
                value={enzielprise}
                onChange={(e) => setEnzielprise(e.target.value)}
              />
            </div>

            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="netopreis" className="mb-2 text-gray-700">
                Nettopreis MWSt:
              </label>
              <input
                id="netopreis"
                type="text"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Nettopreis MWSt"
                value={netopreis}
                onChange={(e) => setNetopreis(e.target.value)}
              />
            </div>
          </div>
          <NeuArtikelButton handleSubmit={handleSubmit} />
        </div>
        <div className="flex justify-end gap-5 ">
          <CancelButton />
          <SaveandPrintButton
            ustIdNr={ustIdNr}
            rechnungNr={rechnungNr}
            dateInvoice={dateInvoice}
            formDataArray={formDataArray}
            totalNetto={totalNetto}
            invoiceTotals={invoiceTotals} // Pass invoiceTotals to SaveandPrintButton
            onSaveAndPrint={() => console.log("Invoice saved and printed!")}
            selectedCompanyDetails={selectedCompanyDetails}
            companyName={
              selectedCompanyDetails ? selectedCompanyDetails.companyName : ""
            }
            calculatedTotalNetto={calculatedTotalNetto} // Pass calculatedTotalNetto
            totalWithMwSt={totalWithMwSt} // Pass totalWithMwSt
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceCompanyForm;
