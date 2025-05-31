import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {  updateGefahrdungsbeurteilungtById } from "../data/data";
import CardInvoiceForm from './CardInvoiceForm';
import PreviewCardForm from './PreviewCardForm';
import {toast} from 'sonner';
import { API_BASE_URL } from "../data/data";

const EditGuschrift = ({companies, mode}) => {
  const { id } = useParams();
  const navigate = useNavigate();
const [error, setError] = useState();
const [selectedCompany, setSelectedCompany] = useState("");


  const [viewInput, setViewInput] = useState({
    companyName:"",
    Kundenadresse: "",
    Arbeitsbereich: "",
    Person: "",
    Geschaftsleitung: "",
    Gefahrdungsbeurteilung: "",
    Fuhrungskraft: "",
    Mitarbeiter: "",
    Sicherheitsbeauftragte: "",
    Betriebsrat: "",
    Arbeitssicherheit: "",
    Betriebsarzt: "",
    Berufsgenossenschaft: "",
    Staatliche: "",
    datum:"",
  });

  const fetchGuschrift = async () => {
    try {
      const response = await updateGefahrdungsbeurteilungtById(id);
      console.log("Fetched Data:", response);
console.log("Company Name:", response.selectedCompany);
      setViewInput({
        companyName: response.selectedCompany || "",
        Betriebsteil: response.Betriebsteil || "", // Separate field for Betriebsteil
        datum: response.datum || "",
        Kundenadresse: response.Kundenadresse || "",
        Arbeitsbereich: response.Arbeitsbereich || "",
        Person: response.Person || "",
        Geschaftsleitung: response.Geschaftsleitung || "",
        Gefahrdungsbeurteilung: response.Gefahrdungsbeurteilung || "",
        Fuhrungskraft: response.Fuhrungskraft || "",
        Mitarbeiter: response.Mitarbeiter || "",
        Sicherheitsbeauftragte: response.Sicherheitsbeauftragte || "",
        Betriebsrat: response.Betriebsrat || "",
        Arbeitssicherheit: response.Arbeitssicherheit || "",
        Betriebsarzt: response.Betriebsarzt || "",
        Berufsgenossenschaft: response.Berufsgenossenschaft || "",
        Staatliche: response.Staatliche || "",
        Anlagen: response.Anlagen || "",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
    }
  };
  
  

  useEffect(() => {
    fetchGuschrift();
  }, []);
  

  useEffect(() => {
    console.log("Selected Company:", selectedCompany);
  }, [selectedCompany]);

  useEffect(() => {
    setSelectedCompany(viewInput.companyName);
  }, [viewInput.companyName]);

  const handleInputChange = (name, value) => {
    setViewInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const updatedGuschriftData = await updateGuschriftById(id, viewInput);
      console.log("Updated Guschrift:", updatedGuschriftData);
     toast.success("Gefahrdungsbeurteilung successfully saved") // Navigate to a success page or show a message
    } catch (error) {
      console.error("Failed to update guschrift:", error);
    }
  };
  console.log('mode:',mode);
  
  return (
    <div className="flex gap-2">
    <div className="w-1/2   h-auto shadow-md  rounded-lg">
      
      <CardInvoiceForm
        viewInput={viewInput}
        onInputChange={handleInputChange}
        companies={companies}
        mode="edit"
        gutschriftId={id}
      />
    </div>
    <div className="w-1/2   h-auto  rounded-lg">
      <PreviewCardForm 
      viewInput={viewInput}
     mode={mode}

      />
      </div>
    </div>
  );
};

export default EditGuschrift;
