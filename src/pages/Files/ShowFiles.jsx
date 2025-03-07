import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

const ShowFiles = () => {
    const { id } = useParams();
    const [links, getLinks] = useState('');
    // console.log(id);

    const fetchFiles = async () => {
        // console.log('hit fetchFiles');
      try {
        const response = await fetch(
          `https://edu-backend-ashik190141s-projects.vercel.app/file/share/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();
        // console.log('data:- ', data);
        getLinks(data.data);
      } catch (err) {
        console.log(err.message);
      } 
    };

    useEffect(() => {
      fetchFiles();
    }, []);
    
    return (
      <div className="flex justify-center items-center h-screen">
        <iframe
          src={links}
          width="80%"
          height="100%"
          className="border rounded-lg shadow-md"
          title="PDF Viewer"
        ></iframe>
      </div>
    );
};

export default ShowFiles;