import React, { useEffect, useState } from "react";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import SaveandPrintButton from "./SaveandPrintButton";
import CancelButton from "./CancelButton";
import NeuArtikelButton from "./NeuArtikelButton";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import clsx from "clsx";
import { API_BASE_URL } from "../data/data";
import {
  Listbox
} from "@headlessui/react";
import { IoIosArrowDropdown } from "react-icons/io";

const SafetyFormPage = ({
  onCompanyNameChange,
  dateGutschrift,
  formDataArray,
  onCompanyDetailsChange,
  onAdd,
  companyName,
  ondateInvoiceChange,
  onUstIdNrChange,
  onRechnungNrChange,
  rechnungNr,
  koment,
  kundenumer,
  onTitelKomentChange,
  titelKoment,
  onKundeChange,
  onKomentChange,
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
  const [material, setMaterial] = useState("");
  const [menge, setMenge] = useState("");
  const [kgpries, setKgpries] = useState("");
  const [gesamt, setgesamt] = useState("");
  const [baustelle, setBaustelle] = useState("");
  

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

  const handleToSave = async () => {
    console.log('RechnungNr:', rechnungNr);
    console.log("companyName:", companyName);
    const gutschriftData = {
      companyName,
      dateGutschrift,
      ustIdNr,
      selectedCompanyDetails,
      formDataArray,
      rechnungNr,
      koment,
      titelKoment,
      kundenumer,
    };
  
    // Log the data to verify structure
    console.log("Sending invoiceData:", gutschriftData);
    console.log('companyName:',companyName);
    try {
      const response = await axios.post(`${API_BASE_URL}/savedGutschrift`, gutschriftData);
      console.log('Invoice saved:', response.data);
      
      handlePrint();
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  }

  const handlePrint = () => {
    const printContents = document.getElementById('previewInvoice')?.innerHTML;
    if (!printContents) {
      console.error('Element with ID "previewInvoice" not found.');
      return;
    }
  
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      console.error('Failed to open a new window. Please check your browser settings.');
      return;
    }
  
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules).map(rule => rule.cssText).join('\n');
        } catch (e) {
          console.error('Could not access stylesheet', styleSheet);
          return '';
        }
      })
      .join('\n');
  
    newWindow.document.write(`
      <html>
        <head>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            body { font-family: Arial, sans-serif; }
            #previewInvoice { width: 599px; background-color: #f9f9f9; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin: 10px; padding: 20px; }
            .no-print { display: none !important; }
            ${styles}
          </style>
        </head>
        <body>
          <div class="invoice">${printContents}</div>
        </body>
      </html>
    `);
  
    newWindow.document.close();
    newWindow.focus();
  
    setTimeout(() => {
      newWindow.print();
      newWindow.close();
    }, 100);
  };

  
 

  useEffect(() => {
    fetchCompanies();
    getDetailsCompany();
  }, []);

  useEffect(() => {
    // Replace commas with periods to ensure the value is parsed correctly
    const quantity = parseFloat(menge.replace(',', '.'));
    const unitPrice = parseFloat(kgpries.replace(',', '.'));
  
    // Log the parsed values for debugging
    console.log('Parsed Menge:', quantity);
    console.log('Parsed Enzielprise:', unitPrice);
  
    // Check if the parsed values are valid numbers
    if (!isNaN(quantity) && !isNaN(unitPrice)) {
      const total = quantity * unitPrice;
      setgesamt(total.toFixed(2)); // Rounds to 2 decimal places
    } else {
      console.error('Invalid values:', menge, kgpries);
    }
  }, [menge, kgpries]);
  
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!postArtikle || !material || !menge || !kgpries || !baustelle) {
      alert("Please fill out all fields");

      console.log(formDataArray);
      return;
    }

    const formData = {
      postArtikle,
      material,
      menge,
      kgpries,
      gesamt,
      baustelle,
    };
    onAdd(formData);
    setPostArtikle((prevPostArtikle) => prevPostArtikle + 1);
    setMaterial("");
    setMenge("");
    setKgpries("");
    setgesamt("");
    setBaustelle("");
  };

  console.log('RechnungNr:',rechnungNr);

  if (loading) return <p>Loading companies...</p>;
  if (error) return <p>Error fetching companies: {error}</p>;

  return (
    <div className="w-1/2 h-auto shadow-md bg-backgroundColor rounded-lg border-t-[5px] border-gray-400 ">
      <div className="w-[580px] bg-backgroundColor h-auto  mt-2 ml-1 font-manrope ">
        <div className=" pr-2 pl-2 pt-2 w-full h-1/2 border pb-4 rounded-md  bg-backgroundColor ">
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
                
Gutschrifts-Nr:
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
          <div className="flex space-x-4">
            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="kundenumer" className="mb-2 text-gray-700">
              Kunden-Nr:
              </label>
              <input
                id="kundenumer"
                type="text"
                placeholder="Kunden-Nr"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                onChange={(e) => onKundeChange(e.target.value)}
              />
            </div>
            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="titelKoment" className="mb-2 text-gray-700">
                Text:
              </label>
              <input
                id="titelKoment"
                type="text"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Einen Kommentar schrieben"
                onChange={(e) => onTitelKomentChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex space-x-4"></div>
        </div>

        <div className="mt-2 pr-2 pl-2 pt-2 w-[580px] h-1/2 border rounded-md pb-4 bg-backgroundColor">
          <div className="flex flex-col mb-1 w-1/1">
            <label htmlFor="material" className="mb-2 text-gray-700">
              Material:
            </label>
            <select
              id="material"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              <option value="Transportkosten">Material</option>
              <option value="Kupferkabel">Kupferkabel</option>
              <option value="Kupferkabel">Kupferkabel</option>
              <option value="Kupferkabel">Kupferkabel</option>
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
                Kg:
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
              <label htmlFor="kgpries" className="mb-2 text-gray-700">
              KG/Preis:
              </label>
              <input
                id="kgpries"
                type="text"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Kg/Preis"
                value={kgpries}
                onChange={(e) => setKgpries(e.target.value)}
              />
            </div>

            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="gesamt" className="mb-2 text-gray-700">
              Gesamt:
              </label>
              <input
                id="gesamt"
                type="text"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Gesamt"
                value={gesamt}
                onChange={(e) => setgesamt(e.target.value)}
              />
            </div>
          </div>
          <div className="flex ">
            <div className="flex flex-col mb-1 w-full">
              <label htmlFor="baustelle" className="mb-2 text-gray-700">
              Baustelle:
              </label>
              <input
                id="baustelle"
                type="text"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Baustelle"
                value={baustelle}
                onChange={(e) => setBaustelle(e.target.value)}
              />
            </div>

            
          </div>
          <NeuArtikelButton handleSubmit={handleSubmit} />
          <div className="flex flex-col mb-1 w-full">
              <label htmlFor="koment" className="mb-2 text-gray-700">
              Koment:
              </label>
              <input
                id="koment"
                type="text"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Einen Kommentar schreiben"
                value={koment}
                onChange={(e) => onKomentChange(e.target.value)}
              />
            </div>
        </div>
        
        <div className="flex justify-end gap-5 ">
          <CancelButton />
          <button
          type="submit"
          className="lg:bg-backgroundButton pt-2 pb-2 py-6 px-6 mb-4 mt-4 text-textColorButton hover:bg-[#2e85c5] hover:text-white float-right border rounded-md mr-2"
          onClick={handleToSave}
            ustIdNr={ustIdNr}
            rechnungNr={rechnungNr}
            dateGutschrift={dateGutschrift}
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
          > Save and Print </button>
        </div>
      </div>
    </div>
  );
};

export default SafetyFormPage;
