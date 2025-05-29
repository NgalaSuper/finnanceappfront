import React, { useState } from 'react';
import CardInvoiceForm from './CardInvoiceForm';
import PreviewCardForm from './PreviewCardForm';

const CardInvoice = ({
  selectedCompany
}) => {
  const [viewInput, setViewInput] = useState({
    companiesName: selectedCompany,
    Betriebsteil: '',
    datum: '',
    Arbeitsbereich:'',
    Kundenadresse:'',
    Person:'',
    Gefahrdungsbeurteilung:'',
    Geschaftsleitung:'',
    Fuhrungskraft:'',
    Mitarbeiter:'',
    Sicherheitsbeauftragte:'',
    Betriebsrat:'',
    Arbeitssicherheit:'',
    Betriebsarzt:'',
    Berufsgenossenschaft:'',
    Staatliche:'',
    Anlagen:'',

  });

  const handleInputValues = (name, value) => {
    setViewInput((prevInputs) => ({
      ...prevInputs,
      [name]: value
    }));
  };

  return (
    <div className='flex gap-2'>
      <CardInvoiceForm
        viewInput={viewInput}
        onInputChange={handleInputValues}
        mode="create"
        className="border-t-[5px] border-backgroundButton"
      />
      <PreviewCardForm 
        viewInput={viewInput}
        selectedCompany={selectedCompany}
      

      />
    </div>
  );
};

export default CardInvoice;
