import React, { useEffect, useState } from 'react'
import SafetyFormPage from './SafetyFormPage'
import PreviewSafetyPage from './PreviewSafetyPage'

const SafetyPage = () => {
  const [companyName, setCompanyName] = useState("");
    const [address, setAddress] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [koment, setKoment] = useState("");
    const [number, setNumber] = useState("");
    const [kundenumer, setKundenumer] = useState("")
    const [titelKoment, setTitelKoment] = useState("");
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
    const [dateGutschrift, setDateGutschrift] = useState('')
    const [formDataArray, setFormDataArray] = useState([]);
    const [invoiceTotals, setInvoiceTotals] = useState([]);
    const [invoice, setInvoice] = useState([]);
    const [totalNetto, setTotalNetto] = useState('');
    const [selectedCompanyDetails, setSelectedCompanyDetails] = useState(null);

    const handleCompanyDetailsChange = (companyData) => {
      setSelectedCompanyDetails(companyData);
    };
    
    
    // const fetchInvoices = async() => {
    //   try {
    //     const invoices = await axios.get('http://localhost:5000/getInvoicesCompany');
    //     setInvoice(invoices)
    //   } catch(error) {
    //     console.error(error);
    //   }
    // }
    
    // useEffect(()=> {
    //   fetchInvoices();
    // }, [])
    
    
    
    
        const handleAddToArray = (newData) => {
          setFormDataArray((prevArray) => [...prevArray, newData]);
          const newTotal = formDataArray.reduce((acc, curr) => acc + parseFloat(curr.netopreis || 0), 0);
        setTotalNetto(newTotal.toFixed(2)); 
        
        };
    
        // const onRechnungNrChange = (value) => {
        //   setRechnungNr(value);
        // };

  return (
    <div className='flex'>
      <SafetyFormPage 
       onCompanyNameChange={setCompanyName}
       onAddressChange={setAddress}
       companyName={companyName}
       onEmailChange={setEmailAddress}
       onNumberChange={setNumber}
       onSteuerNrChange={setSteuerNr}
       onUstIdNrChange={setUstIdNr}
       onSteuerIdChange={setSteuerId}
       ondateInvoiceChange={setDateGutschrift}
       onbezeinchnungChange={setbezeinchnung}
       onmengeChange={setMenge}
       onenzielpriseChange={setEnzielprise}
       onnetopreisChange={setNetopreis}
       onRechnungNrChange={setRechnungNr}
       onAdd={handleAddToArray}
       onCompanyDetailsChange={handleCompanyDetailsChange}
       dateGutschrift={dateGutschrift}
       ustIdNr={ustIdNr}
       rechnungNr={rechnungNr}
       koment={koment}
       onKomentChange={setKoment}
       onKundeChange={setKundenumer}
       kundenumer={kundenumer}
       titelKoment={titelKoment}
       onTitelKomentChange={setTitelKoment}
       formDataArray={formDataArray}
       selectedCompanyDetails={selectedCompanyDetails}
       setTotalNetto={setTotalNetto}
       setNetopreis={setNetopreis}
       invoiceTotals={invoiceTotals}
       setFormDataArray={setFormDataArray}
       setInvoiceTotals={setInvoiceTotals}
      />
      <PreviewSafetyPage 
        companyName={companyName}
        address={address}
        email={emailAddress}
        rechnungNr={rechnungNr}
        koment={koment}
        kundenumer={kundenumer}
        titelKoment={titelKoment}
        number={number}
        steuerNr={steuerNr}
        ustIdNr={ustIdNr}
        steuerId={steuerId}
        dateGutschrift={dateGutschrift}
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
    </div>
  )
}

export default SafetyPage
