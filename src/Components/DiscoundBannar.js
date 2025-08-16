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

      <div
        className={`popup ${closing ? "closing" : "open"}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div style={{ textAlign: "center" }}>
          احصل على خصم 10% عند استخدام كود الخصم الخاص بنا!
        </div>
        <div className="sets"

        >
          <button
            className="btn-des"
            onClick={copyToClipboard}
            style={{ backgroundColor: copied ? "#4CAF50" : "#f0c040", }}
          >
            {copied ? "تم النسخ!" : `نسخ الكود: ${couponCode}`}
          </button>
          <button
            className="dis-close"
            onClick={handleClose}
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
