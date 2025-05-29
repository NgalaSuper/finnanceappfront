import React, { useEffect, useState } from 'react'
import Logo from "../assets/images/Logo1.png";
import { Link, useParams } from 'react-router-dom';
import EditLight from "../assets/images/Edit_light.svg";
import PrintImg from "../assets/images/PrintImg.svg";
import PreviewCardForm from './PreviewCardForm';
import { fetchGefahrdungsbeurteilungById } from '../data/data';

const PreviewSingleGefahrdungsbeurteilung = ({handlePrint, selectedCompany,mode}) => {
  const [viewInput, setViewInput] = useState(null);
  const [Gefahrdungsbeurtilung, setGefahrdungsbeurtilung] = useState()
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams()

  useEffect(() => {
    const getGutschrift = async () => {
      try {
        const data = await fetchGefahrdungsbeurteilungById(id);
        setGefahrdungsbeurtilung(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to load invoice:", error);
      }
    };
    getGutschrift();
  }, [id]);

  useEffect(() => {
   // Replace this with the actual ID you need

    const fetchData = async () => {
      try {
        const data = await fetchGefahrdungsbeurteilungById(id); // ✅ Correct function call
        setViewInput(data);
      } catch (error) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, []); // Runs only once on mount
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  console.log('fetchData:',viewInput);

  return (  
    
    <div className='flex w-full justify-center'>
     <PreviewCardForm viewInput={viewInput} selectedCompany={selectedCompany} />
     <div className="flex flex-col space-y-0 ">
            <div className="fixed">
              {/* Container for button */}
              <Link
                to={{
                  pathname: `/gefahrdungsbeurteilung/${Gefahrdungsbeurtilung._id}`,
                  state: {
                    companyName: selectedCompany
                      ? selectedCompany.companyName
                      : "",
                    viewInput:viewInput
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
                viewInput={viewInput}
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

)};

export default PreviewSingleGefahrdungsbeurteilung
