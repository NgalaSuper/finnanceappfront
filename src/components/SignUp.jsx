import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Check required fields
    if (!name || !email || !password ) {
      setError("All fields are required: name, email, password, and image.");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", image); // Make sure you append the file
  
    try {
      const response = await axios.post("http://localhost:5000/register", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }
  
      // Handle successful response
      // Redirect or show a success message here
      navigate("/login");
    } catch (error) {
      console.error("Error during sign up:", error); // Log error
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError("Unexpected error occurred. Please try again");
      }
    }
  };
  
  

  return (
    <div>
      <div className="flex items-center  justify-center mt-28 ">
        <div className="w-96 border rounded bg-white px-7 py-10 shadow-md">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7">Sign Up</h4>
            <div className="flex flex-col mb-4">
            <input
              type="text"
              placeholder="Name"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            </div>
            <div className="flex flex-col mb-4">
            <input
              type="text"
              placeholder="Email"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            </div>
            <div className="flex flex-col mb-4">
            <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-lg p-2 focus:outline-none w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            </div>
           <input type="file" accept=".jpg,.jpeg,.png,.svg" onChange={(e) => setImage(e.target.files[0])} />
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            <div className="flex flex-col">
            <button type="submit" className="lg:bg-backgroundButton pt-2 pb-2 py-6 px-6 mb-4 mt-4 text-backgroundColor float-right border rounded-lg !important sm:rounded-sm" onClick={handleSignUp}>
              Create Account
            </button>
            <p className="text-sm text-center mt-4">
              Already have an account? {""}
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
            </div>
          </form>
        </div>
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
      </div>
    </div>
  );
};

export default SignUp;
