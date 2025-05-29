import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NeuArtikelButton from "./NeuArtikelButton";
import { MdDeleteForever } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { MdFileDownloadDone } from "react-icons/md";
import Logo from "../assets/images/Logo1.png";
import axios from "axios";
import {toast} from 'sonner';
import CancelButton from "./CancelButton";
import { fetchLieferantById } from "../data/data";
import { API_BASE_URL } from "../data/data";

const EditTransportPage = ({
  companies,
  companyName,
  dateInvoice,
  selectedCompanyDetails,
  rechnungNr,
}) => {
  const [formDataArray, setFormDataArray] = useState([]);
  const [postArtikle, setPostArtikle] = useState(1);
  const navigate = useNavigate();
  const [avvnr, setAvvnr] = useState("");
  const [datumArtikel, setDatumArtikel] = useState("");
  const [zeit, setZeit] = useState("");
  const [verwieger, setVerwieger] = useState("");
  const [gewicht, setGewicht] = useState("");
  const [kfzId, setKfzId] = useState("");
  const [totalNetto, setTotalNetto] = useState(0);
  const [totalWithMwSt, setTotalWithMwSt] = useState(0);
  const { id } = useParams();
  const { id: lieferantId } = useParams();
  const [leiferant, setLeiferant] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedItem, setEditedItem] = useState({});
  const [newItem, setNewItem] = useState({
    avvnr: "",
    datumArtikel: "",
    zeit: "",
    verwieger: "",
    gewicht: "",
    kfzId: "",
  });

  useEffect(() => {
    console.log("ID passed to useEffect:", id);
    const getLieferant = async () => {
      try {
        const data = await fetchLieferantById(id);
        console.log("Fetched data:", data);
        setLeiferant(data);
        setFormDataArray(data.formDataArray || []); // Fallback to empty array
        setPostArtikle((data.formDataArray || []).length + 1); // Safely access length
      } catch (error) {
        console.error("Error fetching Gutschrift:", error.message);
      }
    };
    if (id) getLieferant();
  }, [id]);

  const handleNewItemChange = (field, value) => {
    setNewItem({ ...newItem, [field]: value });
  };
  

  const handleSubmit = () => {
    if (!avvnr || !newItem.artikel || !gewicht) {
      alert("All fields are required.");
      return;
    }

    const submittedItem = {
      ...newItem,
      postArtikle,
      avvnr,
      artikel: newItem.artikel,
      datumArtikel,
      zeit,
      verwieger,
      gewicht,
      kfzId,
    };

   
    setFormDataArray((prevFormDataArray) => {
      const updatedArray = [...prevFormDataArray, submittedItem];
      const newPostArtikleNr = updatedArray.length + 1;
      setPostArtikle(newPostArtikleNr);
      return updatedArray;
    });

    // Reset form fields
    setNewItem({ artikel: "" });
    setAvvnr("");
    setDatumArtikel("");
    setZeit("");
    setVerwieger("");
    setGewicht("");
    setKfzId("");
  };

  

 

  const handleEditClick = (index) => {
    setEditingIndex(index); // Set the index of the item being edited
    setEditedItem(formDataArray[index]); // Populate the editedItem with the current item's data
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prev) => ({ ...prev, [name]: value })); // Update the editedItem state
  };
     
  useEffect(() => {
    if (formDataArray.length > 0) {
      const totalNetto = formDataArray.reduce((total, item) => {
        const gewichtValue = parseFloat(item.gewicht) || 0; // Convert to number
        return total + gewichtValue;
      }, 0);
      console.log("Updated total netto:", totalNetto); // Correct numeric value
      setTotalNetto(totalNetto);
    }
  }, [formDataArray]);

  // const saveChanges = async () => {
  //   const updatedItems = [...formDataArray];
  //   updatedItems[editingIndex] = editedItem; // Save the edited item back to the array

  //   // Update the local state with the new data
  //   setFormDataArray(updatedItems);



  //   // Reset the editing state
  //   setEditingIndex(null); // Close the input fields
  //   setEditedItem({});
  //   console.log("Updated Successfully "); // Clear the edited item
  // };

  const handleInputChange = (field, value) => {
    setLeiferant((prevLeiferant) => ({
      ...prevLeiferant,
      [field]: value,
    }));
  };





  const handleDeleteItem = async (indexToDelete, itemId) => {
    console.log('Deleting item at index:', indexToDelete);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/savedLieferant/delete/${id}/${indexToDelete}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    
      if (response.status === 200) {
        const updatedArray = formDataArray.filter(
          (_, index) => index !== indexToDelete
        );
        setFormDataArray(updatedArray);
        setPostArtikle((prevPostArtikle) => Math.max(prevPostArtikle - 1, 1));
      } else {
        console.error("Failed to delete item from the database:", response.data);
      }
    } catch (error) {
      console.error("Error deleting item:", error.response ? error.response.data : error.message);
    }
  };
  
  

  

    const handleButtonBack = async () => {
      if (!lieferantId) {
        console.error("Lieferant ID is missing.");
        return;
      }
      await lieferantUpdate();
    };
    
    const lieferantUpdate = async () => {
      try {
        const changeLieferantData = {
          companyName: companyName || leiferant?.companyName,
          dateInvoice: dateInvoice || leiferant?.dateInvoice,
          rechnungNr: rechnungNr,
          selectedCompanyDetails,
          formDataArray: formDataArray.map((item) => ({
            postArtikle: item.postArtikle,
            artikel: item.artikel,
            avvnr: item.avvnr,
            datumArtikel: item.datumArtikel,
            zeit: item.zeit,
            verwieger: item.verwieger,
            gewicht: item.gewicht,
            kfzId: item.kfzId,
          })),
        };
    
        console.log("Sending changed fields:", changeLieferantData);
    
        const response = await axios.put(
          `${API_BASE_URL}/savedLieferant/${lieferantId}`, // Make sure lieferantId is valid
          changeLieferantData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
    
        console.log("Invoice updated successfully:", response.data);
        toast.success("Invoice updated successfully");
      } catch (error) {
        console.error(
          "Error updating invoice:",
          error.response ? error.response.data : error.message
        );
        toast.error("Failed to update invoice. Please try again.");
      }
    };
    

    

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
                  value={leiferant?.companyName || ""}
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
                  Wiegeschein-Nr:
                </label>
                <input
                  id="RechnungNr"
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  placeholder="Rechnung Number"
                  value={leiferant?.rechnungNr || ""}
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
                    leiferant?.dateLieferant
                      ? leiferant.dateLieferant.substring(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    handleInputChange("dateLieferant", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col mb-1 w-1/2">
                <label htmlFor="spedituer" className="mb-2 text-gray-700">
                  Spedituer:
                </label>
                <input
                  id="spedituer"
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  placeholder="spedituer"
                  value={leiferant?.spedituer || ""}
                  onChange={(e) =>
                    handleInputChange("spedituer", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex flex-col mb-1 w-1/2">
                <label htmlFor="baustelle" className="mb-2 text-gray-700">
                  Baustelle:
                </label>
                <input
                  id="date"
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  value={leiferant?.baustelle || ""}
                  onChange={(e) =>
                    handleInputChange("baustelle", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col mb-1 w-1/2">
                <label htmlFor="leiferant" className="mb-2 text-gray-700">
                  Lieferant:
                </label>
                <input
                  id="leiferant"
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  placeholder="leiferant"
                  value={leiferant?.leiferant || ""}
                  onChange={(e) =>
                    handleInputChange("spedituer", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex space-x-4"></div>
          </div>

          {/* Form Data Array - Editable items */}
          <div className="m-2 pr-2 pl-2 pt-2 w-[590px] h-1/2 border rounded-md shadow-md pb-4 bg-backgroundColor">
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
                <label htmlFor="avvnr" className="mb-2 text-gray-700">
                  AVV-Nr:
                </label>
                <input
                  id="avvnr"
                  type="number"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  placeholder="AVV-Nr"
                  value={avvnr}
                  onChange={(e) => setAvvnr(e.target.value)}
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex flex-col mb-1 w-1/2">
                <label htmlFor="artikel" className="mb-2 text-gray-700">
                  KFZ/ID:
                </label>
                <input
                  id="kfzId"
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  placeholder="KFZ/ID"
                  value={kfzId}
                  onChange={(e) => setKfzId(e.target.value)}
                />
              </div>
              <div className="flex flex-col mb-1 w-1/2">
                <label htmlFor="artikel" className="mb-2 text-gray-700">
                  Artikel:
                </label>
                <select
                  id="artikel"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  value={newItem.artikel}
                  onChange={(e) =>
                    handleNewItemChange("artikel", e.target.value)
                  }
                >
                  <option value="Material">Material</option>
                  <option value="Kupferkabel">Kupferkabel</option>
                  <option value="Kupferkabel">Kupferkabel</option>
                  <option value="Kupferkabel">Kupferkabel</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex flex-col mb-1 w-1/2">
                <label htmlFor="datumArtikel" className="mb-2 text-gray-700">
                  Datum:
                </label>
                <input
                  id="kgpries"
                  type="date"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  value={datumArtikel}
                  onChange={(e) => setDatumArtikel(e.target.value)}
                />
              </div>

              <div className="flex flex-col mb-1 w-1/2">
                <label htmlFor="zeit" className="mb-2 text-gray-700">
                  Zeit:
                </label>
                <input
                  id="zeit"
                  type="time"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  placeholder="Gesamt:"
                  value={zeit}
                  onChange={(e) => setZeit(e.target.value)}
                />
              </div>
            </div>
            <div className="flex space-x-4 ">
              <div className="flex flex-col mb-1 w-1/2">
                <label htmlFor="gewicht" className="mb-2 text-gray-700">
                  Gewicht:
                </label>
                <input
                  id="gewicht"
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  placeholder="Gewicht"
                  value={gewicht}
                  onChange={(e) => setGewicht(e.target.value)}
                />
              </div>

              <div className="flex flex-col mb-1 w-1/2">
                <label htmlFor="verwieger" className="mb-2 text-gray-700">
                  Verwieger:
                </label>
                <input
                  id="verwieger"
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
                  placeholder="Verwieger:"
                  value={verwieger}
                  onChange={(e) => setVerwieger(e.target.value)}
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
              onClick={handleButtonBack}
            >
              Update
            </button>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-auto mr-1 ml-1">
        {leiferant ? (
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
                  Wiegeschein-Nr: {leiferant.rechnungNr}
                  </h2>
                </div>
              </div>

              <div className="flex flex-row w-1/1 justify-between ml-1">
                <div>
                  <h2 className="mr-2 text-[14px] flex">
                    Datum:{" "}
                    {new Date(leiferant.dateLieferant).toLocaleDateString(
                      "de-DE"
                    )}
                  </h2>
                </div>

                <div>
                  <h2 className="mr-2  text-[14px] flex justify-end">
                    {/* Steuer Nr: {gutschrift.selectedCompanyDetails.steuerNr} */}
                  </h2>
                  <h2 className="mr-2  text-[14px] flex flex-col items-end justify-end">
                    {/* Steuer ID: {gutschrift.selectedCompanyDetails.steuerId} */}
                  </h2>
                </div>
              </div>

              <div className="flex mt-4 ml-1">
                <div className="w-1/2">
                  <div>
                    <p className="w-44 font-bold text-[14px] h-auto">
                      {leiferant.companyName}
                    </p>
                    <p className="w-30  text-[14px] h-auto">
                      Adress:{" "}
                      {leiferant.selectedCompanyDetails
                        ? leiferant.selectedCompanyDetails.adress
                        : ""}
                    </p>
                    <p className="w-30  text-[14px] h-auto">
                      Tel:{" "}
                      {leiferant.selectedCompanyDetails
                        ? leiferant.selectedCompanyDetails.phoneNumber
                        : ""}
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
                <div className="text-[16px] p-2 font-bold">Lieferant</div>
                <div className="w-full flex justify-between p-2">
                  <div className="text-[14px] ">
                    <span className="font-bold">Baustelle:</span>{" "}
                    {leiferant.baustelle}
                  </div>
                  <div className="mr-4 text-[14px] ">
                    <span className="font-bold">Lieferant:</span>{" "}
                    {leiferant.leiferant}
                  </div>
                </div>
                <div className="p-2 text-[14px] ">
                  {" "}
                  <span className="font-bold">Spediteur:</span>{" "}
                  {leiferant.spedituer}
                </div>
              </div>

              <div className="flex flex-col mt-4 border-textColorCancel h-22">
                <div className="flex flex-col mt-2 justify-between">
                  <div className="w-full flex flex-col justify-between h-96 invoice-style">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-gray-200 pr-2 border-b-2 border-textColorCancel mb-1">
                          <th className="w-22 h-10 text-[12px] text-center">
                            Post ArtikelNr:
                          </th>
                          <th className="w-18 h-10 text-[12px] text-center">
                            AVV-Nr:
                          </th>
                          <th className="w-12 h-10 text-[12px] text-center">
                            KFZ/ID:
                          </th>
                          <th className="w-32 h-10 text-[12px] text-center ">
                            Artikel:
                          </th>
                          <th className="w-28 h-10 text-[12px] text-center ">
                            Datum:
                          </th>
                          <th className="w-20 h-10 text-[12px] text-center">
                            Zeit:
                          </th>
                          <th className="w-20 h-10 text-[12px] text-center">
                            Gewicht:
                          </th>
                          <th className="w-4 h-10 text-[12px] text-center">
                            {" "}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formDataArray.map((item, index) => (
                          <tr
                            key={index}
                            className="border-dashed border-b-2 border-textColorCancel pb-1 items-center"
                          >
                            <td className="w-18 h-22 text-center">
                              {editingIndex === index ? (
                                <input
                                  type="text"
                                  name="postArtikle"
                                  value={editedItem.postArtikle || ""}
                                  onChange={handleChange}
                                  className="text-[14px] text-center w-12 h-6 items-center flex flex-col"
                                />
                              ) : (
                                <p className="text-[14px] text-center w-12">
                                  {item.postArtikle}
                                </p>
                              )}
                            </td>
                            <td className="w-18 h-22 ml-8 text-center">
                              {editingIndex === index ? (
                                <input
                                  type="text"
                                  name="avvnr"
                                  value={editedItem.avvnr || ""}
                                  onChange={handleChange}
                                  className="text-[14px] text-center w-32 h-6 items-center flex flex-col"
                                />
                              ) : (
                                <p className="text-[14px] text-center w-24">
                                  {item.avvnr}
                                </p>
                              )}
                            </td>
                            <td className="w-32 h-22 ml-8 text-center">
                              {editingIndex === index ? (
                                <input
                                  type="text"
                                  name="material"
                                  value={editedItem.kfzId || ""}
                                  onChange={handleChange}
                                  className="text-[14px] text-center w-32 h-6 items-center flex flex-col"
                                />
                              ) : (
                                <p className="text-[14px] text-center w-24">
                                  {item.kfzId}
                                </p>
                              )}
                            </td>
                            <td className="w-12 h-22 pl-2 text-center">
                              {editingIndex === index ? (
                                <input
                                  type="text"
                                  name="artikel"
                                  value={editedItem.artikel || ""}
                                  onChange={handleChange}
                                  className="text-[14px] w-12 h-6 items-center text-center flex flex-col"
                                />
                              ) : (
                                <p className="text-[14px]">{item.artikel}</p>
                              )}
                            </td>
                            <td className="w-20 h-22 text-center">
                              {editingIndex === index ? (
                                <input
                                  type="date"
                                  name="datumArtikel"
                                  value={editedItem.datumArtikel || ""}
                                  onChange={handleChange}
                                  className="text-[12px] text-center w-12 h-6 items-center flex flex-col"
                                />
                              ) : (
                                <p className="text-[14px] text-center">
                                  {new Date(
                                    item.datumArtikel
                                  ).toLocaleDateString("de-DE")}
                                </p>
                              )}
                            </td>
                            <td className="w-26 h-22 ml-5 text-center">
                              {editingIndex === index ? (
                                <input
                                  type="time"
                                  name="netopreis"
                                  value={editedItem.zeit || ""}
                                  onChange={handleChange}
                                  className="text-[14px] text-center w-14 h-6 items-center flex flex-col"
                                />
                              ) : (
                                <p className="text-[14px] text-center">
                                  {item.zeit || ""}{" "}
                                </p>
                              )}
                            </td>
                            <td className="w-20 h-22 text-center">
                              {editingIndex === index ? (
                                <input
                                  type="date"
                                  name="datumArtikel"
                                  value={editedItem.gewicht || ""}
                                  onChange={handleChange}
                                  className="text-[14px] text-center w-12 h-6 items-center flex flex-col"
                                />
                              ) : (
                                <p className="text-[14px] text-center">
                                  {item.gewicht} kg
                                </p>
                              )}
                            </td>
                            <td className="w-8 flex justify-between h-22 text-center items-center">
                              <span
                                className="text-[16px] ml-2 no-print cursor-pointer hover:text-red-400"
                                onClick={() => handleDeleteItem(index)}
                              >
                                <MdDeleteForever />
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div>
                      <div className="border-t-2 border-b-2 mt-2 w-full border-textColorCancel"></div>
                      <div className="flex w-full  justify-between ml-1">
                        <h3 className="font-bold text-[14px]">     Nettogewicht::</h3>
                        <h2 className="mr-4 font-bold text-[14px]">{totalNetto} Kg</h2>
                      </div>
                      
                      
                      <div className="flex justify-between p-2 mt-2 w-full border-textColorCancel border-t-2">
                        <div className="w-1/2">
                          <p className="text-[14px]">Fahrerunterschrift</p>
                     
                        </div>
                        <div className="w-1/2 flex flex-col items-end p-2">
                          <p className="text-[14px]">Kundenunterschrift</p>
                         
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
export default EditTransportPage;
