import React, { useState, useEffect } from "react";
import Home from './Components/Home';
import Prouduct1 from "./Components/Prouduct1";
import Prouduct2 from "./Components/Prouduct2";
import Prouduct3 from "./Components/Prouduct3";
import Prouduct4 from "./Components/Prouduct4";
import Categoreis from "./Components/Categoreis";
import Loading from './pages/Loading'; 
import Navs from "./Components/Nav";
import Footer from "./Components/Footer";
import DiscountBanner from "./Components/DiscoundBannar"; 

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div>
      {loading ? (
        <Loading /> 
      ) : (
        <>
        <DiscountBanner />
          <Navs onlyNavbar={false} />
          <Home />
          <Prouduct1 />
          <Categoreis />
          <Prouduct2 />
          <Prouduct3 />
          <Prouduct4 />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
