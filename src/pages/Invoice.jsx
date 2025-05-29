import React, { useState } from 'react'
import FormInvoice from '../components/FormInvoice'
import PreviewInvoice from '../components/PreviewInvoice'

const Invoice = () => {
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [rechnungNr, setRechnungNr] = useState('');

  const handleCompanyNameChange = (value) => {
    setCompanyName(value);
  };

  const handleAddressChange = (value) => {
    setAddress(value);
  };
  // const handleRechnungNrChange = (value) => {
  //   setRechnungNr(value);
  //   console.log("Rechnung Nr changed to:", value);
  // };

  return (
    <>
   <div className="flex">
      <FormInvoice
        onCompanyNameChange={handleCompanyNameChange}
        onAddressChange={handleAddressChange}
        
      />
     
    </div>
    </>
  )
}

export default Invoice
