import React from 'react'
import Logo from '../assets/images/Logo1.png';
import { MdDeleteForever } from "react-icons/md";

const TransportPreview = ({

  leiferant,
  companyName,
  dateLieferant,
  spediteur,
  selectedCompanyDetails,
  formDataArray,
  setFormDataArray,
  setPostArtikle,
  rechnungNr,
  koment,
  titelKoment,
  baustelle,
}) => {
  const VAT_RATE = 0;

  const calculateTotals = () => {
    if (!formDataArray) return { totalNetto: 0, totalWithMwSt: 0 };

    const calculatedTotalNetto = formDataArray.reduce((total, item) => {
      return total + (parseFloat(item.gewicht) || 0);
    }, 0);

    const calculatedMwSt = (calculatedTotalNetto * VAT_RATE).toFixed(2);
    const totalWithMwSt = (
      calculatedTotalNetto + parseFloat(calculatedMwSt)
    ).toFixed(2);

    return { totalNetto: calculatedTotalNetto.toFixed(2), totalWithMwSt };
  };

  const { totalNetto, totalWithMwSt } = calculateTotals();

  return (
    <div
    className=" w-1/2 bg-backgroundColor h-auto rounded-lg shadow-md  ml-1 border-t-[5px] border-gray-400"
    id="previewInvoice"
  >
    <div className="flex flex-row justify-between w-full h-auto">
      <div className="w-full h-22">
        <img
          src={Logo}
          className="text-lg font-bold mb-4 w-44 h-22 object-fit"
        />
        {/* Flex container for Datum and Steuer Nr */}
      </div>

      <div className="w-64  h-11  flex flex-col items-center mt-4">
        <h2 className=" flex flex-col items-end text-[14px]">Wiegeschein-Nr.:: {rechnungNr}</h2>
        {/* <h2 className="mr-2 flex flex-col items-end text-[14px]">Kunden-Nr: {kundenumer}</h2> */}

        {/* Moving Steuer Nr and Steuer ID to align properly */}
        <div className="flex flex-col items-end mr-2 text-[15px]">
          {/* We already show Steuer Nr and Steuer ID in the left section */}
          {/* This area might not be needed unless more info is needed */}
        </div>
      </div>
    </div>

    <div className="flex flex-row w-full justify-between ml-1">
      <div>
        <h2 className="mr-2 text-[14px] flex">Datum: {dateLieferant}</h2>
        
      </div>

      {selectedCompanyDetails && (
        <div className="mr-6">
          <h2 className="mr-2 text-[14px] flex justify-end">
            Steuer Nr: {selectedCompanyDetails.steuerNr}
          </h2>
          <h2 className="mr-2 text-[14px] flex flex-col items-end">
            {/* Steuer ID: {selectedCompanyDetails.steuerId} */}
          </h2>
        </div>
      )}
    </div>

    <div className="flex mt-4 ml-1">
      <div className="w-1/2">
        {selectedCompanyDetails && (
          <div>
            <p className="w-44 font-bold text-[14px] h-auto">
              {companyName}
            </p>
            <p className="w-30 font-normal  text-[12px] h-auto">
              Adress: {selectedCompanyDetails.adress}
            </p>
            <p className="w-30 font-normal text-[14px] h-auto">
              Tel: {selectedCompanyDetails.phoneNumber}
            </p>
          </div>
        )}
      </div>
      <div className="w-1/2 flex flex-col items-end mr-4 ">
        <h4 className="font-bold text-[14px]">Emrush Kadrija</h4>
        <h4 className="text-[14px]">Dusseldorf, Germany</h4>
        <h4 className="text-[14px]">emrushkadrija@gmail.com</h4>
        <h4 className="text-[14px]">Tel: +491111777111</h4>
      </div>
    </div>
    <div className="h-auto w-full ">
     <div className='text-[16px] p-2 font-bold'>Lieferant</div>
     <div className='w-full flex justify-between p-2'>
     <div className='text-[14px] '><span className='font-bold'>Baustelle:</span> {baustelle}</div>
     <div className='mr-4 text-[14px] '><span className='font-bold'>Lieferant:</span> {leiferant}</div>
     </div>
     <div className="p-2 text-[14px] "> <span className='font-bold'>Spediteur:</span> {spediteur}</div>
    </div>

    {/* <div className="flex flex-col border-t-2 ml-2 mt-2 border-textColorCancel w-full h-22"> */}
  <table className=" w-full border-t-2  mt-2 border-textColorCancel">
    <thead>
      <tr className="bg-gray-200 pr-2 border-b-2 border-textColorCancel mb-1">
        <th className="w-28 h-10 text-[12px] text-center">Post ArtikelNr:</th>
        <th className="w-28 h-10 text-[12px] text-center">AVV-Nr:</th>
        <th className="w-28 h-10 text-[12px] text-center">KFZ/ID:</th>
        <th className="w-28 h-10 text-[12px] text-center">Artikel:</th>
        <th className="w-20 h-10 text-[12px] text-center">Datum:</th>
        <th className="w-20 h-10 text-[12px] text-center">Zeit:</th>
        <th className="w-20 h-10 text-[12px] text-center">Gewicht:</th>
        <th className="w-4 h-10"> </th>
      </tr>
    </thead>
  
    <tbody className="invoice-style w-full">
  {formDataArray.length > 0 ? (
    formDataArray.map((data, index) => (
      <tr key={index} className="border-dashed border-b-2 pb-1">
        <td className="h-auto text-[14px] text-center">{data.postArtikle}</td>
        <td className="h-auto text-[14px] text-center">{data.avvnr}</td>
        <td className="h-auto text-[14px] text-center">{data.kfzId}</td>
        <td className="h-auto text-[14px] text-center">{data.artikel}</td>
        <td className="h-auto text-[14px] text-center">{data.datumArtikel}</td>
        <td className="h-auto text-[14px] text-center">{data.zeit}</td>
        <td className="h-auto text-[14px] text-center">{data.gewicht} kg</td>
        <td className=" h-22">
          {/* Uncomment if you want to enable delete functionality */}
          {/* <span
            className="text-[16px] no-print text-center cursor-pointer hover:text-red-400"
            onClick={() => handleDeleteItem(index)}
          >
            <MdDeleteForever />
          </span> */}
        </td>
      </tr>
    ))
  ) : (
    <tr className="h-80 border-dashed border-b-2 pb-1">
      <td colSpan="8" className="text-center text-gray-500">
       
      </td>
    </tr>
  )}
</tbody>

    
    <tfoot className="w-full pt-20 border-2 border-t ">
  
  
  <tr className="border-b-2 bg-gray-200">
    <td colSpan="4" className="font-bold text-[14px] text-left">
      Nettogewicht:
    </td>
    <td colSpan="6" className="font-bold text-right p-2">{totalWithMwSt} kg</td>
  </tr>
</tfoot>
  </table>

  <div className="flex justify-between p-2 mt-2 w-full border-textColorCancel">
    <div className="w-full flex justify-around">
      <p className="text-sm ml-1">Fahrerunterschrift</p>
      <p className="text-sm ml-1">Kundenunterschrift Niederrhein</p>
     
    </div>
  </div>
{/* </div> */}

  </div>
  )
}

export default TransportPreview
