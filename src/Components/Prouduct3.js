import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { db, collection, getDocs } from '../FireBase/Firebase';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Product3 = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "two"));
      const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products:", error);
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
    fetchProducts();
  }, []);

  const goToProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">جاري تحميل المنتجات...</p>
      </div>
    );
  }

  return (
    <div className="products3-page">
      <div className="products3-header" style={{ backgroundImage: 'linear-gradient(to right, #f5f5f5, #e0e0e0)' }}>
        <Container>
          <h1 className="section-title text-center py-4">
            <span className="title-decoration">⎯⎯⎯</span>
            تشكيله موديلات  أنيقة
            <span className="title-decoration">⎯⎯⎯</span>
          </h1>
          <p className="text-center mb-4">اكتشف أحدث تشكيلة من الموديلات المميزة</p>
        </Container>
      </div>

      <Container className="products3-container py-5">
        <Row className="g-4">
          {products.slice(0, 6).map((product, index) => (
            <Col key={product.id} xs={6} sm={6} md={4} lg={3}

              data-aos="fade-up"
              data-aos-easing="ease-out"
              data-aos-duration="700"
              data-aos-once="true"
            >
              <Card className="product3-card h-100 shadow-sm border-0">
                <div className="product3-image-container">
                  <Card.Img
                    variant="top"
                    src={product.img}
                    alt={product.text}
                    style={{ cursor: "pointer" }}
                    className={`product3-image ${!product.availability ? 'img-grayscale' : ''}`}
                    onClick={() => product.availability && goToProductDetails(product.id)}
                  />
                  {!product.availability && (
                    <div className="sold-out-badge">غير متوفر</div>
                  )}
                  <div className="product3-overlay">
                    <Button
                      variant="outline-light"
                      className="view-details-btn"
                      onClick={() => product.availability !== false && goToProductDetails(product.id)}
                      disabled={product.availability === false}
                    >
                      <i className="bi bi-eye-fill me-2 " ></i>
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>

                <Card.Body className="text-center pt-3 pb-4">
                  <Card.Title className="product3-title mb-2">{product.text}</Card.Title>
                  <div className="d-flex justify-content-center align-items-center">
                    <span className="product3-price">{product.price} ج.م</span>
                    {product.originalPrice && (
                      <span className="product3-original-price ms-2">
                        <del>{product.originalPrice} ج.م</del>
                      </span>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-5">
          <Link to='2'><Button
            variant="outline-primary"
            size="lg"
            className="view-all-btn px-4 py-2"
          >
            عرض جميع المنتجات
            <i className="bi bi-arrow-left ms-2"></i>
          </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default Product3;
