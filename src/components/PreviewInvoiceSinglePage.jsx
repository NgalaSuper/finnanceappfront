import React, { useEffect, useState } from "react";
import { fetchInvoiceById } from "../data/data";
import { Link, useParams } from "react-router-dom";
import Logo from "../assets/images/Logo1.png";
import SaveandPrintButton from "./SaveandPrintButton";
import EditLight from "../assets/images/Edit_light.svg";
import PrintImg from "../assets/images/PrintImg.svg";

const PreviewInvoiceSinglePage = ({
  ustIdNr,
  dateInvoice,
  formDataArray,
  rechnungNr,
  invoiceTotals,
  selectedCompanyDetails,
  calculatedTotalNetto,
}) => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const getInvoice = async () => {
      try {
        const data = await fetchInvoiceById(id);
        setInvoice(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to load invoice:", error);
      }
    };
    getInvoice();
  }, [id]);

  const VAT_RATE = 0.19;

  const calculateTotals = () => {
    if (!invoice || !invoice.formDataArray)
      return { totalNetto: 0, totalWithMwSt: 0 };

    const calculatedTotalNetto = invoice.formDataArray.reduce((total, item) => {
      return total + (parseFloat(item.netopreis) || 0);
    }, 0);

    const calculatedMwSt = (calculatedTotalNetto * VAT_RATE).toFixed(2);
    const totalWithMwSt = (
      calculatedTotalNetto + parseFloat(calculatedMwSt)
    ).toFixed(2);

    return { totalNetto: calculatedTotalNetto.toFixed(2), totalWithMwSt };
  };

  console.log('RechnungNr:', rechnungNr);
  const { totalNetto, totalWithMwSt } = calculateTotals();

  const handlePrint = () => {
    const printContents = document.getElementById("previewInvoice")?.innerHTML;
    if (!printContents) {
      console.error('Element with ID "previewInvoice" not found.');
      return;
    }

    const newWindow = window.open("", "_blank");
    if (!newWindow) {
      console.error(
        "Failed to open a new window. Please check your browser settings."
      );
      return;
    }

    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          console.error("Could not access stylesheet", styleSheet);
          return "";
        }
      })
      .join("\n");

    newWindow.document.write(`
      <html>
        <head>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            body { font-family: Arial, sans-serif; font-size: 12px; color: #000; }
            #previewInvoice { width: 100%; background-color: white; margin: 0; }
            .no-print { display: none !important; }
            ${styles}
            @media print {
              /* Custom print styles here */
              @page { size: A4; }
            }
          </style>
        </head>
        <body>
          <div id="previewInvoice">${printContents}</div>
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
    <div>
      {invoice ? (
        <div className="flex flex justify-center w-full h-auto   mr-1 ml-1 ">
          <div
            className="w-[599px] bg-backgroundColor h-auto   rounded-lg shadow-md border rounded-lg mt-2 ml-1  mr-2"
            id="previewInvoice"
          >
            <div className="flex flex-row justify-between w-full  h-auto">
              <div className="w-full h-22">
                <img
                  src={Logo}
                  className="text-lg font-bold mb-4 w-44 h-22 object-fit"
                />

                {/* Flex container for Datum and Steuer Nr */}
              </div>

              <div className="w-64 mr-2 h-11  flex justify-start items-center">
              <h2 className="mr-2 flex flex-col items-end text-[14px]">Rechnung-Nr: {invoice.rechnungNr}</h2>
            

              {/* Moving Steuer Nr and Steuer ID to align properly */}
              <div className="flex flex-col items-end mr-2 text-[15px]">
                {/* We already show Steuer Nr and Steuer ID in the left section */}
                {/* This area might not be needed unless more info is needed */}
              </div>
            </div>
            </div>
            <div className="flex flex-row w-1/1 justify-between  ml-1">
              <div>
                <h2 className="mr-2 text-[14px] flex">
                  Datum: {invoice.dateInvoice}
                </h2>
                <h2 className="mr-2 text-[14px]">
                  Ust-idNr: {invoice.ustIdNr}
                </h2>
              </div>

              <div>
                <h2 className="mr-2 text-[14px] flex">
                  Steuer Nr: {invoice.selectedCompanyDetails.steuerNr}
                </h2>
                <h2 className="mr-2 text-[14px] flex flex-col items-end">
                  Steuer ID: {invoice.selectedCompanyDetails.steuerId}
                </h2>
              </div>
            </div>

            <div className="flex mt-4 ml-1">
              <div className="w-1/2">
                <div>
                  <p className="w-44 font-bold text-[14px] h-auto">
                    {invoice.companyName}
                  </p>
                  <p className="w-30 font-normal text-[14px] h-auto">
                    Adress: {invoice.selectedCompanyDetails.adress}
                  </p>
                  <p className="w-30 font-normal text-[14px] h-auto">
                    Tel: {invoice.selectedCompanyDetails.phoneNumber}
                  </p>
                </div>
              </div>
              <div className="w-1/2 flex flex-col items-end mr-2 ">
                <h4 className="font-bold text-[14px]">Emrush Kadrija</h4>
                <h4 className="text-[14px]">Dusseldorf, Germany</h4>
                <h4 className="text-[14px]">emrushkadrija@gmail.com</h4>
                <h4 className=" text-[14px]">+491111777111</h4>
              </div>
            </div>
            <div className="flex flex-col border-t-2 ml-2   mt-4 border-textColorCancel h-22">
              <div className="flex flex-col mt-2 justify-between">
                <div className="flex flex-row justify-between pr-2  border-b-2 border-textColorCancel mb-1">
                  <div className="w-22 h-22 ">
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

                <div className="w-full flex flex-col justify-between h-96 invoice-style border-none bg-white-100">
                  <div className="overflow-scroll bg-white-100 h-96 p-0 border-none w-full">
                    {invoice.formDataArray &&
                      invoice.formDataArray.map((item, index) => (
                        <div className="flex flex-row justify-between w-full h-22 border-dashed border-b-2 border-black pb-1 items-center border-r-0 shadow-none">
                          <div className="w-22 h-22  ">
                            <p className="text-[14px] text-center w-16">
                              {item.postArtikle}
                            </p>
                          </div>
                          <div className="w-32 h-22">
                            <p className="text-[14px] text-center w-20">
                              {item.bezeinchnung}
                            </p>
                          </div>
                          <div className="w-22 h-22">
                            <p className="text-[14px]">{item.menge}</p>
                          </div>
                          <div className="w-20 h-22">
                            <p className="text-[14px] text-center">
                              {(parseFloat(item.enzielprise) || 0).toFixed(2)} €
                            </p>
                          </div>
                          <div className="w-20 h-22">
                            <p className="text-[14px] text-center">
                              {item.netopreis} €
                            </p>
                          </div>
                          <div className="w-auto h-22">
                            <span
                              className="text-[16px] no-print text-center cursor-pointer hover:text-red-400"
                              onClick={() => handleDeleteItem(index)}
                            >
                              {/* <MdDeleteForever /> */}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div>
                    <div className="border-t-2 border-b-2 mt-2 w-full border-textColorCancel ">
                      <p className="text-sm ml-1">
                        Hiermit bestätige ich unter Hinweis auf das Metallgesetz
                        die einwandfreie Herkunft des gelieferten Materials.
                      </p>
                    </div>

                    <div className="flex w-full border-dashed border-b border-textColorCancel justify-between ml-1">
                      <h3 className="font-bold text-[14px]">Netto:</h3>
                      <h2 className="mr-4">{totalNetto} €</h2>
                    </div>
                    <div className="flex w-full border-dashed border-b border-textColorCancel justify-between ml-1">
                      <h3 className="font-bold text-[14px]">MwSt.</h3>
                      <h2 className="mr-4">0,19%</h2>
                    </div>
                    <div className="flex w-full  justify-between ml-1">
                      <h3 className="font-bold text-[14px]">Gesamtbetrag:</h3>
                      <h2 className="mr-4">{totalWithMwSt} €</h2>
                    </div>
                    <div className=" flex justify-between p-2 mt-2 w-full border-textColorCancel border-t-2">
                      <div className="w-1/2">
                        <p className="text-[14px]">Bankverbindung</p>
                        <p className="text-[14px]">Volksbank Niederrhein</p>
                        <p className="text-[14px]">IBAN: DE84 3546 1106</p>
                      </div>
                      <div className="w-1/2 flex flex-col items-end p-2 ">
                        <p className="text-[14px] ">8020 0530 12</p>
                        <p className="text-[14px] ">BIC: GENODED1NRH</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-0 ">
            <div className="fixed">
              {/* Container for button */}
              <Link
                to={{
                  pathname: `/edit/${invoice._id}`,
                  state: { companyName: invoice.companyName },
                }}
                ustIdNr={ustIdNr}
                dateInvoice={dateInvoice}
                formDataArray={formDataArray}
                totalNetto={totalNetto}
                invoiceTotals={invoiceTotals} // Pass invoiceTotals to SaveandPrintButton
                selectedCompanyDetails={selectedCompanyDetails}
                companyName={
                  selectedCompanyDetails
                    ? selectedCompanyDetails.companyName
                    : ""
                }
                calculatedTotalNetto={calculatedTotalNetto} // Pass calculatedTotalNetto
                totalWithMwSt={totalWithMwSt}
                className="bg-editButtonColor pt-2 pb-2 px-3 mt-4 space-x-2 border rounded-[5px] text-backgroundColor flex "
              >
                <div>
                  <img src={EditLight} alt="Edit" className="w-5 h-5" />
                </div>
                <div className="pr-2">Edit</div>
              </Link>

              {/* Save and Print Button */}
              <button
                text="Print"
                className="bg-backgroundButton pt-2 pb-2 px-3 mt-2 space-x-2 border rounded-[5px] text-backgroundColor flex  gap-2"
                dateInvoice={invoice.dateInvoice}
                companyName={invoice.companyName}
                ustIdNr={invoice.ustIdNr}
                selectedCompanyDetails={invoice.selectedCompanyDetails}
                formDataArray={invoice.formDataArray}
                totalNetto={totalNetto}
                totalWithMwSt={totalWithMwSt}
                onClick={handlePrint}
              >
                <span>
                  <img src={PrintImg} alt="" />
                </span>
                Print
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading invoice...</p>
      )}
    </div>
  );
};

export default PreviewInvoiceSinglePage;
