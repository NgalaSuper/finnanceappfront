  import React, { useEffect, useState } from "react";
  import InvoiceCompanyForm from "./InvoiceCompanyForm";
  import PreviewInvoice from "./PreviewInvoice";
import axios from "axios";
import { useFetcher } from "react-router-dom";
import { API_BASE_URL } from "../data/data";

  const FormInvoice = () => {
    const [companyName, setCompanyName] = useState("");
    const [address, setAddress] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [number, setNumber] = useState("");
    const [rechnungNr, setRechnungNr] = useState("");
    const [steuerNr, setSteuerNr] = useState("");
    const [ustIdNr, setUstIdNr] = useState("");
    const [steuerId, setSteuerId] = useState("");
    const [companyNameClient, setCompanyNameClient] = useState('');
    const [bezeinchnung, setbezeinchnung] = useState('');
    const [postArtikle, setPostArtikle] = useState('');
    const [menge, setMenge] = useState('');
    const [enzielprise, setEnzielprise] = useState('');
    const [netopreis, setNetopreis] = useState('');
    const [dateInvoice, setDateInvoice] = useState('')
    const [formDataArray, setFormDataArray] = useState([]);
    const [invoiceTotals, setInvoiceTotals] = useState([]);
    const [invoice, setInvoice] = useState([]);
    const [totalNetto, setTotalNetto] = useState('');
    const [selectedCompanyDetails, setSelectedCompanyDetails] = useState(null);
    

const handleCompanyDetailsChange = (companyData) => {
  setSelectedCompanyDetails(companyData);
};


const fetchInvoices = async() => {
  try {
    const invoices = await axios.get(`${API_BASE_URL}/getInvoicesCompany`);
    setInvoice(invoices)
  } catch(error) {
    console.error(error);
  }
}

useEffect(()=> {
  fetchInvoices();
}, [])




    const handleAddToArray = (newData) => {
      setFormDataArray((prevArray) => [...prevArray, newData]);
      const newTotal = formDataArray.reduce((acc, curr) => acc + parseFloat(curr.netopreis || 0), 0);
    setTotalNetto(newTotal.toFixed(2)); 
    
    };

    // const onRechnungNrChange = (value) => {
    //   setRechnungNr(value);
    // };

    return (
      <>

      
        <InvoiceCompanyForm
          onCompanyNameChange={setCompanyName}
          onAddressChange={setAddress}
          onEmailChange={setEmailAddress}
          onNumberChange={setNumber}
          onSteuerNrChange={setSteuerNr}
          onUstIdNrChange={setUstIdNr}
          onSteuerIdChange={setSteuerId}
          ondateInvoiceChange={setDateInvoice}
          onbezeinchnungChange={setbezeinchnung}
          onmengeChange={setMenge}
          onenzielpriseChange={setEnzielprise}
          onnetopreisChange={setNetopreis}
          onRechnungNrChange={setRechnungNr}
          onAdd={handleAddToArray}
          onCompanyDetailsChange={handleCompanyDetailsChange}
          dateInvoice={dateInvoice}
          ustIdNr={ustIdNr}
          rechnungNr={rechnungNr}
          formDataArray={formDataArray}
          selectedCompanyDetails={selectedCompanyDetails}
          setTotalNetto={setTotalNetto}
          setNetopreis={setNetopreis}
          invoiceTotals={invoiceTotals}
          setFormDataArray={setFormDataArray}
          setInvoiceTotals={setInvoiceTotals}
        />
      
          <PreviewInvoice
              companyName={companyName}
              address={address}
              email={emailAddress}
              rechnungNr={rechnungNr}
              number={number}
              steuerNr={steuerNr}
              ustIdNr={ustIdNr}
              steuerId={steuerId}
              dateInvoice={dateInvoice}
              bezeinchnung={bezeinchnung}
              menge={menge}
              enzielprise={enzielprise}
              netopreis={netopreis}
              postArtikle={postArtikle}
              setPostArtikle={setPostArtikle}
              formDataArray={formDataArray}
              setFormDataArray={setFormDataArray}
              totalNetto={totalNetto}
              selectedCompanyDetails={selectedCompanyDetails}
              invoiceTotals={invoiceTotals}
             
              
        />
        
        
        </>
    );
  };

  export default FormInvoice;
