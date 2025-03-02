import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import GenerateLinkModal from "./GenerateLinkModal";

import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const GetFiles = () => {
    const [files, setFiles] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [fileId, setFileId] = useState("");

    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal(id) {
        setFileId(id);
      setIsOpen(true);
    }

    function closeModal() {
      setIsOpen(false);
    }

    // Fetch all files from backend
    const fetchFiles = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/file`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

          const data = await response.json();
          console.log(data);
        setFiles(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchFiles();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
      <div className="bg-gray-50 min-h-[100vh]">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            Your Files
          </h1>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            {files.length === 0 ? (
              <p className="text-gray-500 text-lg">No files available.</p>
            ) : (
              <ul className="space-y-4">
                {files.map((file) => (
                  <li
                    key={file._id}
                    className="flex items-center justify-between p-4 border rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <svg
                        className="w-8 h-8 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <div className="cursor-pointer">
                        <Link to={file.file} target="_blank">
                          {file.name}
                        </Link>
                        <p className="text-sm text-gray-600">
                          Size: {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => openModal(file._id)}
                        className="btn"
                      >
                        Share
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className='flex items-center justify-end'>
            <button
              className="border border-black rounded-md px-3 py-1 text-red-500 text-2xl"
              onClick={closeModal}
            >
              x
            </button>
          </div>
          <GenerateLinkModal fileId={fileId}></GenerateLinkModal>
        </Modal>
      </div>
    );
};

export default GetFiles;