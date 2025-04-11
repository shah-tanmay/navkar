import React, { useState } from "react";
import { getLoaderFunctions } from "../utils/loader"; // Import loader functions
import { Loader } from "../components/Loader"; // Import your Loader component

const TestLoaderPage = () => {
  const [loading, setLoading] = useState(false);

  const handleShowLoader = () => {
    setLoading(true);
    getLoaderFunctions().showLoader(); // Show loader
    setTimeout(() => {
      getLoaderFunctions().hideLoader(); // Hide after 3 seconds
      setLoading(false);
    }, 3000);
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Test Loader</h2>
      <button
        onClick={handleShowLoader}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Show Loader for 3 Seconds
      </button>

      {loading && <Loader />}
    </div>
  );
};

export default TestLoaderPage;
