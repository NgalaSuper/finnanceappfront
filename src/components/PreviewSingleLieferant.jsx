import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchLieferantById } from "../data/data";
import Logo from "../assets/images/Logo1.png";
import EditLight from "../assets/images/Edit_light.svg";
import PrintImg from "../assets/images/PrintImg.svg";

const PreviewSingleLieferant = ({
  formDataArray,
  rechnungNr,
  dateLieferant,
  baustelle,
  spedituer,
  selectedCompanyDetails,
}) => {
  const { id } = useParams();
  const [leiferant, setLeiferant] = useState(null);

  useEffect(() => {
    const getLieferant = async () => {
      try {
        const data = await fetchLieferantById(id);
        setLeiferant(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to load invoice:", error);
      }
    };
    getLieferant();
  }, [id]);

  const calculatedTotalNetto = (leiferant?.formDataArray || []).reduce(
    (total, item) => {
      return total + (parseFloat(item.gewicht) || 0);
    },
    0
  );

  console.log("Total Gewicht:", calculatedTotalNetto);

  useEffect(() => {
    console.log("selectedCompanyDetails:", selectedCompanyDetails);
  }, [selectedCompanyDetails]);

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
            body { font-family: Arial, sans-serif; }
            #previewInvoice { width: 599px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin: 10px; padding: 20px; }
  table { border-collapse: collapse; }
  th, td, tfoot { border: none !important; padding: 8px;  }
  tfoot { border-bottom: none !important; }
  .no-print { display: none !important; }
            ${styles}
          </style>
        </head>
        <body>
          <div class="invoice">${printContents}</div>
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
      {leiferant ? (
        <div className="flex flex justify-center w-full h-auto mr-1 ml-1 ">
          <div
            className=" w-[599px] bg-backgroundColor h-auto rounded-lg shadow-md  ml-1"
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
                <h2 className=" flex flex-col items-end text-[14px]">
                  Wiegeschein-Nr.: {leiferant.rechnungNr}
                </h2>
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
                <h2 className="mr-2 text-[14px] flex">
                  Datum:{" "}
                  {new Date(leiferant?.dateLieferant).toLocaleDateString(
                    "de-DE"
                  )}
                </h2>
              </div>

              <div className="mr-6">
                <h2 className="mr-2 text-[14px] flex justify-end">
                  Steuer Nr: {leiferant.selectedCompanyDetails.steuerNr}
                </h2>
                <h2 className="mr-2 text-[14px] flex flex-col items-end">
                  Steuer ID: {leiferant.selectedCompanyDetails.steuerId}
                </h2>
              </div>
            </div>

            <div className="flex mt-4 ml-1">
              <div className="w-1/2">
                <div>
                  <p className="w-44 font-bold text-[14px] h-auto">
                    {leiferant.companyName}
                  </p>
                  <p className="w-30 font-normal  text-[12px] h-auto">
                    Adress: {leiferant.selectedCompanyDetails.adress}
                  </p>
                  <p className="w-30 font-normal text-[14px] h-auto">
                    Tel: {leiferant.selectedCompanyDetails.phoneNumber}
                  </p>
                </div>
              </div>
              <div className="w-1/2 flex flex-col items-end mr-4 ">
                <h4 className="font-bold text-[14px]">Emrush Kadrija</h4>
                <h4 className="text-[14px]">Dusseldorf, Germany</h4>
                <h4 className="text-[14px]">emrushkadrija@gmail.com</h4>
                <h4 className="text-[14px]">Tel: +491111777111</h4>
              </div>
            </div>
            <div className="h-auto w-full ">
              <div className="text-[16px] p-2 font-bold">Lieferant</div>
              <div className="w-full flex justify-between p-2">
                <div className="text-[14px] ">
                  <span className="font-bold">Baustelle:</span>{" "}
                  {leiferant?.baustelle}
                </div>
                <div className="mr-4 text-[14px] ">
                  <span className="font-bold">Lieferant:</span>{" "}
                  {leiferant?.leiferant}
                </div>
              </div>
              <div className="p-2 text-[14px] ">
                {" "}
                <span className="font-bold">Spediteur:</span>{" "}
                {leiferant?.spedituer}
              </div>
            </div>

            {/* <div className="flex flex-col border-t-2 ml-2 mt-2 border-textColorCancel w-full h-22"> */}
            <div className="w-full flex flex-col justify-between h-96 invoice-style">
              <table className=" w-full border-t-2   mt-2 border-textColorCancel">
                <thead>
                  <tr className="bg-gray-200 pr-2 border-b-2 border-textColorCancel mb-1">
                    <th className="w-28 h-10 text-[12px] text-center">
                      Post ArtikelNr:
                    </th>
                    <th className="w-28 h-10 text-[12px] text-center">
                      AVV-Nr:
                    </th>
                    <th className="w-28 h-10 text-[12px] text-center">
                      KFZ/ID:
                    </th>
                    <th className="w-28 h-10 text-[12px] text-center">
                      Artikel:
                    </th>
                    <th className="w-20 h-10 text-[12px] text-center">
                      Datum:
                    </th>
                    <th className="w-20 h-10 text-[12px] text-center">Zeit:</th>
                    <th className="w-20 h-10 text-[12px] text-center">
                      Gewicht:
                    </th>
                    <th className="w-4 h-10"> </th>
                  </tr>
                </thead>

                <tbody className="invoice-style w-full ">
                  {leiferant.formDataArray &&
                    leiferant.formDataArray.map((item, index) => (
                      <tr
                        key={index}
                        className=" h-8 border-dashed border-b-2 pb-1"
                      >
                        <td className=" h-auto text-[14px] text-center">
                          {item.postArtikle}
                        </td>
                        <td className=" h-auto text-[14px] text-center">
                          {item.avvnr}
                        </td>
                        <td className=" h-auto text-[14px] text-center">
                          {item.kfzId}
                        </td>
                        <td className="h-auto text-[14px] text-center">
                          {item.artikel}
                        </td>
                        <td className=" h-auto text-[12px] text-center">
                          {item.datumArtikel.substring(0, 10)}
                        </td>
                        <td className=" h-auto text-[14px] text-center">
                          {item.zeit}
                        </td>
                        <td className=" h-auto text-[14px] text-center">
                          {item.gewicht} kg
                        </td>
                        <td className="w- h-22"></td>
                      </tr>
                    ))}
                </tbody>

                <tfoot className="w-full pt-20 border-2 border-t ">
                  <tr className="border-b-2 bg-gray-200">
                    <td colSpan="4" className="font-bold text-[14px] text-left">
                      Nettogewicht:
                    </td>
                    <td colSpan="6" className="font-bold text-right p-2">
                      {calculatedTotalNetto} kg
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="flex justify-between p-2 mt-2 w-full border-textColorCancel">
              <div className="w-full flex justify-around">
                <p className="text-sm ml-1">Fahrerunterschrift</p>
                <p className="text-sm ml-1">Kundenunterschrift Niederrhein</p>
              </div>
            </div>

            {/* </div> */}
          </div>
          <div className="flex flex-col space-y-0 ">
            <div className="fixed">
              {/* Container for button */}
              <Link
                to={{
                  pathname: `/lieferant/${leiferant._id}`,
                  state: {
                    companyName: selectedCompanyDetails
                      ? selectedCompanyDetails.companyName
                      : "",
                    dateLieferant: dateLieferant,
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
                dateLieferant={leiferant.dateInvoice}
                companyName={leiferant.companyName}
                selectedCompanyDetails={leiferant.selectedCompanyDetails}
                formDataArray={leiferant.formDataArray}
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

export default PreviewSingleLieferant;
