import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdDeleteForever } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";

const GenerateLinkModal = ({ fileId }) => {
  const [visibility, setVisibility] = useState("public"); // Track the selected visibility
  const [expireTime, setExpireTime] = useState({ days: 0, hours: 0 }); // Track the expire time (days and hours)
  const [loading, setLoading] = useState(false); // Track loading state for button
  const [error, setError] = useState(""); // Track error message
    const [success, setSuccess] = useState(""); // Track success message
    const [show, setShow] = useState(0);

  // Handle the visibility change (public or private)
  const handleVisibilityChange = (e) => {
    setVisibility(e.target.value);
  };

  // Handle expire time input changes
  const handleExpireTimeChange = (e) => {
    const { name, value } = e.target;
    setExpireTime((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
    
    const handleEdit = async () => {
        let successSplit = success.split("/").length;
        let id = success.split("/")[successSplit - 1];

      setLoading(true);
      setError("");
      setSuccess("");

      // Calculate expiration time in seconds if visibility is private
      const expire =
        visibility === "private" ? calculateExpireTimeInSeconds() : 0;

      // Prepare the payload for updating the link
      const payload = {
        visibility,
        expire,
      };
        
        console.log(payload);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/file/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
          }
        );

          const result = await response.json();
          console.log(result);
        setSuccess(result.data);
      } catch (error) {
        setError(error.message);
        console.error("Error updating link:", error);
      } finally {
        setLoading(false);
      }
    };

  // Calculate total expiration time in seconds
  const calculateExpireTimeInSeconds = () => {
    const daysInSeconds = expireTime.days * 86400; // Convert days to seconds
    const hoursInSeconds = expireTime.hours * 3600; // Convert hours to seconds
    return daysInSeconds + hoursInSeconds;
  };
    
    const handleDelete = async () => {
        let successSplit = success.split("/").length;
        let id = success.split("/")[successSplit - 1];
        // console.log(id);

      try {
        // Send DELETE request to the API
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/file/${id}/delete`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

          const result = await response.json();
          
          if (result.success) {
              setSuccess("");
              setVisibility("public");
              setShow(0)
          }
          

        // Optionally, trigger a callback or update the UI (e.g., refresh file list)
      } catch (error) {
        setError(error.message);
        console.error("Error deleting file:", error);
      }
    };

  // Handle the generate link action
  const handleGenerateLink = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    // Calculate expiration time in seconds
    const expire = calculateExpireTimeInSeconds();

    // Prepare the payload
    const payload = {
      type: visibility, // either "public" or "private"
      expire, // expiration time in seconds
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/file/${fileId}/create-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
        setSuccess(result.data);
        setShow(1)
    } catch (error) {
      setError(error.message);
      console.error("Error generating link:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[500px] bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        {show == 0 && (
          <div className="flex items-center space-x-4">
            <div>
              <input
                type="radio"
                id="public"
                name="visibility"
                value="public"
                checked={visibility === "public"}
                onChange={handleVisibilityChange}
                className="radio radio-primary"
              />
              <label
                htmlFor="public"
                className="ml-2 text-lg font-medium text-gray-800"
              >
                Public
              </label>
            </div>

            <div>
              <input
                type="radio"
                id="private"
                name="visibility"
                value="private"
                checked={visibility === "private"}
                onChange={handleVisibilityChange}
                className="radio radio-primary"
              />
              <label
                htmlFor="private"
                className="ml-2 text-lg font-medium text-gray-800"
              >
                Private
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Conditionally render the expiration input fields when 'Private' is selected */}
      {visibility === "private" && (
        <div className="flex flex-col space-y-4">
          <p className="text-red-500">Expire Time</p>
          <div className="flex space-x-6">
            <div className="w-full">
              <label
                htmlFor="days"
                className="text-lg font-medium text-gray-800"
              >
                Days
              </label>
              <input
                type="number"
                id="days"
                name="days"
                value={expireTime.days}
                onChange={handleExpireTimeChange}
                className="input input-primary w-full mt-2 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="Days"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="hours"
                className="text-lg font-medium text-gray-800"
              >
                Hours
              </label>
              <input
                type="number"
                id="hours"
                name="hours"
                value={expireTime.hours}
                onChange={handleExpireTimeChange}
                className="input input-primary w-full mt-2 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="Hours"
              />
            </div>
          </div>
        </div>
      )}

      {/* Show loading or error/success messages */}
      {loading && <p className="text-blue-500">Generating link...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Generated Link</p>}
      {success && (
        <div>
          <Link to={success}>
            <p className="text-black font-bold text-xl">{success}</p>
          </Link>
          <div className="flex items-center justify-between mt-5">
            <div>
              <MdDeleteForever
                onClick={handleDelete}
                className="text-3xl text-red-500 cursor-divointer"
              />
            </div>
            <div className='flex items-center justify-evenly gap-5'>
              <MdOutlineEdit
                onClick={() => setShow(0)}
                className="text-3xl text-blue-500 cursor-pointer ml-4"
              />
              <button onClick={handleEdit} className="uppercase btn">
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      
      {success == "" && <button
        onClick={handleGenerateLink}
        className="btn flex items-center justify-center bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
      >
        {loading ? "Generating..." : "Generate Link"}
      </button>}
    </div>
  );
};

export default GenerateLinkModal;