import React, { useState, useEffect, useRef } from "react";

const DiscountPopup = () => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [copied, setCopied] = useState(false);
  const couponCode = "layale";
  const timeoutRef = useRef(null);

  useEffect(() => {
    const wasShown = sessionStorage.getItem('discountPopupShown');
    if (!wasShown) {
      setVisible(true);
      sessionStorage.setItem('discountPopupShown', 'true');
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(couponCode).then(() => {
      setCopied(true);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClose = () => {
    setClosing(true);
  };

  const handleAnimationEnd = () => {
    if (closing) {
      setVisible(false);
      setClosing(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        .popup {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background-color: #fff8dc;
          border: 2px solid #f0c040;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          padding: 20px 30px;
          z-index: 9999;
          max-width: 400px;
          margin: 15px auto;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          animation-fill-mode: forwards;
        }
        .popup.open {
          animation: fadeDown 0.6s forwards;
        }
        .popup.closing {
          animation: fadeUp 0.6s forwards;
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-20px); }
        }
      `}</style>
      <div
        className={`popup ${closing ? "closing" : "open"}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div style={{ textAlign: "center" }}>
          احصل على خصم 10% عند استخدام كود الخصم الخاص بنا!
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <button
            onClick={copyToClipboard}
            style={{
              backgroundColor: copied ? "#4CAF50" : "#f0c040",
              border: "none",
              borderRadius: "5px",
              padding: "8px 12px",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#333",
              transition: "background-color 0.3s",
              minWidth: "120px",
            }}
          >
            {copied ? "تم النسخ!" : `نسخ الكود: ${couponCode}`}
          </button>
          <button
            onClick={handleClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#666",
              lineHeight: "1",
              padding: "0 5px",
            }}
            aria-label="اغلاق"
          >
            &times;
          </button>
        </div>
      </div>
    </>
  );
};

export default DiscountPopup;
