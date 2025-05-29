import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Logo from "../assets/images/Logo1.png";
import EditLight from "../assets/images/Edit_light.svg";
import PrintImg from "../assets/images/PrintImg.svg";
import { fetchGutschrift } from "../data/data";

const PreviewSingleGutschrift = ({
  dateGutschrift,
  selectedCompanyDetails,
  formDataArray,
}) => {
  const [totalNetto, setTotalNetto] = useState(0);
  const [totalWithMwSt, setTotalWithMwSt] = useState(0);
  const { id } = useParams();
  const [gutschrift, setGutschrift] = useState(null);

  useEffect(() => {
    const getGutschrift = async () => {
      try {
        const data = await fetchGutschrift(id);
        setGutschrift(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to load invoice:", error);
      }
    };
    getGutschrift();
  }, [id]);

  const calculateTotals = (items) => {
    const calculatedTotalNetto = items.reduce((total, item) => {
      return total + (parseFloat(item.gesamt) || 0);
    }, 0);
    const calculatedMwSt = (calculatedTotalNetto * 0).toFixed(2);
    const calculatedTotalWithMwSt = (
      calculatedTotalNetto + parseFloat(calculatedMwSt)
    ).toFixed(2);
    return {
      totalNetto: calculatedTotalNetto.toFixed(2),
      totalWithMwSt: calculatedTotalWithMwSt,
    };
  };

  useEffect(() => {
    // If gutschrift is fetched and has a formDataArray with data,
    // calculate totals from that array.
    if (
      gutschrift &&
      gutschrift.formDataArray &&
      Array.isArray(gutschrift.formDataArray) &&
      gutschrift.formDataArray.length > 0
    ) {
      const { totalNetto, totalWithMwSt } = calculateTotals(gutschrift.formDataArray);
      setTotalNetto(totalNetto);
      setTotalWithMwSt(totalWithMwSt);
    }
  }, [gutschrift]);

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
      {gutschrift ? (
        <div className="flex flex justify-center w-full h-auto mr-1 ml-1">
          <div
            className=" w-[599px] bg-backgroundColor h-auto rounded-lg shadow-md  ml-1 border-t-[5px] border-backgroundButton "
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

              <div className="w-64 mr-2 h-11  flex flex-col justify-start items-center mt-2">
                <h2 className="mr-2 flex flex-col items-end text-[14px]">
                  Gutschrifts-Nr: {gutschrift.rechnungNr}
                </h2>
                <h2 className="mr-2 flex flex-col items-end text-[14px]">
                  Kunden-Nr: {gutschrift.kundenumer}
                </h2>

                {/* Moving Steuer Nr and Steuer ID to align properly */}
                <div className="flex flex-col items-end mr-2 text-[15px]">
                  {/* We already show Steuer Nr and Steuer ID in the left section */}
                  {/* This area might not be needed unless more info is needed */}
                </div>
              </div>
            </div>

            <div className="flex flex-row w-full justify-between ml-1">
              <div>
                <h2 className="mr-2 text-[14px] flex">
                  Datum: {gutschrift.dateGutschrift.substring(0, 10)}
                </h2>
                <h2 className="mr-2 text-[14px]">
                  Ust-idNr: {gutschrift.ustIdNr}
                </h2>
              </div>

              <div className="mr-6">
                <h2 className="mr-2 text-[14px] flex justify-end">
                  Steuer Nr: {gutschrift.selectedCompanyDetails.steuerNr}
                </h2>
                <h2 className="mr-2 text-[14px] flex flex-col items-end">
                  Steuer ID: {gutschrift.selectedCompanyDetails.steuerId}
                </h2>
              </div>
            </div>

            <div className="flex mt-4 ml-1">
              <div className="w-1/2">
                <div>
                  <p className="w-44 font-bold text-[14px] h-auto">
                    {gutschrift.companyName}
                  </p>
                  <p className="w-30 font-normal  text-[12px] h-auto">
                    Adress: {gutschrift.selectedCompanyDetails.adress}
                  </p>
                  <p className="w-30 font-normal text-[14px] h-auto">
                    Tel: {gutschrift.selectedCompanyDetails.phoneNumber}
                  </p>
                </div>
              </div>
              <div className="w-1/2 flex flex-col items-end mr-8 ">
                <h4 className="font-bold text-[14px]">Emrush Kadrija</h4>
                <h4 className="text-[14px]">Dusseldorf, Germany</h4>
                <h4 className="text-[14px]">emrushkadrija@gmail.com</h4>
                <h4 className="text-[14px]">Tel: +491111777111</h4>
              </div>
            </div>
            <div className="h-20 w-full ">
              <p className="text-[14px] font-bold">Gutschrift</p>
              <p
                className=" ml-1 text-[12px]"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {gutschrift.titelKoment}
              </p>
            </div>

            <div className="flex flex-col border-t-2 ml-2 mt-2 border-textColorCancel  h-22">
              <div className="flex flex-col  justify-between">
                <div className="flex flex-row justify-between bg-gray-200 pr-2 border-b-2 border-textColorCancel mb-1">
                  <div className="w-28 h-22">
                    <p className="text-[12px]">Post ArtikelNr:</p>
                  </div>
                  <div className="w-28 h-22">
                    <p className="text-[12px]">Baustelle:</p>
                  </div>
                  <div className="w-28 h-22">
                    <p className="text-[12px] text-center">Material:</p>
                  </div>
                  <div className="w-20 h-22">
                    <p className="text-[12px] text-center">KG:</p>
                  </div>
                  <div className="w-20 h-22">
                    <p className="text-[12px]">Kg/Preise:</p>
                  </div>
                  <div className="w-20 h-22">
                    <p className="text-[12px]">Gesamt:</p>
                  </div>
                  <div className="w-auto h-22"></div>
                </div>

                <div className="w-full flex flex-col justify-between h-96 invoice-style">
                  <div className=" w-full">
                    {gutschrift.formDataArray &&
                      gutschrift.formDataArray.map((data, index) => (
                        <div
                          key={index}
                          className="flex flex-row justify-between w-full h-22 border-dashed border-b-2  pb-1 items-center "
                        >
                          <div className="w-22 h-22">
                            <p className="text-[14px] text-center w-16">
                              {data.postArtikle}
                            </p>
                          </div>
                          <div className="w-22 h-22">
                            <p className="text-[14px] text-center w-22">
                              {data.baustelle}
                            </p>
                          </div>
                          <div className="w-32 h-22">
                            <p className="text-[14px] text-center">
                              {data.material}
                            </p>
                          </div>
                          <div className="w-26 h-22">
                            <p className="text-[14px]">{data.menge}</p>
                          </div>
                          <div className="w-16 h-22">
                            <p className="text-[14px] text-center">
                              {data.kgpries} €
                            </p>
                          </div>
                          <div className="w-16 h-22">
                            <p className="text-[14px] text-center">
                              {data.gesamt} €
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
                    <div className="border-t-2 border-b-2 mt-2 mr-2 w-full bg-gray-200 border-textColorCancel">
                      <p
                        className=" ml-1 text-[12px]"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {gutschrift.koment}
                      </p>
                    </div>
                    <div className="flex w-full border-dashed border-b border-textColorCancel justify-between ml-1">
                      <h3 className="font-bold text-[14px]">Summe Netto:</h3>
                      <h2 className="mr-8">{totalWithMwSt} €</h2>
                    </div>
                    <div className="flex w-full border-dashed border-b border-textColorCancel justify-between ml-1">
                      <h3 className="font-bold text-[14px]">MwSt. 0%</h3>
                      <h2 className="mr-8">0%</h2>
                    </div>
                    <div className="flex border-b-2 w-full justify-between ml-1 bg-gray-200">
                      <h3 className="font-bold text-[14px]">Gesamt:</h3>
                      <h2 className="mr-4 font-bold mr-8">{totalWithMwSt} €</h2>
                    </div>
                    <div className=" flex justify-between p-2 mt-2 w-full border-textColorCancel">
                      <div className="w-1/2">
                        <p className="text-sm ml-1">Bankverbindung</p>
                        <p className="text-sm ml-1">Volksbank Niederrhein</p>
                        <p className="text-sm ml-1">
                          IBAN DE84 3546 1106 8020 0530 12
                        </p>
                        <p className="text-sm ml-1">BIC/Swift GENODED1NRH</p>
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
                  pathname: `/gutschrift/${gutschrift._id}`,
                  state: {
                    companyName: selectedCompanyDetails
                      ? selectedCompanyDetails.companyName
                      : "",
                    dateGutschrift: dateGutschrift,
                    formDataArray: formDataArray,
                    selectedCompanyDetails: selectedCompanyDetails,
                  },
                }}
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
                dateLieferant={gutschrift.dateInvoice}
                companyName={gutschrift.companyName}
                selectedCompanyDetails={gutschrift.selectedCompanyDetails}
                formDataArray={gutschrift.formDataArray}
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

export default PreviewSingleGutschrift;
