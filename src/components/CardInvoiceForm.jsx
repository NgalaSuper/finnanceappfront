import React, { useEffect, useState } from "react";
import { Listbox } from "@headlessui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SaveandPrintButton from "./SaveandPrintButton";
import CancelButton from "./CancelButton";
import { updateGefahrdungsbeurteilungtById } from "../data/data";
import {toast} from 'sonner';
import { API_BASE_URL } from "../data/data";

const CardInvoiceForm = ({ viewInput, onInputChange, mode, gutschriftId }) => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getCompanies`);
      setCompanies(response.data);
      setLoading(false);
      console.log("fetchCompanies:", response.data);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Error fetching companies:", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onInputChange(name, value); // Update the specific input value in the parent state
  };


  const handleSaveGutschrift = async () => {
    try {
      const saveButton = {
        selectedCompany: selectedCompany,
        datum: datum,
        ...viewInput,
      };

      // Validation for required fields
      if (!saveButton.selectedCompany || !saveButton.datum) {
        alert("Please fill all required fields");
        return;
      }

      if (mode === "create") {
        await axios.post(`${API_BASE_URL}/Gefahrdungsbeurteilung`, saveButton);
        handlePrint();
        console.log("Saved successfully");
      } else if (mode === "edit") {
        // Call the updateGuschriftById function
        await updateGefahrdungsbeurteilungtById(gutschriftId, saveButton);
        console.log("Updated data to send:", viewInput);
        toast.success("Gefahrdungsbeurteilung successfully saved");
        // navigate('/');
      }
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };
  
  useEffect(() => {
    if (mode === "edit" && viewInput?.companyName) {
      setSelectedCompany(viewInput.companyName);
    }
  }, [mode, viewInput]);

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

  return (
    <div className="w-1/1 h-auto shadow-md bg-backgroundColor rounded-lg border-t-[5px] border-gray-400">
      <div className="w-[580px] bg-backgroundColor h-auto mt-2 ml-1 font-manrope">
        <div className="rounded">
          <h2 className="font-bold">Gefährdungsbeurteilung Mitwirkende</h2>
        </div>
        <div className="m-2 pr-2 pl-2 pt-2 w-[580px] h-1/2 border pb-4 rounded-md bg-backgroundColor">
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
                    onInputChange("companyName", value);
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
              <label htmlFor="datum" className="mb-2 text-gray-700">
                Erstellt:
              </label>
              <input
                id="datum"
                type="date"
                name="datum" // Ensure consistency in the property name
                value={viewInput.datum} // Use the correct property from the state
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Rechnung Number"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex mb-4 gap-2">
            <div className="flex flex-col w-1/2">
              <label htmlFor="Kundenadresse" className="mb-2 text-gray-700">
                Kundenadresse:
              </label>
              <input
                id="Kundenadresse"
                type="text"
                name="Kundenadresse" // Ensure consistency in the property name
                value={viewInput.Kundenadresse} // Use the correct property from the state
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Kundenadresse"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label htmlFor="Kundenadresse" className="mb-2 text-gray-700">
                Arbeitsbereich:
              </label>
              <input
                id="Arbeitsbereich"
                type="text"
                name="Arbeitsbereich" // Ensure consistency in the property name
                value={viewInput.Arbeitsbereich} // Use the correct property from the state
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Arbeitsbereich"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex mb-4 gap-2">
            <div className="flex flex-col w-1/2">
              <label htmlFor="Person" className="mb-2 text-gray-700">
                Tätigkeit/Funktion/Person*:
              </label>
              <input
                id="Person"
                type="text"
                name="Person" // Ensure consistency in the property name
                value={viewInput.Person} // Use the correct property from the state
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Tätigkeit/Funktion/Person"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label htmlFor="Geschaftsleitung" className="mb-2 text-gray-700">
                Unternehmer/Geschäftsleitung
              </label>
              <input
                id="Geschaftsleitung"
                type="text"
                name="Geschaftsleitung" // Ensure consistency in the property name
                value={viewInput.Geschaftsleitung} // Use the correct property from the state
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Unternehmer/Geschäftsleitung"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex flex-col w-1/1">
            <label
              htmlFor="Gefahrdungsbeurteilung"
              className="mb-2 text-gray-700"
            >
              Die Gefährdungsbeurteilung wurde geleitet von:
              <br />
              An der Gefährdungsbeurteilung warn beteiligt:
            </label>
            <input
              id="Gefahrdungsbeurteilung"
              type="text"
              name="Gefahrdungsbeurteilung" // Ensure consistency in the property name
              value={viewInput.Gefahrdungsbeurteilung} // Use the correct property from the state
              className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
              placeholder="Gefährdungsbeurteilung"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex mb-4 gap-2">
            <div className="flex flex-col w-1/2">
              <label htmlFor="Fuhrungskraft" className="mb-2 text-gray-700">
                Führungskraft:
              </label>
              <input
                id="Fuhrungskraft"
                type="text"
                name="Fuhrungskraft" // Ensure consistency in the property name
                value={viewInput.Fuhrungskraft} // Use the correct property from the state
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Führungskraft"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label htmlFor="Mitarbeiter" className="mb-2 text-gray-700">
                Mitarbeiter:
              </label>
              <input
                id="Mitarbeiter"
                type="text"
                name="Mitarbeiter" // Ensure consistency in the property name
                value={viewInput.Mitarbeiter} // Use the correct property from the state
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Mitarbeiter"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex mb-4 gap-2">
            <div className="flex flex-col w-1/2">
              <label
                htmlFor="Sicherheitsbeauftragte"
                className="mb-2 text-gray-700"
              >
                Sicherheitsbeauftragte:
              </label>
              <input
                id="Sicherheitsbeauftragte"
                type="text"
                name="Sicherheitsbeauftragte" // Ensure consistency in the property name
                value={viewInput.Sicherheitsbeauftragte} // Use the correct property from the state
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Sicherheitsbeauftragte"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label htmlFor="Betriebsrat" className="mb-2 text-gray-700">
                Betriebsrat:
              </label>
              <input
                id="Betriebsrat"
                type="text"
                name="Betriebsrat" // Ensure consistency in the property name
                value={viewInput.Betriebsrat} // Use the correct property from the state
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Betriebsrat"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex mb-4 gap-2">
            <div className="flex flex-col w-1/2">
              <label htmlFor="Arbeitssicherheit" className="mb-2 text-gray-700">
                Fachkraft für Arbeitssicherheit:
              </label>
              <input
                id="Arbeitssicherheit"
                type="text"
                name="Arbeitssicherheit" // Ensure consistency in the property name
                value={viewInput.Arbeitssicherheit} // Use the correct property from the state
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Arbeitssicherheit"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label htmlFor="Betriebsarzt" className="mb-2 text-gray-700">
                Betriebsarzt:
              </label>
              <input
                id="Betriebsarzt"
                type="text"
                name="Betriebsarzt" // Ensure consistency in the property name
                value={viewInput.Betriebsarzt} // Use the correct property from the state
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Betriebsarzt"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex mb-4 gap-2">
            <div className="flex flex-col w-1/2">
              <label
                htmlFor="Berufsgenossenschaft"
                className="mb-2 text-gray-700"
              >
                Berufsgenossenschaft:
              </label>
              <input
                id="Berufsgenossenschaft"
                type="text"
                name="Berufsgenossenschaft" // Ensure consistency in the property name
                value={viewInput.Berufsgenossenschaft} // Use the correct property from the state
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Berufsgenossenschaft"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label htmlFor="Staatliche" className="mb-2 text-gray-700">
                Staatliche Behörde:
              </label>
              <input
                id="Staatliche"
                type="text"
                name="Staatliche" // Ensure consistency in the property name
                value={viewInput.Staatliche} // Use the correct property from the state
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Staatliche Behörde"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex mb-4 gap-2">
            <div className="flex flex-col w-full">
              <label htmlFor="Anlagen" className="mb-2 text-gray-700">
                Anlagen:
              </label>
              <input
                id="Anlagen"
                type="text"
                name="Anlagen" // Ensure consistency in the property name
                value={viewInput.Anlagen} // Use the correct property from the state
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Anlagen"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex justify-end gap-5 ">
            <CancelButton />
            <button
              className="lg:bg-backgroundButton pt-2 pb-2 py-6 px-6 mb-4 mt-4 text-textColorButton hover:bg-[#2e85c5] hover:text-white float-right border rounded-md mr-2"
              onClick={handleSaveGutschrift}
            >
              {mode === "create" ? "Save and Print" : "Update Gutschrift"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardInvoiceForm;
