import { useEffect, useState, useRef, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link, useNavigate } from 'react-router-dom';
import bg from '../Assets/1746837062044.png';
import { collection, onSnapshot, query ,where} from 'firebase/firestore';
import { db } from '../FireBase/Firebase';

function Navs({ onlyNavbar }) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [cartCount, setCartCount] = useState(0);
  const offcanvasRef = useRef(null);
  const navigate = useNavigate();
const getGuestId = () => {
  let guestId = localStorage.getItem("guestId");

  if (!guestId) {
    guestId = `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    localStorage.setItem("guestId", guestId);
  }

  return guestId;
};
  const scrollToElement = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn(`Element with id ${id} not found!`);
    }
  };

  const handleScrollToCateg = useCallback(() => {
    if (offcanvasRef.current) {
      const offcanvasEl = offcanvasRef.current;
      const bsOffcanvas = window.bootstrap?.Offcanvas.getInstance(offcanvasEl);
      if (bsOffcanvas) bsOffcanvas.hide();
    }

    if (window.location.pathname === '/') {
      scrollToElement('categ');
    } else {
      navigate('/');
      setTimeout(() => scrollToElement('categ'), 500);
    }
  }, [navigate]);

useEffect(() => {
  const guestId = getGuestId(); 

  const cartCollection = query(
    collection(db, "cart"),
    where("guestId", "==", guestId) 
  );

  const unsubscribe = onSnapshot(cartCollection, (querySnapshot) => {
    const totalItems = querySnapshot.docs.reduce((total, doc) => {
      return total + (doc.data().quantity || 1);
    }, 0);
    setCartCount(totalItems);
  });

  return () => unsubscribe();
}, []);


  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 30;
      if (isScrolled !== scrolled) setScrolled(isScrolled);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header>
      <Navbar
        expand="lg"
        className={`Navbar ${scrolled ? 'scrolled' : ''} ${onlyNavbar ? 'only-navbar' : ''}`}
        fixed="top"
      >
        <Container>
          <Navbar.Toggle aria-controls="offcanvasNavbar">
            <i className="fa-solid fa-bars" style={{ color: 'black', fontSize: '24px' }}></i>
          </Navbar.Toggle>
          <Navbar.Brand as={Link} to="/" style={{ color: "white", fontSize: "25px" }} className='aaa'>
            <img className='logo' src={bg} alt="Logo" />
          </Navbar.Brand>

          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
            className="offcanvas-custom"
            ref={offcanvasRef}
          >
            <Offcanvas.Header className='offcanvas-close' closeButton></Offcanvas.Header>
            <Offcanvas.Body className='sdqwq'>
              <Nav className="justify-content-center flex-grow-1 pe-3 navbar-custom">
                <hr />
                <Nav.Link as={Link} to='/'>رئيسيه</Nav.Link>
                <hr />
                <Nav.Link as={Link} to='/all'>تسوق الان</Nav.Link>
                <hr />
                <Nav.Link as={Link} to='/recovery'>سياسة الاستبدال والإرجاع</Nav.Link>
                <hr />
                <Nav.Link as={Link} to='/shipping'>سياسة الشحن</Nav.Link>
                <hr />

                <Nav.Link as={Link} to='/contact'> تواصل معنا</Nav.Link>
                <hr />
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>

          <div className='icon-heart'>
            <Link to="/cart">
              <i className="fa-solid fa-cart-shopping">
                <span> {cartCount}</span>
              </i>
            </Link>
          </div>
        </Container>
      </Navbar>
    </header>
  );
}

export default Navs;