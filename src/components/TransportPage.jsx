import React, { useState } from 'react'
import TransportForm from './TransportForm'
import TransportPreview from './TransportPreview'

const TransportPage = ({
  selectedCompany
}) => {
  const [companyName, setCompanyName] = useState("");
    const [address, setAddress] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [gewicht, setGewicht] = useState("");
    const [spedituer, setSpedituer] = useState("");
    const [number, setNumber] = useState("");
    const [baustelle, setBaustelle] = useState("")
    const [leiferant, setLieferant] = useState("");
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
    const [dateLieferant, setDateLieferant] = useState('')
    const [formDataArray, setFormDataArray] = useState([]);
    const [invoiceTotals, setInvoiceTotals] = useState([]);
    const [invoice, setInvoice] = useState([]);
    const [totalNetto, setTotalNetto] = useState('');
    const [selectedCompanyDetails, setSelectedCompanyDetails] = useState(null);

  // const handleInputValues = (name, value) => {
  //   setTransportInput((prevInputs) => ({
  //     ...prevInputs,
  //     [name]: value
  //   }));
  // };
  const handleCompanyDetailsChange = (companyData) => {
    setSelectedCompanyDetails(companyData);
  };

  const handleAddToArray = (newData) => {
    setFormDataArray((prevArray) => [...prevArray, newData]);
    const newTotal = formDataArray.reduce((acc, curr) => acc + parseFloat(curr.netopreis || 0), 0);
  setTotalNetto(newTotal.toFixed(2)); 
  
  };


  return (
    <div className='flex gap-2 w-full'>
        <TransportForm
         onCompanyNameChange={setCompanyName}
         onAddressChange={setAddress}
         companyName={companyName}
         onEmailChange={setEmailAddress}
         onNumberChange={setNumber}
         onSteuerNrChange={setSteuerNr}
         onUstIdNrChange={setUstIdNr}
         onSteuerIdChange={setSteuerId}
         ondateInvoiceChange={setDateLieferant}
         onbezeinchnungChange={setbezeinchnung}
         onmengeChange={setMenge}
         onenzielpriseChange={setEnzielprise}
         onnetopreisChange={setNetopreis}
         onRechnungNrChange={setRechnungNr}
         onBaustelleChange={setBaustelle}
         baustelle={baustelle}
         onAdd={handleAddToArray}  
         onCompanyDetailsChange={handleCompanyDetailsChange}
         dateLieferant={dateLieferant}
         ustIdNr={ustIdNr}
         rechnungNr={rechnungNr}
         spedituer={spedituer}
         onSpedituerChange={setSpedituer}
         leiferant={leiferant}
         onLieferantChange={setLieferant}
         formDataArray={formDataArray}
         selectedCompanyDetails={selectedCompanyDetails}
         setTotalNetto={setTotalNetto}
         setNetopreis={setNetopreis}
         invoiceTotals={invoiceTotals}
         setFormDataArray={setFormDataArray}
         setInvoiceTotals={setInvoiceTotals}
         gewicht={gewicht}
         onGewichtChange={setGewicht}
        
        />
        <TransportPreview 
        companyName={companyName}
        address={address}
        email={emailAddress}
        rechnungNr={rechnungNr}
        spediteur={spedituer}
        gewicht={gewicht}
        leiferant={leiferant}
        number={number}
        steuerNr={steuerNr}
        ustIdNr={ustIdNr}
        steuerId={steuerId}
        dateLieferant={dateLieferant}
        bezeinchnung={bezeinchnung}
        baustelle={baustelle}
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

export default TransportPage
