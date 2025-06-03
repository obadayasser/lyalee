import React from "react";
import ewe from "../Assets/1746837062044.png";

const LoadingScreen = () => {
  return (
    <div className="loading-screen d-flex justify-content-center align-items-center">
      <img src={ewe} alt="Logo" className="animated-logo" />
    </div>
  );
};

export default LoadingScreen;
