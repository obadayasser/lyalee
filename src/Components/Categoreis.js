import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { db, collection, getDocs } from '../FireBase/Firebase';
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoriesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(categoriesList);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
    });
  }, []);
  useEffect(() => {
    if (location.hash === "#categ") {
      const element = document.getElementById("categ");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Container className="my-4" style={{ paddingTop: "100px" }} id='categ'>
      <div className='head'>
        <button className='head' disabled>تسوق حسب النوع</button>
      </div>

      <Row className="category-grid">
        {categories.map((category) => (
          <Col md={3} sm={6} xs={6} key={category.id} className="mb-4"

            data-aos="fade-in"
            data-aos-easing="ease-out"
            data-aos-duration="700"
            data-aos-once="true"
          >
            <Link to={`/${category.page}`} style={{ textDecoration: 'none' }}>
              <Card className="category-card">
                <div className="category-image" >
                  <img
                    src={category.img}
                    alt={category.name}
                    className="img-fluid"
                  />
                  <div className="overlay">
                    {category.name}
                  </div>
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Shop;
