import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { db, collection, getDocs } from '../FireBase/Firebase';
import sss from '../Assets/1.jpg';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Product1 = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
    });
  }, []);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "pageone"));
    const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(productsList);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const goToProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <div className='head'>
        <button className='head' disabled>عبايه ليالي</button>
      </div>

      <Container className="my-4 one">
        <Row>
          {products.slice(0, 6).map((product, index) => (
            <Col
              key={index}
              xs={6}
              md={3}
              className="mb-4"
              data-aos="fade-up"
              data-aos-easing="ease-out"
              data-aos-duration="700"
              data-aos-once="true"
            >
              <Card className="product-wrapper">
                <div className="product-card position-relative" style={{ cursor: "pointer" }}>
                  <Card.Img
                    variant="top"
                    src={product.img }
                    loading="lazy"
                    onClick={() => product.availability !== false && goToProductDetails(product.id)}
                    className={product.availability === false ? 'unavailable-image' : ''}
                  />
                  {product.availability === false && (
                    <div className="overlay-unavailable">
                      ⚠️ غير متوفر حالياً
                    </div>
                  )}

                  <Button
                    className="overlay-button"
                    onClick={() => product.availability !== false && goToProductDetails(product.id)}
                    disabled={product.availability === false}
                  >
                    عرض تفاصيل
                  </Button>
                </div>

                <Card.Body className="product-text text-center">
                  <Card.Title>{product.text}</Card.Title>
                  <Card.Text>{product.price} ج.م</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className='btn-all text-center' >
          <Link to="/pageone">
            <Button variant="none" style={{ background: "#a05b00", color: "#fff" }}>
              عرض جميع المنتجات
            </Button>
          </Link>
        </div>
      </Container>
    </>
  );
};

export default Product1;
