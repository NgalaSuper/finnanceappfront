import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchInvoiceById } from "../data/data";
import NeuArtikelButton from "./NeuArtikelButton";
import SaveandPrintButton from "./SaveandPrintButton";
import CancelButton from "./CancelButton";
import { MdDeleteForever } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { MdFileDownloadDone } from "react-icons/md";
import Logo from "../assets/images/Logo1.png";
import axios from "axios";
import {toast} from 'sonner';
import { API_BASE_URL } from "../data/data";

const EditPage = ({
  companies,
  companyName,
  dateInvoice,
  selectedCompanyDetails,
  rechnungNr,
}) => {
  const [formDataArray, setFormDataArray] = useState([]);
  const [itemList, setItemList] = useState([]);
  const navigate = useNavigate();
  const [newItems, setNewItems] = useState([]);
  const [postArtikle, setPostArtikle] = useState(1);
  const [bezeinchnung, setBezeinchnung] = useState("");
  const [menge, setMenge] = useState("");
  const [enzielprise, setEnzielprise] = useState("");
  const [netopreis, setNetopreis] = useState("");
  const [totalNetto, setTotalNetto] = useState(0);
  const [totalWithMwSt, setTotalWithMwSt] = useState(0);
  const { id } = useParams();
  const { id: invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedItem, setEditedItem] = useState({});
  const [newItem, setNewItem] = useState({
    bezeinchnung: "",
    menge: "",
    enzielprise: "",
    netopreis: "",
  });

  useEffect(() => {
    const getInvoice = async () => {
      try {
        const data = await fetchInvoiceById(id);
        setInvoice(data);
        const fetchedItems = data.formDataArray || [];
        setFormDataArray(fetchedItems);
        // Initialize postArtikle with the length of the fetched items + 1
        setPostArtikle(fetchedItems.length + 1);
      } catch (error) {
        console.error("Failed to load invoice:", error);
      }
    };
    getInvoice();
  }, [id]);

  const handleNewItemChange = (field, value) => {
    setNewItem({ ...newItem, [field]: value });
  };

  const handleSubmit = () => {
    // Create a new item object
    const submittedItem = {
      ...newItem,
      postArtikle, // Use the current postArtikle value
      menge,
      enzielprise,
      netopreis,
    };

    // Update the formDataArray with the new item
    setFormDataArray((prevFormDataArray) => {
      const updatedArray = [...prevFormDataArray, submittedItem];

      // Increment postArtikle for the next item
      const newPostArtikleNr = updatedArray.length + 1;
      setPostArtikle(newPostArtikleNr); // Update postArtikle to reflect the new total
      const { totalNetto, totalWithMwSt } = calculateTotals(prevFormDataArray, [
        submittedItem,
      ]);

      return updatedArray; // Return the new array with the added item
    });

    // Reset the form
    setNewItem({ bezeinchnung: "" });
    setMenge("");
    setEnzielprise("");
    setNetopreis("");
  };

  // Use useEffect to initialize postArtikle from the original formDataArray on load

  const VAT_RATE = 0.19;

  const calculateTotals = (items) => {
    const calculatedTotalNetto = items.reduce((total, item) => {
      return total + (parseFloat(item.netopreis) || 0);
    }, 0);
    const calculatedMwSt = (calculatedTotalNetto * VAT_RATE).toFixed(2);
    const calculatedTotalWithMwSt = (
      calculatedTotalNetto + parseFloat(calculatedMwSt)
    ).toFixed(2);
    return {
      totalNetto: calculatedTotalNetto.toFixed(2),
      totalWithMwSt: calculatedTotalWithMwSt,
    };
  };

  // Update totals when formDataArray changes
  useEffect(() => {
    const { totalNetto, totalWithMwSt } = calculateTotals(formDataArray);
    setTotalNetto(totalNetto);
    setTotalWithMwSt(totalWithMwSt);
  }, [formDataArray]);

  // Using useEffect to set netopreis based on menge and enzielprise
  useEffect(() => {
    const quantity = parseFloat(menge) || 0;
    const unitPrice = parseFloat(enzielprise) || 0;
    const total = quantity * unitPrice;
    setNetopreis(total.toFixed(2));
  }, [menge, enzielprise]);

  const finalizeSubmission = async () => {
    const updatedFormDataArray = [...formDataArray, newItem];
    setFormDataArray(updatedFormDataArray); // This will add the new item without deleting any existing items

    // Update the invoice on the server with the new array
    await updateInvoice({ ...invoice, formDataArray: updatedFormDataArray });
  };



  const updateInvoice = async (invoiceId, invoice) => {
    try {
        const cleanedUstIdNr = ustIdNr.value || ""; // Adjust this based on how `ustIdNr` is defined
        const changedInvoiceData = {
            companyName: companyName || invoice?.companyName,
            dateInvoice: dateInvoice || invoice?.dateInvoice,
            ustIdNr: cleanedUstIdNr,
            rechnungNr: rechnungNr,
            selectedCompanyDetails,
            formDataArray: formDataArray.map((item) => ({
                postArtikle: item.postArtikle,
                bezeinchnung: item.bezeinchnung,
                menge: item.menge,
                enzielprise: item.enzielprise,
                netopreis: item.netopreis,
            })),
        };

        console.log("Sending changed fields:", changedInvoiceData); // Log the data being sent

        const response = await axios.put(
            `${API_BASE_URL}/invoicesCompany/${invoiceId}`,
            changedInvoiceData,
            {
                headers: { "Content-Type": "application/json" },
            }
        );
        
        if (response.status === 200) {
            console.log("Invoice updated:", response.data);
            return response.data; // Return updated invoice
        } else {
            console.error("Failed to update invoice:", response.status);
            toast.error("Failed to update invoice. Please try again.");
        }
    } catch (error) {
        console.error("Error in updating invoice:", error.response ? error.response.data : error.message);
        toast.error("Error in updating invoice. Please try again.");
    }
};


  

const saveChangesUpdate = async () => {
  if (!invoiceId) {
      console.error("Invoice ID is missing.");
      return;
  }

  setIsSaving(true);
  try {
      const updatedInvoice = await updateInvoice(invoiceId, invoice); // Pass `invoice` to updateInvoice
      setInvoice(updatedInvoice); // Update state with the new invoice data
      toast.success("Invoice updated successfully");
  } catch (error) {
      console.error("Failed to save changes:", error);
      toast.error("Failed to update invoice. Please try again.");
  } finally {
      setIsSaving(false);
  }
};

  


  const handleButtonClick = () => {

    saveChangesUpdate();
  };
const handlePrintAndSave = async () => {
    if (!invoiceId) {
      console.error("Invoice ID is missing.");
      return;
    }

    const cleanedUstIdNr = ustIdNr.value || ""; // Ensure ustIdNr is correctly handled
    console.log("Sending formDataArray:", formDataArray);
    const changedInvoiceData = {
        companyName: companyName || invoice?.companyName,
        dateInvoice: dateInvoice || invoice?.dateInvoice,
        ustIdNr: cleanedUstIdNr,
        rechnungNr: rechnungNr,
        selectedCompanyDetails,
        formDataArray: formDataArray.map((item) => ({
            postArtikle: item.postArtikle,
            bezeinchnung: item.bezeinchnung,
            menge: item.menge,
            enzielprise: item.enzielprise,
            netopreis: item.netopreis,
        })),
    };

    console.log("Changed data being sent:", changedInvoiceData); // Debug log before sending the request

    try {
        const response = await axios.put(
            `${API_BASE_URL}/invoicesCompany/${invoiceId}`,
            changedInvoiceData,
            {
                headers: { "Content-Type": "application/json" },
            }
        );
        console.log("Invoice updated:", response.data); // Log response
    } catch (error) {
        console.error("Error in updating invoice:", error);
    }
};


  if (!invoice) {
    return <p>Loading invoice...</p>;
  }

  const handleDeleteItem = async (indexToDelete, itemId) => {
    try {
      // Send delete request to the database
      const response = await axios.delete(
        `${API_BASE_URL}/invoicesCompany/delete/${id}/${indexToDelete}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Update formDataArray in the local state
        const updatedArray = formDataArray.filter(
          (_, index) => index !== indexToDelete
        );
        setFormDataArray(updatedArray);

        // Update postArtikle count
        setPostArtikle((prevPostArtikle) => Math.max(prevPostArtikle - 1, 1));
      } else {
        console.error(
          "Failed to delete item from the database:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEditClick = (index) => {
    setEditingIndex(index); // Set the index of the item being edited
    setEditedItem(formDataArray[index]); // Populate the editedItem with the current item's data
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prev) => ({ ...prev, [name]: value })); // Update the editedItem state
  };

  const saveChanges = async () => {
    const updatedItems = [...formDataArray];
    updatedItems[editingIndex] = editedItem; // Save the edited item back to the array

  // Update the local state with the new data
    setFormDataArray(updatedItems);

    // You can calculate the new totals here if needed
    const { totalNetto, totalWithMwSt } = calculateTotals(updatedItems, []); // Pass the updated items

    console.log("Updated total netto:", totalNetto);
    console.log("Updated total with MwSt:", totalWithMwSt);

    // Reset the editing state
    setEditingIndex(null); // Close the input fields
    setEditedItem({});
    console.log("Updated Successfully "); // Clear the edited item
  };

  const handleInputChange = (field, value) => {
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      [field]: value,
    }));
  };

  // const getLastNumber = (value) => {
  //   const numbers = value.match(/\d+/g); // Get all numbers
  //   return numbers ? numbers[numbers.length - 1] : ""; // Return the last number or empty if none
  // };
  // const updateInvoice = async (updatedInvoice) => {
  //   try {
  //     const response = await axios.put(
  //       `http://localhost:5000/invoicesCompany/${id}`,
  //       updatedInvoice,
  //       {
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );
  //     if (response.status !== 200) throw new Error("Error updating invoice");
  //   } catch (error) {
  //     console.error("Error updating invoice:", error);
  //   }
  // };

  // const getChangedFields = (original, updated) => {
  //   const changedFields = {};
  //   for (const key in updated) {
  //     if (updated[key] !== original[key]) {
  //       changedFields[key] = updated[key];
  //     }
  //   }
  //   return changedFields;
  // };

  return (
    <div className="flex">
      <div className="w-1/2 h-auto ">
        <div className="w-[599px] bg-backgroundColor h-auto border rounded-lg mt-2 ml-1 font-manrope">
          <div className="m-2 pr-2 pl-2 pt-2 w-[580px] h-1/2 border pb-4 rounded-md shadow-md bg-backgroundColor">
            <div className="flex mb-4">
              <div className="flex flex-col mr-4 w-1/2">
                <label htmlFor="companyName" className="mb-2 text-gray-700">
                  Company Name:
                </label>
                <select
                  id="companyName"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  value={invoice.companyName || ""}
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                >
                  <option value="">Select Company Name</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.companyName}>
                      {company.companyName}
                    </option>
                  ))}
                  <option value="addNewCompany">Add New Company</option>
                </select>
              </div>
              <div className="flex flex-col w-1/2">
                <label htmlFor="RechnungNr" className="mb-2 text-gray-700">
                  Rechnung Nr:
                </label>
                <input
                  id="RechnungNr"
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  placeholder="Rechnung Number"
                  value={invoice.rechnungNr || ""}
                  onChange={(e) =>
                    handleInputChange("rechnungNr", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex flex-col mb-1 w-1/2">
                <label htmlFor="date" className="mb-2 text-gray-700">
                  Datum:
                </label>
                <input
                  id="date"
                  type="date"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  value={
                    invoice.dateInvoice
                      ? invoice.dateInvoice.substring(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    handleInputChange("dateInvoice", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col mb-1 w-1/2">
                <label htmlFor="ustIdNr" className="mb-2 text-gray-700">
                  Ust-idNr:
                </label>
                <input
                  id="ustIdNr"
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  placeholder="Ust-idNr"
                  value={invoice.ustIdNr || ""}
                  onChange={(e) => handleInputChange("ustIdNr", e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-4"></div>
          </div>

          {/* Form Data Array - Editable items */}
          <div className="m-2 pr-2 pl-2 pt-2 w-[590px] h-1/2 border rounded-md shadow-md pb-4 bg-backgroundColor">
            <div className="flex flex-col mb-1 w-1/1">
              <label htmlFor="bezeinchnung" className="mb-2 text-gray-700">
                Bezeichnung/ Spezifikation:
              </label>
              <select
                id="bezeinchnung"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                value={newItem.bezeinchnung}
                onChange={(e) =>
                  handleNewItemChange("bezeinchnung", e.target.value)
                }
              >
                <option value="Transportkosten">Transportkosten</option>
                <option value="Bager">Bager</option>
                <option value="Eskevator">Eskevator</option>
                <option value="Transportkosten">Transportkosten</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <div className="flex flex-col mb-1 w-1/2">
                <label htmlFor="postArtikle" className="mb-2 text-gray-700">
                  Pos ArtikelNr:
                </label>
                <input
                  id="postArtikle"
                  type="number"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  placeholder="Pos ArtikelNr"
                  value={postArtikle}
                  onChange={(e) => setPostArtikle(e.target.value)}
                  readOnly
                />
              </div>

              <div className="flex flex-col mb-1 w-1/2">
                <label htmlFor="menge" className="mb-2 text-gray-700">
                  Menge:
                </label>
                <input
                  id="menge"
                  type="number"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  placeholder="Menge"
                  value={menge}
                  onChange={(e) => setMenge(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex flex-col mb-1 w-1/2">
                <label htmlFor="enzielprise" className="mb-2 text-gray-700">
                  Einzelpreise:
                </label>
                <input
                  id="enzielprise"
                  type="number"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  placeholder="Einzelpreise"
                  value={enzielprise}
                  onChange={(e) => setEnzielprise(e.target.value)}
                />
              </div>

              <div className="flex flex-col mb-1 w-1/2">
                <label htmlFor="netopreis" className="mb-2 text-gray-700">
                  Nettopreis MWSt:
                </label>
                <input
                  id="netopreis"
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  placeholder="Nettopreis MWSt"
                  value={netopreis}
                  onChange={(e) => setNetopreis(e.target.value)}
                />
              </div>
            </div>
            <NeuArtikelButton handleSubmit={handleSubmit} />
          </div>

          <div className="flex justify-end gap-5 pr-2">
            <CancelButton to="/" />
            <button
              type="text"
              className="lg:bg-backgroundButton pt-2 pb-2 py-6 px-6 mb-4 mt-4 text-textColorButton hover:text-white hover:bg-[#2e85c5] float-right border-none rounded-lg sm:rounded-sm"
              style={{ borderRadius: "5px" }}
              onClick={handleButtonClick}
            >
              Update
            </button>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-auto mr-1 ml-1">
        {invoice ? (
          <div className="flex flex-col justify-center items-center w-full h-auto mr-1 ml-1">
            <div
              className="w-[599px] bg-backgroundColor h-auto rounded-lg shadow-md border rounded-lg mt-2 ml-1"
              id="previewInvoice"
            >
              <div className="flex flex-row justify-between w-full h-auto">
                <div className="w-full h-22">
                  <img
                    src={Logo}
                    className="text-lg font-bold mb-4 w-44 h-22 object-fit"
                  />
                </div>

                <div className="w-64 mr-2 h-11  flex justify-start items-center">
                  <h2 className="mr-2 flex flex-col items-end text-[14px]">
                    Rechnung-Nr: {invoice.rechnungNr}
                  </h2>
                </div>
              </div>

              <div className="flex flex-row w-1/1 justify-between ml-1">
                <div>
                  <h2 className="mr-2 text-[14px] flex">
                    Datum: {invoice.dateInvoice}
                  </h2>
                  <h2 className="mr-2  text-[14px]">
                    Ust-idNr: {invoice.ustIdNr}
                  </h2>
                </div>

                <div>
                  <h2 className="mr-2  text-[14px] flex justify-end">
                    Steuer Nr: {invoice.selectedCompanyDetails.steuerNr}
                  </h2>
                  <h2 className="mr-2  text-[14px] flex flex-col items-end justify-end">
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
                    <p className="w-30  text-[14px] h-auto">
                      Adress: {invoice.selectedCompanyDetails.adress}
                    </p>
                    <p className="w-30  text-[14px] h-auto">
                      Tel: {invoice.selectedCompanyDetails.phoneNumber}
                    </p>
                  </div>
                </div>
                <div className="w-1/2 flex flex-col items-end mr-2">
                  <h4 className="font-bold  text-[14px]">Emrush Kadrija</h4>
                  <h4 className=" text-[14px]">Dusseldorf, Germany</h4>
                  <h4 className=" text-[14px]">emrushkadrija@gmail.com</h4>
                  <h4 className=" text-[14px]">+491111777111</h4>
                </div>
              </div>

              <div className="flex flex-col  border-t-2 ml-2 mt-4 border-textColorCancel h-22">
                <div className="flex flex-col mt-2 justify-between">
                  <div className="flex flex-row justify-between w-full pr-1 border-b-2 border-textColorCancel mb-1">
                    <div className="w-16 h-22 ">
                      <p className="text-[12px]">Post ArtikelNr:</p>
                    </div>
                    <div className="w-28 h-22 ">
                      <p className="text-[12px]">Bezeichnung/ Spezifikation:</p>
                    </div>
                    <div className="w-22 h-22 ">
                      <p className="text-[12px]">Menge:</p>
                    </div>
                    <div className="w-18 h-22 ">
                      <p className="text-[12px]">Einzelpreise:</p>
                    </div>
                    <div className="w-22 h-22">
                      <p className="text-[12px]">Nettopreis MWSt:</p>
                    </div>
                    <div className="w-auto h-22"></div>
                  </div>

                  <div className="w-full flex flex-col justify-between h-96 invoice-style">
                    <div className="overflow-scroll">
                      {/* {invoice.formDataArray &&
                          invoice.formDataArray.map((item, index) => (
                            <div
                              key={index}
                              className="flex flex-row justify-between w-full h-22 border-dashed border-b-2 border-textColorCancel pb-1 items-center pr-2"
                            >
                              <div className="w-22 h-22">
                                {editingIndex === index ? (
                                  <input
                                    type="text"
                                    name="postArtikle"
                                    value={editedItem.postArtikle}
                                    onChange={(e) => {
                                      handleChange(e); // Call your existing handleChange
                                      const lastNumber = getLastNumber(
                                        e.target.value
                                      ); // Extract the last number
                                      setPostArtikle(lastNumber); // Set the last number to postArtikle
                                    }}
                                    className="text-[14px] text-center w-12"
                                  />
                                ) : (
                                  <p className="text-[14px] text-center w-16">
                                    {item.postArtikle}
                                  </p>
                                )}
                              </div>
                              <div className="w-32 h-22 border border-red-500">
                                {editingIndex === index ? (
                                  <input
                                    type="text"
                                    name="bezeinchnung"
                                    value={editedItem.bezeinchnung}
                                    onChange={handleChange}
                                    className="text-[14px] text-center w-32"
                                  />
                                ) : (
                                  <p className="text-[14px] text-center w-24">
                                    {item.bezeinchnung}
                                  </p>
                                )}
                              </div>
                              <div className="w-22 h-22">
                                {editingIndex === index ? (
                                  <input
                                    type="number"
                                    name="menge"
                                    value={editedItem.menge}
                                    onChange={handleChange}
                                    className="text-[14px] w-12"
                                  />
                                ) : (
                                  <p className="text-[14px]">{item.menge}</p>
                                )}
                              </div>
                              <div className="w-20 h-22 ml-8">
                                {editingIndex === index ? (
                                  <input
                                    type="text"
                                    name="enzielprise"
                                    value={editedItem.enzielprise}
                                    onChange={handleChange}
                                    className="text-[14px] text-center w-14"
                                  />
                                ) : (
                                  <p className="text-[14px] text-center">
                                    {(parseFloat(item.enzielprise) || 0).toFixed(
                                      2
                                    )}{" "}
                                    €
                                  </p>
                                )}
                              </div>
                              <div className="w-22 h-22 ml-5">
                                {editingIndex === index ? (
                                  <input
                                    type="text"
                                    name="netopreis"
                                    value={editedItem.netopreis}
                                    onChange={handleChange}
                                    className="text-[14px] text-center w-14"
                                  />
                                ) : (
                                  <p className="text-[14px] text-center">
                                    {item.netopreis} €
                                  </p>
                                )}
                              </div>
                              <div className="w-10 flex justify-between h-22">
                                {editingIndex === index ? (
                                  <span
                                    className="text-[20px] no-print text-center cursor-pointer hover:text-green-400"
                                    onClick={saveChanges}
                                  >
                                    <MdFileDownloadDone />
                                  </span>
                                ) : (
                                  <span
                                    className="text-[16px] no-print text-center cursor-pointer hover:text-red-400"
                                    onClick={() => handleEditClick(index)}
                                  >
                                    <MdModeEditOutline />
                                  </span>
                                )}
                                <span
                                  className="text-[16px] no-print text-center cursor-pointer hover:text-red-400"
                                  onClick={() =>
                                    handleDeleteItem(index, item._id)
                                  }
                                >
                                  <MdDeleteForever />
                                </span>
                              </div>
                            </div>
                          ))} */}
                      {formDataArray.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-row justify-between w-full h-22 border-dashed border-b-2 border-textColorCancel pb-1 items-center pr-2"
                        >
                          <div className="w-22 h-22">
                            {editingIndex === index ? (
                              <input
                                type="text"
                                name="postArtikle"
                                value={editedItem.postArtikle || ""} // Use editedItem.postArtikle or fallback to empty string
                                onChange={handleChange}
                                className="text-[14px] text-center w-12 h-6 items-center  flex flex-col"
                              />
                            ) : (
                              <p className="text-[14px] text-center w-12">
                                {item.postArtikle}
                              </p>
                            )}
                          </div>
                          <div className="w-32 h-22 ml-8 ">
                            {editingIndex === index ? (
                              <input
                                type="text"
                                name="bezeinchnung"
                                value={editedItem.bezeinchnung || ""} // Use editedItem.bezeinchnung or fallback to empty string
                                onChange={handleChange}
                                className="text-[14px] text-center w-32 text-[14px] h-6 items-center  flex flex-col"
                              />
                            ) : (
                              <p className="text-[14px] text-center w-24">
                                {item.bezeinchnung}
                              </p>
                            )}
                          </div>
                          <div className="w-12 h-22 pl-2 ">
                            {editingIndex === index ? (
                              <input
                                type="number"
                                name="menge"
                                value={editedItem.menge || ""} // Use editedItem.menge or fallback to empty string
                                onChange={handleChange}
                                className="text-[14px] w-12 h-6 items-center text-center flex flex-col"
                              />
                            ) : (
                              <p className="text-[14px]">{item.menge}</p>
                            )}
                          </div>
                          <div className="w-20 h-22 ">
                            {editingIndex === index ? (
                              <input
                                type="text"
                                name="enzielprise"
                                value={editedItem.enzielprise || ""} // Correctly reference editedItem.enzielprise
                                onChange={handleChange}
                                className="text-[14px] text-center w-14 h-6 items-center  flex flex-col"
                              />
                            ) : (
                              <p className="text-[14px] text-center">
                                {(parseFloat(item.enzielprise) || 0).toFixed(2)}{" "}
                                €
                              </p>
                            )}
                          </div>
                          <div className="w-22 h-22 ml-5">
                            {editingIndex === index ? (
                              <input
                                type="text"
                                name="netopreis"
                                value={editedItem.netopreis || ""} // Use editedItem.netopreis or fallback to empty string
                                onChange={handleChange}
                                className="text-[14px] text-center w-14 h-6 items-center  flex flex-col"
                              />
                            ) : (
                              <p className="text-[14px] text-center">
                                {(parseFloat(item.netopreis) || 0).toFixed(2)} €
                              </p>
                            )}
                          </div>
                          <div className="w-10 flex justify-between h-22">
                            {editingIndex === index ? (
                              <span
                                className="text-[20px] no-print text-center cursor-pointer hover:text-green-400"
                                onClick={saveChanges} // Call saveChanges when saving the edited item
                              >
                                <MdFileDownloadDone />
                              </span>
                            ) : (
                              <span
                                className="text-[16px] no-print text-center cursor-pointer hover:text-red-400"
                                onClick={() => handleEditClick(index)} // Edit button to enter edit mode
                              >
                                <MdModeEditOutline />
                              </span>
                            )}
                            <span
                              className="text-[16px] no-print text-center cursor-pointer hover:text-red-400"
                              onClick={() => handleDeleteItem(index)} // Delete button
                            >
                              <MdDeleteForever />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="border-t-2 border-b-2 mt-2 w-full border-textColorCancel">
                        <p className="text-sm ml-1">
                          Hiermit bestätige ich unter Hinweis auf das
                          Metallgesetz die einwandfreie Herkunft des gelieferten
                          Materials.
                        </p>
                      </div>
                      <div className="flex w-full border-dashed border-b border-textColorCancel justify-between ml-1">
                        <h3 className="font-bold text-[14px]">Netto:</h3>
                        <h2 className="mr-4">{totalNetto}</h2>
                      </div>
                      <div className="flex w-full border-dashed border-b border-textColorCancel justify-between ml-1">
                        <h3 className="font-normal text-[14px]">MwSt.</h3>
                        <h2 className="mr-4">0,19%</h2>
                      </div>
                      <div className="flex w-full justify-between ml-1">
                        <h3 className="font-bold text-[14px]">Gesamtbetrag:</h3>
                        <h2 className="mr-4">{totalWithMwSt}</h2>
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
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EditPage;
