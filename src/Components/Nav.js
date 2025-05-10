import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import bg from '../Assets/1746837062044.png'
function CollapsibleExample() {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary navbar">
      <Container>
        <Navbar.Brand href="#home"><img  src={bg} /></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        
        {/* Offcanvas component should be used here */}
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel"> ليالي فاشون</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="me-auto ">
              <Nav.Link href="#features">العروض</Nav.Link>
              <Nav.Link href="#pricing">وصل حديثا</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link href="#deets">كلمنا </Nav.Link>
             
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default CollapsibleExample;
