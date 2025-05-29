import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL, fetchGuschriftById } from "../data/data";
import NeuArtikelButton from "./NeuArtikelButton";
import SaveandPrintButton from "./SaveandPrintButton";
import CancelButton from "./CancelButton";
import { MdDeleteForever } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { MdFileDownloadDone } from "react-icons/md";
import Logo from "../assets/images/Logo1.png";
import axios from "axios";
import { toast } from "sonner";


const EditSafetyForm = ({
  companies,
  companyName,
  dateGutschrift,
  selectedCompanyDetails,
  rechnungNr,
  koment,
  titelKoment
}) => {
  const [formDataArray, setFormDataArray] = useState([]);
  const [postArtikle, setPostArtikle] = useState(1);
  const navigate = useNavigate();
  const [menge, setMenge] = useState("");
  const [kgpries, setKgpries] = useState("");
  const [baustelle, setBaustelle] = useState("");
  const [gesamt, setgesamt] = useState("");
  const [totalNetto, setTotalNetto] = useState(0);
  const [totalWithMwSt, setTotalWithMwSt] = useState(0);
  const { id } = useParams();
  const { id: gutschriftId } = useParams();
  const [gutschrift, setGutschrift] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedItem, setEditedItem] = useState({});
  const [newItem, setNewItem] = useState({
    material: "",
    menge: "",
    kgpries: "",
    gesamt: "",
    baustelle: "",
  });

  useEffect(() => {
    console.log("ID passed to useEffect:", id);
    const getGutschrift = async () => {
      try {
        const data = await fetchGuschriftById(id);
        console.log("Fetched data:", data);
        setGutschrift(data);
        setFormDataArray(data.formDataArray || []); // Fallback to empty array
        setPostArtikle((data.formDataArray || []).length + 1); // Safely access length
      } catch (error) {
        console.error("Error fetching Gutschrift:", error.message);
      }
    };
    if (id) getGutschrift();
  }, [id]);

  const handleNewItemChange = (field, value) => {
    setNewItem({ ...newItem, [field]: value });
  };

 

  const handleSubmit = () => {
    const submittedItem = {
      ...newItem,
      postArtikle,
      menge,
      kgpries,
      gesamt,
      baustelle,
    };

    setFormDataArray((prevFormDataArray) => {
      const updatedArray = [...prevFormDataArray, submittedItem];
      const newPostArtikleNr = updatedArray.length + 1;
      setPostArtikle(newPostArtikleNr);
      return updatedArray;
    });

    setNewItem({ material: "", baustelle: "" });
    setMenge("");
    setKgpries("");
    setgesamt("");
    setBaustelle("");
  };

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
    if (formDataArray.length > 0) {
      const { totalNetto, totalWithMwSt } = calculateTotals(formDataArray);
      setTotalNetto(totalNetto);
      setTotalWithMwSt(totalWithMwSt);
    }
  }, [formDataArray]);

  useEffect(() => {
    const quantity = parseFloat(menge.replace(",", "."));
    const unitPrice = parseFloat(kgpries.replace(",", "."));
    if (!isNaN(quantity) && !isNaN(unitPrice)) {
      const total = quantity * unitPrice;
      setgesamt(total.toFixed(2));
    } else {
      console.error("Invalid values", menge, kgpries);
    }
  }, [menge, kgpries]);

  const handleEditClick = (index) => {
    setEditingIndex(index); // Set the index of the item being edited
    setEditedItem(formDataArray[index]); // Populate the editedItem with the current item's data
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prev) => ({ ...prev, [name]: value })); // Update the editedItem state
  };



  const handleInputChange = (field, value) => {
    setGutschrift((prevGutschrift) => ({
      ...prevGutschrift,
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

  const handlePrintAndSave = async () => {
    if (!gutschriftId) {
      console.error("Invoice ID is missing.");
      return;
    }
  };

  // Ensure ustIdNr holds only the input value, not the element itself
  // const cleanedUstIdNr = ustIdNr.value || ""; // Adjust this line based on how `ustIdNr` is defined

  const handleButtonBack = async () => {
    if (!gutschriftId) {
      console.error("Gutschrift ID is missing.");
      return;
    }
    await gutschriftUpdate();
  };

  const removeCircularReferences = (data) => {
    const seen = new WeakSet();
    return JSON.parse(
      JSON.stringify(data, (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return; // remove circular references
          }
          seen.add(value);
        }
        return value;
      })
    );
  };

  const gutschriftUpdate = async () => {
    const cleanedUstIdNr = ustIdNr.value || "";
    const changedGuschriftData = {
      companyName: companyName || gutschrift?.companyName,
      dateGutschrift: dateGutschrift || gutschrift?.dateGutschrift,
      ustIdNr: cleanedUstIdNr,
      rechnungNr: rechnungNr || gutschrift?.rechnungNr,
      koment:koment || gutschrift?.koment,
      titelKoment:titelKoment || gutschrift?.titelKoment,
      selectedCompanyDetails,
      formDataArray: formDataArray.map((item) => ({
        postArtikle: item.postArtikle,
        material: item.material,
        menge: item.menge,
        kgpries: item.kgpries,
        gesamt: item.gesamt,
        baustelle:item.baustelle,
      })),
    };

    console.log("Sending changed fields:", changedGuschriftData);

    try {
      const response = await axios.put(
        `${API_BASE_URL}/savedGutschrift/${gutschriftId}`,
        changedGuschriftData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Invoice updated:", response.data);
      toast.success("Gutschrift updated successfully");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const handleDeleteItem = async (indexToDelete, itemId) => {
    try {
      // Send delete request to the database
      const response = await axios.delete(
        `${API_BASE_URL}/savedGutschrift/delete/${id}/${indexToDelete}`,
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

  return (
    <div className="flex">
      <div className="w-1/2 h-auto ">
        <div className="w-[599px] bg-backgroundColor h-auto border rounded-lg mt-2 ml-1 font-manrope ">
          <div className="m-2 pr-2 pl-2 pt-2 w-[580px] h-1/2 border pb-4 rounded-md shadow-md bg-backgroundColor">
            <div className="flex mb-4">
              <div className="flex flex-col mr-4 w-1/2">
                <label htmlFor="companyName" className="mb-2 text-gray-700">
                  Company Name:
                </label>
                <select
                  id="companyName"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  value={gutschrift?.companyName || ""}
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
                  Gutschrifts-Nr:
                </label>
                <input
                  id="RechnungNr"
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  placeholder="Rechnung Number"
                  value={gutschrift?.rechnungNr || ""}
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
                    gutschrift?.dateGutschrift
                      ? gutschrift.dateGutschrift
                      : ""
                  }
                  onChange={(e) =>
                    handleInputChange("dateGutschrift", e.target.value)
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
                  value={gutschrift?.ustIdNr || ""}
                  onChange={(e) => handleInputChange("ustIdNr", e.target.value)}
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex flex-col mb-1 w-1/2">
                <label htmlFor="kundenumer" className="mb-2 text-gray-700">
                  Kunden-Nr:
                </label>
                <input
                  id="kundenumer"
                  type="text"
                  placeholder="Kunden-Nr"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  value={gutschrift?.kundenumer || ""}
                  onChange={(e) =>
                    handleInputChange("kundenumer", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col mb-1 w-1/2">
                <label htmlFor="titelKoment" className="mb-2 text-gray-700">
                  Text:
                </label>
                <input
                  id="titelKoment"
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  placeholder="Einen Kommentar schrieben"
                  value={gutschrift?.titelKoment || ""}
                  onChange={(e) =>
                    handleInputChange("titelKoment", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex space-x-4"></div>
          </div>

          {/* Form Data Array - Editable items */}
          <div className="m-2 pr-2 pl-2 pt-2 w-[590px] h-1/2 border rounded-md shadow-md pb-4 bg-backgroundColor">
            <div className="flex flex-col mb-1 w-1/1">
              <label htmlFor="material" className="mb-2 text-gray-700">
                Material:
              </label>
              <select
                id="material"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                value={newItem.material}
                onChange={(e) =>
                  handleNewItemChange("material", e.target.value)
                }
              >
                <option value="Material">Material</option>
                <option value="Kupferkabel">Kupferkabel</option>
                <option value="Kupferkabel">Kupferkabel</option>
                <option value="Kupferkabel">Kupferkabel</option>
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
                  Kg:
                </label>
                <input
                  id="kg"
                  type="number"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  placeholder="Kg"
                  value={menge}
                  onChange={(e) => setMenge(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex flex-col mb-1 w-1/2">
                <label htmlFor="enzielprise" className="mb-2 text-gray-700">
                  KG/Preis:
                </label>
                <input
                  id="kgpries"
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  placeholder="KG/Preis:"
                  value={kgpries}
                  onChange={(e) => setKgpries(e.target.value)}
                />
              </div>

              <div className="flex flex-col mb-1 w-1/2">
                <label htmlFor="gesamt" className="mb-2 text-gray-700">
                  Gesamt:
                </label>
                <input
                  id="gesamt"
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  placeholder="Gesamt:"
                  value={gesamt}
                  onChange={(e) => setgesamt(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col mb-1 w-full">
              <label htmlFor="baustelle" className="mb-2 text-gray-700">
                Baustelle:
              </label>
              <input
                id="baustelle"
                type="text"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Baustelle"
                value={baustelle}
                onChange={(e) => setBaustelle(e.target.value)}
                
              />
            </div>
            <NeuArtikelButton handleSubmit={handleSubmit} />
            <div className="flex flex-col mb-1 w-full">
              <label htmlFor="koment" className="mb-2 text-gray-700">
                Koment:
              </label>
              <input
                id="koment"
                type="text"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                placeholder="Einen Kommentar schreiben"
                value={gutschrift?.koment || ""}
                onChange={(e) => handleInputChange("koment", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-5 pr-2">
            <CancelButton to="/" />
            <button
              type="text"
              className="lg:bg-backgroundButton pt-2 pb-2 py-6 px-6 mb-4 mt-4 text-textColorButton hover:text-white hover:bg-[#2e85c5] float-right border-none rounded-lg sm:rounded-sm"
              style={{ borderRadius: "5px" }}
              onClick={handleButtonBack}
              
            >
              Update
            </button>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-auto mr-1 ml-1">
        {gutschrift ? (
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

                <div className="w-64 mr-2 h-11  flex flex-col justify-start items-center mt-2">
              <h2 className="mr-2 flex flex-col items-end text-[14px]">Gutschrifts-Nr: {gutschrift.rechnungNr}</h2>
              <h2 className="mr-2 flex flex-col items-end text-[14px]">Kunden-Nr: {gutschrift.kundenumer}</h2>

              {/* Moving Steuer Nr and Steuer ID to align properly */}
              <div className="flex flex-col items-end mr-2 text-[15px]">
                {/* We already show Steuer Nr and Steuer ID in the left section */}
                {/* This area might not be needed unless more info is needed */}
              </div>
            </div>
              </div>

              <div className="flex flex-row w-1/1 justify-between ml-1">
                <div>
                  <h2 className="mr-2 text-[14px] flex">
                    Datum: {gutschrift.dateGutschrift ? gutschrift.dateGutschrift.substring(0, 10) : "N/A"}
                  </h2>
                  <h2 className="mr-2  text-[14px]">
                    Ust-idNr: {gutschrift.ustIdNr}
                  </h2>
                </div>

                <div>
                  <h2 className="mr-2  text-[14px] flex justify-end">
                    Steuer Nr: {gutschrift.selectedCompanyDetails?.steuerNr}
                  </h2>
                  <h2 className="mr-2  text-[14px] flex flex-col items-end justify-end">
                    Steuer ID: {gutschrift.selectedCompanyDetails?.steuerId}
                  </h2>
                </div>
              </div>

              <div className="flex mt-4 ml-1">
                <div className="w-1/2">
                  <div>
                    <p className="w-44 font-bold text-[14px] h-auto">
                      {gutschrift.companyName}
                    </p>
                    <p className="w-30  text-[14px] h-auto">
                      Adress: {gutschrift.selectedCompanyDetails?.adress}
                    </p>
                    <p className="w-30  text-[14px] h-auto">
                      Tel: {gutschrift.selectedCompanyDetails?.phoneNumber}
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
              <div className="h-auto w-full ">
            <p className="text-[12px] font-bold">Gutschrift</p>
          <p className=" ml-1 text-[12px]" style={{ whiteSpace: "pre-wrap" }}>
                      {gutschrift.titelKoment}
                    </p>
          </div>

              <div className="border-t-2 ml-2 mt-2 border-textColorCancel">
                <table className="w-full  border-textColorCancel text-[12px]">
                  
                      <thead className="bg-gray-200 border-b-2 border-textColorCancel">
                        <tr>
                          <th className="border px-2 py-1">Post ArtikelNr</th>
                          <th className="border px-2 py-1">Baustelle</th>
                          <th className="border px-2 py-1">Material</th>
                          <th className="border px-2 py-1">KG</th>
                          <th className="border px-2 py-1">Kg/Preise</th>
                          <th className="border px-2 py-1">Gesamt</th>
                          <th className="border px-2 py-1"></th>
                        </tr>
                      </thead>
                      
                      <tbody className=" min-h-[200px]">
                      
                        {formDataArray.map((item, index) => (
                          
                          <tr key={index} className="border-b-2  border-dashed min-h-[200px]">
                            <td className=" px-2 py-1 text-center">
                              {editingIndex === index ? (
                                <input
                                  type="text"
                                  name="postArtikle"
                                  value={editedItem.postArtikle || ""}
                                  onChange={handleChange}
                                  className="w-full text-[14px] text-center"
                                />
                              ) : (
                                item.postArtikle
                              )}
                            </td>
                            <td className=" px-2 py-1 text-center">
                              {editingIndex === index ? (
                                <input
                                  type="text"
                                  name="baustelle"
                                  value={editedItem.baustelle || ""}
                                  onChange={handleChange}
                                  className="w-full text-center"
                                />
                              ) : (
                                item.baustelle
                              )}
                            </td>
                            <td className="px-2 py-1 text-center">
                              {editingIndex === index ? (
                                <input
                                  type="text"
                                  name="material"
                                  value={editedItem.material || ""}
                                  onChange={handleChange}
                                  className="w-full text-center"
                                />
                              ) : (
                                item.material
                              )}
                            </td>
                            <td className="px-2 py-1 text-center">
                              {editingIndex === index ? (
                                <input
                                  type="number"
                                  name="menge"
                                  value={editedItem.menge || ""}
                                  onChange={handleChange}
                                  className="w-full text-center"
                                />
                              ) : (
                                item.menge
                              )}
                            </td>
                            <td className="px-2 py-1 text-center">
                              {editingIndex === index ? (
                                <input
                                  type="text"
                                  name="kgpries"
                                  value={editedItem.kgpries || ""}
                                  onChange={handleChange}
                                  className="w-full text-[14px] text-center"
                                />
                              ) : (
                                `${item.kgpries}€`
                              )}
                            </td>
                            <td className="px-2 py-1 text-center">
                              {editingIndex === index ? (
                                <input
                                  type="text"
                                  name="gesamt"
                                  value={editedItem.gesamt || ""}
                                  onChange={handleChange}
                                  className="w-full text-center"
                                />
                              ) : (
                                `${parseFloat(item.gesamt).toFixed(2)} €`
                              )}
                            </td>
                            <td className=" px-2 py-1 text-center text-[14px] cursor-pointer hover:text-red-400">
                              <MdDeleteForever
                                onClick={() => handleDeleteItem(index)}
                                className="text-[14px]"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   
                </table>
                <div className="border-t-2 border-b-2 border-textColorCancel mt-2 bg-gray-200 px-2 py-1">
                  <p style={{ whiteSpace: "pre-wrap" }} className="text-[14px]">
                    {gutschrift.koment}
                  </p>
                </div>
                <div className="flex justify-between border-dashed border-b border-textColorCancel px-2 py-1">
                  <h3 className="font-bold text-[14px]">Netto:</h3>
                  <h2>{totalNetto}</h2>
                </div>
                <div className="flex justify-between border-dashed border-b border-textColorCancel px-2 py-1">
                  <h3 className="text-[14px]">MwSt.</h3>
                  <h2>0%</h2>
                </div>
                <div className="flex justify-between px-2 py-1">
                  <h3 className="font-bold text-[14px]">Gesamtbetrag:</h3>
                  <h2>{totalWithMwSt}</h2>
                </div>
                <div className="flex justify-between p-2 border-t-2 border-textColorCancel mt-2">
                  <div>
                    <p className="text-[14px]">Bankverbindung</p>
                    <p className="text-[14px]">Volksbank Niederrhein</p>
                    <p className="text-[14px]">IBAN: DE84 3546 1106</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-[14px]">8020 0530 12</p>
                    <p className="text-[14px]">BIC: GENODED1NRH</p>
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
export default EditSafetyForm;
