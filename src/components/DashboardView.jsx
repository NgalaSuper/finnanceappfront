import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Swal from "sweetalert2";
import { BsFillEyeFill } from "react-icons/bs";
import { BsEye } from "react-icons/bs";
import { MdModeEditOutline } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import Photonew from "../assets/images/photonew-01.png";
import axios from "axios";
import { FaPlus } from 'react-icons/fa';

import imgInvoice from "../assets/images/img-leiferant-01.png";
import imgGefahrdungsbeurteilung from "../assets/images/img-leiferant-01.png";
import imgGuschrift from "../assets/images/img-leiferant-01.png";
import imgLeiferant from "../assets/images/img-leiferant-01.png";

import { API_BASE_URL } from "../data/data";

const DashboardView = () => {
  const { searchTerm } = useOutletContext();
  const [invoices, setInvoices] = useState([]);
  const [guschrift, setGuschrift] = useState([]);
  const [leiferant, setLeiferant] = useState([]);
  const [gefahrdungsbeurteilung, setGefahrdungsbeurteilung] = useState([]);
  const [inputView, setViewInput] = useState([]);
  const [search, setSearch] = useState("");
  const [showOptions, setShowOptions] = useState(false); // Controls visibility of options
  const [openModal, setOpenModal] = useState(false); // Controls modal visibility
  const [modalType, setModalType] = useState("");

  const handleShowOptions = () => {
    setShowOptions(true); // Show the options when the button is clicked
  };

  const openDialog = (type) => {
    setModalType(type);
    setOpenModal(true); // Open the modal for the selected type
  };

  const closeDialog = () => {
    setOpenModal(false);
    setModalType(""); // Reset modal type after closing
  };

  const fetchData = async () => {
    try {
      const [
        invoiceRes,
        guschriftRes,
        gefahrdungsbeurteilungRes,
        lieferantRes,
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/getInvoicesCompany`),
        axios.get(`${API_BASE_URL}/savedGutschrift`),
        axios.get(`${API_BASE_URL}/Gefahrdungsbeurteilung`),
        axios.get(`${API_BASE_URL}/savedLieferant`),
      ]);
      setInvoices(invoiceRes.data);
      setGuschrift(guschriftRes.data);
      setGefahrdungsbeurteilung(gefahrdungsbeurteilungRes.data);
      setLeiferant(lieferantRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const combinedData = [
    ...invoices.map((item) => ({ ...item, type: "invoice" })),
    ...gefahrdungsbeurteilung.map((item) => ({
      ...item,
      type: "gefahrdungsbeurteilung",
    })),
    ...guschrift.map((item) => ({ ...item, type: "gutschrift" })), // Corrected typo
    ...leiferant.map((item) => ({ ...item, type: "lieferant" })), // Corrected typo
  ];

  const filteredData = combinedData.filter((item) => {
    if (!searchTerm) return true; // If no search term, show all results

    const companyName = item.companyName?.toLowerCase() || "";
    const selectedCompany = item.selectedCompany?.toLowerCase() || "";
    const searchTermLower = searchTerm.toLowerCase();

    return (
      companyName.includes(searchTermLower) ||
      selectedCompany.includes(searchTermLower)
    );
  });

  const typeToPathMap = {
    invoice: "edit",
    gefahrdungsbeurteilung: "gefahrdungsbeurteilung",
    gutschrift: "gutschrift",
    lieferant: "lieferant", // Corrected typo
  };

  const typeToPathMapPreview = {
    invoice: "singlepage", // Maps to SinglePreviewInvoicePage
    gefahrdungsbeurteilung: "singleGefahrdungsbeurteilung", // Maps to PreviewGefahrdungsbeurteilung
    gutschrift: "singleGutschrift", // Maps to PreviewGutschrift
    lieferant: "singleLieferant", // Maps to PreviewSignleLieferant
  };

  const deleteProduct = async (id, type) => {
    const validTypes = {
      invoice: `${API_BASE_URL}/invoicesCompany/`,
      gutschrift: `${API_BASE_URL}/savedGutschrift/`,
      gefahrdungsbeurteilung: `${API_BASE_URL}/Gefahrdungsbeurteilung/`,
      lieferant: `${API_BASE_URL}/savedLieferant/`,
    };

    if (!validTypes[type]) {
      console.error("Invalid type provided", type); // Log the type to debug
      return;
    }
    const showCustomAlert = await Swal.fire({
      title: "Do you really want to delete?",
      showCancelButton: true,
      width: "300px",
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#2bdec0",
      cancelButtonColor: "#F6F5F9",
      customClass: {
        title: "custom-title",
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
    });

    if (showCustomAlert.isConfirmed) {
      try {
        const response = await axios.delete(`${validTypes[type]}${id}`);
        console.log(`Deleted ${type}:`, response.data);

        // Refresh data
        fetchData();
      } catch (error) {
        console.error("Error deleting product:", error.message);
      }
    }
  };

  return (
    <div className="w-full h-auto flex flex-col justify-center items-center ">
      <div className="w-[98%] h-[98%]  flex flex-col  items-center  ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center items-center w-full p-4">
          {[
            "invoices",
            "gutschrift",
            "gefahrdungsbeurteilung",
            "lieferant",
          ].map((type, index) => (
            <div
              key={index}
              className="w-[99%] h-[30%] flex flex-col justify-center py-2 px-2"
            >
              <Link
                to={`/${type}`}
                className="bg-backgroundColor  text-white font-bold py-2 px-4 border  border-gray-200 rounded-md w-44 h-36 flex flex-col justify-between shadow-lg"
              >
                <img
                  src={Photonew}
                  alt="icon"
                  className="h-20 w-20 object-contain mb-3 mx-auto"
                />
                <p className="text-textColorCancel font-bold text-[13px] text-center mb-2">
                     {type.charAt(0).toUpperCase() + type.slice(1)}
                </p>
                <button className="text-textColorCancel py-2 px-2  relative border border-borderColorBackground rounded-full  text-sm mx-auto bg-backgroundColor">
                <FaPlus className="text-gray-400 mx-auto" />
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* <div className="grid grid-cols-5  justify-center rounded-md items-center place-center gap-4 w-full">
          <div className="w-[99%] h-[30%] flex flex-col justify-center py-2 px-2">
            <Link
              to="/invoices"
              className="bg-backgroundColor  text-white font-bold py-2 px-4 border  border-gray-200 rounded-md w-44 h-44 flex flex-col justify-between shadow-lg"
            >
              <span className="text-[40px] ml-2 w-14 h-20 ">
                <img
                  src={Photonew}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </span>
              <p className="text-textColorCancel font-normal text-[12px]   w-18 ml-2">
                New Invoices
              </p>
              <div className="ml-2 mt-1">
                <p className="text-textColorCancel py-1 px-1 border border-borderColorBackground rounded-lg w-24 text-sm bg-backgroundColor">
                  Create new
                </p>
              </div>
            </Link>
          </div>

          <div className="w-[99%] h-[30%] flex flex-col justify-center py-2 px-2">
            <Link
              to="/gutschrift"
              className="bg-backgroundColor  text-white font-bold py-2 px-4 border border-gray-200 rounded-md w-44 h-44 flex flex-col justify-between shadow-lg"
            >
              <span className="text-[40px] ml-2 w-14 h-20 ">
                <img
                  src={Photonew}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </span>
              <p className="text-textColorCancel font-normal text-[12px]   w-18 ml-2">
                New Gutschrift
              </p>
              <div className="ml-2 mt-1">
                <p className="text-textColorCancel py-1 px-1 border border-borderColorBackground rounded-lg w-24 text-sm bg-backgroundColor">
                  Create new
                </p>
              </div>
            </Link>
          </div>
          <div className="w-[99%] h-[30%] flex flex-col justify-center py-2 px-2">
            <Link
              to="/gefahrdungsbeurteilung"
              className="bg-backgroundColor  text-white font-bold py-2 px-4  border border-gray-200 rounded-md w-44 h-44 flex flex-col justify-between shadow-lg"
            >
              <span className="text-[40px] ml-2 w-14 h-20 ">
                <img
                  src={Photonew}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </span>
              <p className="text-textColorCancel font-normal text-[12px]   w-full ml-2">
                New Gefahrdungsbeu...
              </p>
              <div className="ml-2 mt-1">
                <p className="text-textColorCancel py-1 px-1 border border-borderColorBackground rounded-lg w-24 text-sm bg-backgroundColor">
                  Create new
                </p>
              </div>
            </Link>
          </div>
          <div className="w-[99%] h-[30%] flex flex-col justify-center py-2 px-2">
            <Link
              to="/lieferant"
              className="bg-backgroundColor  text-white font-bold py-2 px-4  border border-gray-200 rounded-md w-44 h-44 flex flex-col justify-between shadow-lg"
            >
              <span className="text-[40px] ml-2 w-14 h-20 ">
                <img
                  src={Photonew}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </span>
              <p className="text-textColorCancel font-normal text-[12px]   w-18 ml-2">
                New lieferant
              </p>
              <div className="ml-2 mt-1">
                <p className="text-textColorCancel py-1 px-1 border border-borderColorBackground rounded-lg w-24 text-sm bg-backgroundColor">
                  Create new
                </p>
              </div>
            </Link>
          </div>
        </div> */}
        <div className="w-full h-auto p-2  flex flex-col mt-4">
          <div className="w-full h-auto py-2 px-2  border-t border-borderButtonCancel "></div>
          {filteredData.length === 0 ? (
            <p>Nothing to show</p>
          ) : (
            <div className="grid gap-4 p-4 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-5 w-full overflow-visible">
              {filteredData
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((item) => (
                  <div
                    key={item._id}
                    className="w-56 h-auto p-2 border border-gray-300 rounded-2xl shadow-lg bg-white flex flex-col hover:shadow-xl transition-all duration-200"
                  >
                    {/* Image and Link */}
                    <Link
                      className="block w-full h-60 flex justify-center items-center rounded-t-xl bg-gray-50"
                      to={`/${
                        typeToPathMapPreview[item.type] || "singlepage"
                      }/${item._id}`}
                    >
                      <img
                        src={
                          item.type === "invoice"
                            ? imgInvoice
                            : item.type === "gefahrdungsbeurteilung"
                            ? imgGefahrdungsbeurteilung
                            : item.type === "gutschrift"
                            ? imgGuschrift
                            : item.type === "lieferant"
                            ? imgLeiferant
                            : null
                        }
                        alt=""
                        className="w-full h-full object-contain mx-auto rounded-md"
                      />
                    </Link>

                    {/* Company Name */}
                    <div className="w-full text-center p-2">
                      <h2 className="text-md font-semibold text-gray-700 leading-tight">
                        {item.selectedCompany || item.companyName}
                      </h2>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full h-auto mt-auto p-2 border-t border-dashed border-gray-300 flex justify-end gap-3">
                      <Link
                        to={`/${
                          typeToPathMapPreview[item.type] || "singlepage"
                        }/${item._id}`}
                        className="w-8 h-8 flex justify-center items-center bg-gray-100 rounded-full transition hover:bg-gray-200 border border-gray-400 text-gray-600"
                      >
                        <BsFillEyeFill className="hover:text-blue-500" />
                      </Link>
                      <Link
                        to={`/${typeToPathMap[item.type] || "unknown"}/${
                          item._id
                        }`}
                        className="w-8 h-8 flex justify-center items-center rounded-full border bg-gray-100 hover:bg-gray-200 border-gray-400 text-gray-600"
                      >
                        <MdModeEditOutline className="hover:text-blue-500" />
                      </Link>
                      <span
                        onClick={() => deleteProduct(item._id, item.type)}
                        className="w-8 h-8 flex justify-center items-center rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-400 text-gray-600 hover:text-red-600 cursor-pointer"
                      >
                        <MdDeleteForever />
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
