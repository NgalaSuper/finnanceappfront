import React, { useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CancelButton from "./CancelButton";

import NeuArtikelButton from "./NeuArtikelButton";
import { API_BASE_URL } from "../data/data";

const TransportForm = ({
  onCompanyNameChange,
  dateGutschrift,
  formDataArray,
  onCompanyDetailsChange,
  onAdd,
  companyName,
  ondateInvoiceChange,
  onSpedituerChange,
  onRechnungNrChange,
  rechnungNr,
  spediteur,
  spedituer,
  baustelle,
  lieferant,
  dateLieferant,
  onLieferantChange,
  leiferant,
  onBaustelleChange,
  onGewichtChange,
  onKomentChange,
  totalNetto,
  ustIdNr,

  calculatedTotalNetto,
  totalWithMwSt,
  calculateTotals,
  invoiceTotals,
  setFormatDataArray,
}) => {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyDetails, setSelectedCompanyDetails] = useState({});
  const [companies, setCompanies] = useState([]);
  const [postArtikle, setPostArtikle] = useState(1);
  const [artikel, setArtikel] = useState("");
  const [avvnr, setAvvnr] = useState("");
  const [datumArtikel, setDatumArtikel] = useState("");
  const [zeit, setZeit] = useState("");
  const [verwieger, setVerwieger] = useState("");
  const [gewicht, setGewicht] = useState("");
  const [kfzId, setKfzId] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onInputChange(name, value); // Update the specific input value in the parent state
  };

  useEffect(() => {
    if (selectedCompany) {
      // Ensure the company is selected
      getDetailsCompany(selectedCompany);
    }
  }, [selectedCompany]);

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
    getDetailsCompany();
    fetchCompanies();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !postArtikle ||
      !artikel ||
      !avvnr ||
      !datumArtikel ||
      !zeit ||
      !verwieger ||
      !gewicht ||
      !kfzId
    ) {
      alert("Please fill out all fields");

      console.log(formDataArray);
      return;
    }

    const formData = {
      postArtikle,
      artikel,
      avvnr,
      datumArtikel,
      zeit,
      verwieger,
      gewicht,
      kfzId,
    };
    onAdd(formData);
    setPostArtikle((prevPostArtikle) => prevPostArtikle + 1);
    setArtikel("");
    setAvvnr("");
    setDatumArtikel("");
    setZeit("");
    setVerwieger("");
    setGewicht("");
    setKfzId("");
  };

  const handleToSave = async () => {
    const lieferantData = {
      companyName,
      dateLieferant,
      spedituer,
      selectedCompanyDetails,
      formDataArray,
      rechnungNr,
      baustelle,
      leiferant,
    };

    // Log the data to verify structure
    console.log("Sending invoiceData:", lieferantData);
    console.log("companyName:", companyName);
    try {
      const response = await axios.post(`${API_BASE_URL}/savedLieferant`, lieferantData);
      
      console.log("Lieferant saved:", response.data);

      handlePrint();
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

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

  console.log("Parent selectedCompanyDetails:", selectedCompanyDetails);

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
                    {
                      console.log(
                        "CompanySelectedDetails:",
                        selectedCompanyDetails
                      );
                    }
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
                Wiegeschein-Nr:
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
              <label htmlFor="spedituer" className="mb-2 text-gray-700">
                Spedituer:
              </label>
              <input
                id="spedituer"
                type="text"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Spedituer"
                onChange={(e) => onSpedituerChange(e.target.value)} // Pass only the value
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="baustelle" className="mb-2 text-gray-700">
                Baustelle:
              </label>
              <input
                id="baustelle"
                type="text"
                placeholder="Baustelle"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                onChange={(e) => onBaustelleChange(e.target.value)}
              />
            </div>
            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="leiferant" className="mb-2 text-gray-700">
                Lieferant:
              </label>
              <input
                id="leiferant"
                type="text"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Lieferant"
                onChange={(e) => onLieferantChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex space-x-4"></div>
        </div>

        <div className="mt-2 pr-2 pl-2 pt-2 w-[580px] h-1/2 border rounded-md pb-4 bg-backgroundColor">
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
              <label htmlFor="avvnr" className="mb-2 text-gray-700">
                AVV-Nr:
              </label>
              <input
                id="avvnr"
                type="number"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="AVV-Nr"
                value={avvnr}
                onChange={(e) => setAvvnr(e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="artikel" className="mb-2 text-gray-700">
                KFZ/ID:
              </label>
              <input
                id="kfzId"
                type="text"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="KFZ/ID"
                value={kfzId}
                onChange={(e) => setKfzId(e.target.value)}
              />
            </div>
            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="artikel" className="mb-2 text-gray-700">
                Artikel:
              </label>
              <select
                id="artikel"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                value={artikel}
                onChange={(e) => setArtikel(e.target.value)}
              >
                <option value="Transportkosten">Artikel</option>
                <option value="Kupferkabel">Kupferkabel</option>
                <option value="Kupferkabel">Kupferkabel</option>
                <option value="Kupferkabel">Kupferkabel</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="datumArtikel" className="mb-2 text-gray-700">
                Datum:
              </label>
              <input
                id="datumArtikel"
                type="date"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Datum / Zeit"
                value={datumArtikel}
                onChange={(e) => setDatumArtikel(e.target.value)}
              />
            </div>

            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="zeit" className="mb-2 text-gray-700">
                Zeit:
              </label>
              <input
                id="zeit"
                type="time"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Zeit"
                value={zeit}
                onChange={(e) => setZeit(e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-4 ">
            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="gewicht" className="mb-2 text-gray-700">
                Gewicht:
              </label>
              <input
                id="gewicht"
                type="text"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Gewicht"
                value={gewicht}
                onChange={(e) => setGewicht(e.target.value)}
              />
            </div>

            <div className="flex flex-col mb-1 w-1/2">
              <label htmlFor="verwieger" className="mb-2 text-gray-700">
                Verwieger:
              </label>
              <input
                id="verwieger"
                type="text"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Verwieger:"
                value={verwieger}
                onChange={(e) => setVerwieger(e.target.value)}
              />
            </div>
          </div>
          <NeuArtikelButton handleSubmit={handleSubmit} />
        </div>

        <div className="flex justify-end gap-5 ">
          <CancelButton />
          <button
            type="submit"
            className="lg:bg-backgroundButton pt-2 pb-2 py-6 px-6 mb-4 mt-4 text-textColorButton hover:bg-[#2e85c5] hover:text-white float-right border rounded-md mr-2"
            onClick={handleToSave}
            dateLieferant={dateLieferant}
            spedituer={spedituer}
            rechnungNr={rechnungNr}
            dateGutschrift={dateGutschrift}
            baustelle={baustelle}
            leiferant={leiferant}
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
          >
            {" "}
            Save and Print{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransportForm;
