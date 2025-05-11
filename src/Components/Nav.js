import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import bg from '../Assets/1746837062044.png';

function Navs({ onlyNavbar }) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // تأثير تغيير حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const renderNavbar = () => (
    <Navbar expand="lg"
      className={`Navbar ${scrolled ? 'scrolled' : ''} ${onlyNavbar ? 'only-navbar' : ''}`}
      fixed={scrolled ? 'top' : ''}
    >
      <Container>
        <Navbar.Toggle aria-controls="offcanvasNavbar">
          <i className="fa-solid fa-bars" style={{ color: 'white', fontSize: '24px' }}></i>
        </Navbar.Toggle>
        <Navbar.Brand as={Link} to="/" style={{ color: "white", fontSize: "25px" }} className='aaa'>
          <img className='logo' src={bg} />
        </Navbar.Brand>

        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
          className="offcanvas-custom"
        >
          <Offcanvas.Header className='offcanvas-close' closeButton>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-center flex-grow-1 pe-3 navbar-custom">
     <hr/>
              <Nav.Link as={Link} to="/">رئيسيه</Nav.Link>
              <hr/>
              <Nav.Link href="#eco">المتجر</Nav.Link>
              <hr/>
              <Nav.Link as={Link} to="/about">معلومات عنا</Nav.Link>
              <hr/>
              <Nav.Link as={Link} to="/contact">تواصل معنا</Nav.Link>
              <hr/>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>

        <div className='icon-heart'>
  <a href="/cart">
    <i className="fa-solid fa-bag-shopping">   
    0
    </i>
  </a>
</div>

      </Container>
    </Navbar>
  );


  if (onlyNavbar) {
    return renderNavbar();
  }

  return (
    <header>
 
      {renderNavbar()}

 
    </header>
  );
}

export default Navs;
