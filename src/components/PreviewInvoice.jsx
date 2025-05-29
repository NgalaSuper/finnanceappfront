  import React, { useEffect, useState } from "react";
  import Logo from "../assets/images/Logo1.png";
  import axios from "axios";
  import { MdDeleteForever } from "react-icons/md";

  const PreviewInvoice = ({
    companyName,
    dateInvoice,
    ustIdNr,
    selectedCompanyDetails,
    formDataArray,
    setFormDataArray,
    setPostArtikle,
    rechnungNr
  }) => {
    const VAT_RATE = 0.19;

    const calculateTotals = () => {
      if (!formDataArray) return { totalNetto: 0, totalWithMwSt: 0 };

      const calculatedTotalNetto = formDataArray.reduce((total, item) => {
        return total + (parseFloat(item.netopreis) || 0);
      }, 0);

      const calculatedMwSt = (calculatedTotalNetto * VAT_RATE).toFixed(2);
      const totalWithMwSt = (
        calculatedTotalNetto + parseFloat(calculatedMwSt)
      ).toFixed(2);

      return { totalNetto: calculatedTotalNetto.toFixed(2), totalWithMwSt };
    };

    const { totalNetto, totalWithMwSt } = calculateTotals();

    const handleDeleteItem = (indexToDelete) => {
      const updatedArray = formDataArray.filter(
        (_, index) => index !== indexToDelete
      );
      setFormDataArray(updatedArray);
      setPostArtikle((prevPostArtikle) =>
        prevPostArtikle > 1 ? prevPostArtikle - 1 : 1
      );
      console.log("clickeed");
    };

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

            <div className="w-64 mr-2 h-11  flex justify-start items-center">
              <h2 className="mr-2 flex flex-col items-end text-[14px]">Rechnung-Nr: {rechnungNr}</h2>
            

              {/* Moving Steuer Nr and Steuer ID to align properly */}
              <div className="flex flex-col items-end mr-2 text-[15px]">
                {/* We already show Steuer Nr and Steuer ID in the left section */}
                {/* This area might not be needed unless more info is needed */}
              </div>
            </div>
          </div>

          <div className="flex flex-row w-full justify-between ml-1">
            <div>
              <h2 className="mr-2 text-[14px] flex">Datum: {dateInvoice}</h2>
              <h2 className="mr-2 text-[14px]">Ust-idNr: {ustIdNr}</h2>
            </div>

            {selectedCompanyDetails && (
              <div className="mr-6">
                <h2 className="mr-2 text-[14px] flex justify-end">
                  Steuer Nr: {selectedCompanyDetails.steuerNr}
                </h2>
                <h2 className="mr-2 text-[14px] flex flex-col items-end">
                  Steuer ID: {selectedCompanyDetails.steuerId}
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
            <div className="w-1/2 flex flex-col items-end mr-8 ">
              <h4 className="font-bold text-[14px]">Emrush Kadrija</h4>
              <h4 className="text-[14px]">Dusseldorf, Germany</h4>
              <h4 className="text-[14px]">emrushkadrija@gmail.com</h4>
              <h4 className="text-[14px]">Tel: +491111777111</h4>
            </div>
          </div>

          <div className="flex flex-col border-t-2 ml-2 mt-2 border-textColorCancel  h-22">
            <div className="flex flex-col  justify-between">
              <div className="flex flex-row justify-between bg-gray-200 pr-2 border-b-2 border-textColorCancel mb-1">
                <div className="w-22 h-22">
                  <p className="text-[12px]">Post ArtikelNr:</p>
                </div>
                <div className="w-28 h-22">
                  <p className="text-[12px]">Bezeichnung/ Spezifikation:</p>
                </div>
                <div className="w-22 h-22">
                  <p className="text-[12px]">Menge:</p>
                </div>
                <div className="w-22 h-22">
                  <p className="text-[12px]">Einzelpreise:</p>
                </div>
                <div className="w-22 h-22">
                  <p className="text-[12px]">Nettopreis MWSt:</p>
                </div>
                <div className="w-auto h-22"></div>
              </div>

              <div className="w-full flex flex-col justify-between h-96 invoice-style">
                <div className="overflow-scroll">
                  {formDataArray.map((data, index) => (
                    <div
                      key={index}
                      className="flex flex-row justify-between w-full h-22 border-dashed border-b-2  pb-1 items-center pr-2"
                    >
                      <div className="w-22 h-22">
                        <p className="text-[14px] text-center w-16">
                          {data.postArtikle}
                        </p>
                      </div>
                      <div className="w-32 h-22">
                        <p className="text-[14px] text-center w-20">
                          {data.bezeinchnung}
                        </p>
                      </div>
                      <div className="w-22 h-22">
                        <p className="text-[14px]">{data.menge}</p>
                      </div>
                      <div className="w-20 h-22">
                        <p className="text-[14px] text-center">
                          {(parseFloat(data.enzielprise) || 0).toFixed(2)} €
                        </p>
                      </div>
                      <div className="w-20 h-22">
                        <p className="text-[14px] text-center">
                          {data.netopreis} €
                        </p>
                      </div>
                      <div className="w-auto h-22">
                        <span
                          className="text-[16px] no-print text-center cursor-pointer hover:text-red-400"
                          onClick={() => handleDeleteItem(index)}
                        >
                          <MdDeleteForever />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="border-t-2 border-b-2 mt-2 mr-2 w-full bg-gray-200 border-textColorCancel">
                    <p className="text-sm ml-1">
                      Hiermit bestätige ich unter Hinweis auf das Metallgesetz die
                      einwandfreie Herkunft des gelieferten Materials.
                    </p>
                  </div>
                  <div className="flex w-full border-dashed border-b border-textColorCancel justify-between ml-1">
                    <h3 className="font-bold text-[14px]">Netto:</h3>
                    <h2 className="mr-8">{totalNetto} €</h2>
                  </div>
                  <div className="flex w-full border-dashed border-b border-textColorCancel justify-between ml-1">
                    <h3 className="font-bold text-[14px]">MwSt. 19%</h3>
                    <h2 className="mr-8">0,19%</h2>
                  </div>
                  <div className="flex border-b-2 w-full justify-between ml-1 bg-gray-200">
                    <h3 className="font-bold text-[14px]">Gesamtbetrag:</h3>
                    <h2 className="mr-4 font-bold mr-8">{totalWithMwSt} €</h2>
                  </div>
                  <div className=" flex justify-between p-2 mt-2 w-full border-textColorCancel">
                    <div className="w-1/2">
                      <p className="text-sm ml-1">Bankverbindung</p>
                      <p className="text-sm ml-1">Volksbank Niederrhein</p>
                      <p className="text-sm ml-1">IBAN: DE84 3546 1106</p>
                    </div>
                    <div className="w-1/2 flex flex-col items-end p-2 mr-4">
                      <p className="text-sm ml-1">8020 0530 12</p>
                      <p className="text-sm ml-1">BIC: GENODED1NRH</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    
    );
  };

  export default PreviewInvoice;
