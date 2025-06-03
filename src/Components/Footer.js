import React from 'react';
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {

    return (
        <footer className="footer">
            <div className="footer__menu">
                <h4 className="footer__title">القائمه</h4>
                <div className="footer__links">
                    <Link to="/recovery">سياسة الاستبدال والإرجاع</Link>
                    <Link to="/shipping">سياسة الشحن</Link>
                </div>
                <hr/>
                <div className="footer__icons">
                    <a target='_blank' href="https://www.facebook.com/share/1J3AZndfJp/"><FaFacebookF /></a>
                    <a target='_blank' href="https://www.instagram.com/layalefashioneg?utm_source=qr&igsh=OW4ybWE4M2ZyeG1x"><FaInstagram /></a>
                    <a target='_blank' href="#"><FaTiktok /></a>
                </div>
            </div>
  <div className="footer__bottom">
          
                <p>© 2025, Layalee Fashion</p>
            </div>

            <a
                href="https://wa.me/201093518834"
                className="footer__whatsapp"
                target="_blank"
                rel="noopener noreferrer"
            >
                <FaWhatsapp size={24} color="white" />
            </a>
        </footer>
    );
};

export default Footer;
