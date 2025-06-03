import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form, Accordion } from 'react-bootstrap';
import { db, collection, getDocs, addDoc, doc, updateDoc, query, where } from '../FireBase/Firebase';
import sss from '../Assets/1.jpg';
import { toast } from 'react-toastify';
import Navs from '../Components/Nav';
import LoadingScreen from '../pages/Loading';
import Footer from '../Components/Footer';

const Pageone = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [selectedLength, setSelectedLength] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedHeight, setSelectedHeight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [filters, setFilters] = useState({
    availability: 'all',
    priceRange: [0, 10000],
    sortBy: 'bestSelling'
  });

  const navigate = useNavigate();

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "one"));
    const productsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      salesCount: doc.data().salesCount || 0
    }));
    setProducts(productsList);
    setFilteredProducts(productsList);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProducts();
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const applyFilters = () => {
    let result = [...products];

    if (filters.availability === 'inStock') {
      result = result.filter(p => p.availability === true);
    } else if (filters.availability === 'outOfStock') {
      result = result.filter(p => p.availability === false);
    }

    result = result.filter(p =>
      p.price >= filters.priceRange[0] &&
      p.price <= filters.priceRange[1]
    );

    switch (filters.sortBy) {
      case 'bestSelling':
        result.sort((a, b) => b.salesCount - a.salesCount);
        break;
      case 'priceLowToHigh':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setSelectedWeight('');
    setSelectedLength('');
    setSelectedColor(null);
    setSelectedHeight(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleAddOrUpdateCart = async (buyNow = false) => {
    if (!selectedColor || !selectedWeight || !selectedHeight) {
      toast.error("❌ يرجى اختيار اللون، الوزن والطول قبل الإضافة للسلة.");
      return;
    }

    if (!selectedProduct.availability) {
      toast.error("❌ المنتج غير متوفر في المخزون!");
      return;
    }

    try {
      const cartQuery = query(
        collection(db, "cart"),
        where("productId", "==", selectedProduct.id),
        where("color", "==", selectedColor),
        where("weight", "==", selectedWeight),
        where("height", "==", selectedHeight)
      );

      const querySnapshot = await getDocs(cartQuery);

      if (!querySnapshot.empty) {
        const cartItem = querySnapshot.docs[0];
        await updateDoc(doc(db, "cart", cartItem.id), {
          quantity: cartItem.data().quantity + quantity,
          timestamp: new Date()
        });
        toast.success(`✅ تم تحديث الكمية لـ ${selectedProduct.text}`);
      } else {
        await addDoc(collection(db, "cart"), {
          productId: selectedProduct.id,
          text: selectedProduct.text,
          price: selectedProduct.price,
          img: selectedProduct.img || sss,
          quantity,
          weight: selectedWeight,
          height: selectedHeight,
          color: selectedColor,
          timestamp: new Date(),
        });
        toast.success("✅ تمت الإضافة للسلة!");
      }

      setShowModal(false);

      if (buyNow) {
        navigate('/checkout');
      }
    } catch (error) {
      console.error("خطأ أثناء الإضافة:", error);
      toast.error("❌ حدث خطأ أثناء الإضافة!");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Navs />
      <Container className="my-4 one" style={{ paddingTop: "150px" }}>
        <div className='head'>
          <button className='head' disabled> كارديجينات</button>
        </div>
        <Row>
          <Col md={3} className="mb-4">
            <Card className="p-3">
              <h5>تصفية المنتجات</h5>
              <Accordion defaultActiveKey={['0']} alwaysOpen>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>التوفر</Accordion.Header>
                  <Accordion.Body>
                    <Form.Group>
                      <Form.Check
                        type="radio"
                        label="جميع المنتجات"
                        name="availability"
                        checked={filters.availability === 'all'}
                        onChange={() => setFilters({ ...filters, availability: 'all' })}
                      />
                      <Form.Check
                        type="radio"
                        label="متوفر في المخزن"
                        name="availability"
                        checked={filters.availability === 'inStock'}
                        onChange={() => setFilters({ ...filters, availability: 'inStock' })}
                      />
                      <Form.Check
                        type="radio"
                        label="غير متوفر"
                        name="availability"
                        checked={filters.availability === 'outOfStock'}
                        onChange={() => setFilters({ ...filters, availability: 'outOfStock' })}
                      />
                    </Form.Group>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>السعر</Accordion.Header>
                  <Accordion.Body>
                    <Form.Group>
                      <Form.Label>
                        النطاق السعري: {filters.priceRange[0]} - {filters.priceRange[1]} ج.م
                      </Form.Label>
                      <Form.Range
                        min="0"
                        max="10000"
                        step="100"
                        value={filters.priceRange[1]}
                        onChange={(e) => setFilters({
                          ...filters,
                          priceRange: [0, parseInt(e.target.value)]
                        })}
                      />
                    </Form.Group>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card>
          </Col>

          <Col md={9}>
            <div className="d-flex justify-content-between mb-4 align-items-center">
              <div>
                <span className="me-2">ترتيب حسب:</span>
                <Form.Select
                  style={{ width: '200px', display: 'inline-block' }}
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                >
                  <option value="bestSelling">الأكثر مبيعاً</option>
                  <option value="priceLowToHigh">السعر: من الأقل للأعلى</option>
                  <option value="priceHighToLow">السعر: من الأعلى للأقل</option>
                  <option value="newest">الأحدث</option>
                </Form.Select>
              </div>
              <div>
                <span>{filteredProducts.length} منتج</span>
              </div>
            </div>

            <Row>
              {filteredProducts.map((product, index) => (
                <Col key={index} xs={6} md={4} className="mb-4">
                  <Card className="product-wrapper">
                    <div className="product-card">
                      <Card.Img
                        variant="top"
                        src={product.img || sss}
                        onClick={() => handleQuickView(product)}
                        style={{ cursor: 'pointer' }}
                      />
                      <Button className="overlay-button"
                        onClick={() => handleQuickView(product)}
                      >
                        عرض سريع
                      </Button>
                    </div>
                    <Card.Body className="product-text">
                      <Card.Title>{product.text}</Card.Title>
                      <Card.Text>{product.price}  ج.م</Card.Text>
                      {product.availability === false && (
                        <span className="text-danger">غير متوفر</span>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {loadingMore && (
              <div className="text-center py-4">
                <span>جاري تحميل المزيد من المنتجات...</span>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      {selectedProduct && (
        <Modal show={showModal} onHide={handleClose} size="xl" centered dir="rtl">
          <Modal.Body style={{ padding: '2rem' }}>
            <Row>
              <Col md={6}>
                <img
                  src={selectedProduct.img || sss}
                  alt={selectedProduct.text}
                  className="img-fluid"
                />
              </Col>
              <Col md={6}>
                <h3>{selectedProduct.text}</h3>
                <p><strong>السعر:</strong> {selectedProduct.price} ج.م </p>

                {selectedProduct.availability === false && (
                  <div className="alert alert-danger">
                    المنتج غير متوفر في المخزن
                  </div>
                )}

                <h5 className="pt-3">اختر اللون ✨</h5>
                <div className="d-flex flex-wrap gap-2 pb-3">
                  {(selectedProduct.colors || []).map((color, index) => (
                    <Button
                      key={index}
                      variant={selectedColor === color ? 'secondary' : 'outline-secondary'}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>

                <h5>اختر الوزن ✨</h5>
                <div className="d-flex flex-wrap gap-2 pb-3">
                  {['من 60 إلى 90 كيلو', 'من 90 إلى 125 كيلو'].map((weight, index) => (
                    <Button
                      key={index}
                      variant={selectedWeight === weight ? 'secondary' : 'outline-secondary'}
                      onClick={() => setSelectedWeight(weight)}
                    >
                      {weight}
                    </Button>
                  ))}
                </div>

                <h5>اختر الطول ✨</h5>
                <div className="d-flex gap-2 pb-3">
                  {['أكثر من 160 سم', 'أقل من 160 سم'].map((height, index) => (
                    <Button
                      key={index}
                      variant={selectedHeight === height ? 'secondary' : 'outline-secondary'}
                      onClick={() => setSelectedHeight(height)}
                    >
                      {height}
                    </Button>
                  ))}
                </div>

                <h5>الكمية</h5>
                <div className="d-flex align-items-center pb-3">
                  <Button variant="outline-dark" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</Button>
                  <span className="mx-3">{quantity}</span>
                  <Button variant="outline-dark" onClick={() => setQuantity(q => q + 1)}>+</Button>
                </div>

                <Button
                  className="w-100 mb-2"
                  variant="dark"
                  onClick={handleAddOrUpdateCart}
                  disabled={!selectedProduct.availability}
                >
                  أضف إلى السلة 🛒
                </Button>
                <Button
                  className="w-100"
                  variant="outline-dark"
                  disabled={!selectedProduct.availability}
                >
                  اشترِ الآن ⚡
                </Button>
                {selectedProduct.availability && (
                  <Link to={`/product/${selectedProduct.id}`}>
                    <Button className="w-100 mt-2" variant="outline-primary">
                      عرض كل التفاصيل
                    </Button>
                  </Link>
                )}
              </Col>
            </Row>

            <Button
              variant="light"
              onClick={handleClose}
              style={{ position: 'absolute', top: 10, left: 10 }}
            >
              &times;
            </Button>
          </Modal.Body>
        </Modal>
      )}
      <Footer/>
    </>
  );
};

export default Pageone;
