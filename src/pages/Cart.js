import { useEffect, useState } from 'react';
import { db, collection, getDocs, deleteDoc, doc, updateDoc, getDoc } from '../FireBase/Firebase';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingScreen from '../pages/Loading';
import Navs from '../Components/Nav';
import Footer from '../Components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
    });
  }, []);


const fetchCartItems = async () => {
  try {
    const cartSnapshot = await getDocs(collection(db, "cart"));
    const collectionNames = ["one", "two", "three", "pageone"];

    const cartList = await Promise.all(
      cartSnapshot.docs.map(async (cartDoc) => {
        const cartItem = { id: cartDoc.id, ...cartDoc.data() };
        let foundProduct = null;

        for (const collectionName of collectionNames) {
          const productRef = doc(db, collectionName, cartItem.productId);
          const productSnap = await getDoc(productRef);

          if (productSnap.exists()) {
            foundProduct = productSnap.data();
            break;
          }
        }

        if (foundProduct) {
          cartItem.img = foundProduct.img;
          cartItem.text = foundProduct.text;
          cartItem.price = foundProduct.price;
          cartItem.weight = foundProduct.weight;
          cartItem.height = foundProduct.height;
          cartItem.color = foundProduct.color;
        } else {
          console.warn(`Product with id ${cartItem.productId} not found in any collection.`);
        }

        return cartItem;
      })
    );

    setCartItems(cartList);
    calculateTotalPrice(cartList);

    return cartList;
  } catch (error) {
    toast.error('حدث خطأ أثناء جلب العناصر من السلة');
    throw error;
  } finally {
    setLoading(false);
  }
};


  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(total);
  };

  const removeItemFromCart = async (itemId) => {
    try {
      await deleteDoc(doc(db, "cart", itemId));
      toast.success('تم حذف المنتج من السلة');
      fetchCartItems();
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف المنتج من السلة');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const cartRef = doc(db, "cart", itemId);
      await updateDoc(cartRef, { quantity });
      toast.success('تم تحديث الكمية');
      fetchCartItems();
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث الكمية');
    }
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  const continueShopping = () => {
    navigate('/');
  };

  const goToProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Navs />
      <Container className="my-5" style={{ paddingTop: "100px" }}>
        <div className="d-flex justify-content-between mt-4">
          <h2 style={{ color: "#000", paddingBottom: "30px" }}>سلة المشتريات</h2>
          <Link style={{ color: "#000" }} to="/all">تكملة التسوق</Link>
        </div>

        {cartItems.length === 0 ? (
          <Alert variant="warning">لا توجد منتجات في السلة.</Alert>
        ) : (
          <>
            <div className="cart-items-list" style={{ border: '1px solid #ccc' }}>
              {cartItems.map((item) => (
                <Card key={item.id} className="mb-2 border-0"
                  data-aos="fade-in"
                  data-aos-easing="ease-out"
                  data-aos-duration="700"
                  data-aos-once="true"
                >
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col md={5}>
                        <Row>
                          <Col md={3}>
                            <img
                              src={item.img}
                              alt={item.text}
                              style={{ width: '120px', height: '100px', objectFit: 'cover' }}
                            />
                          </Col>
                          <Col>
                            <h5
                              style={{ cursor: 'pointer', color: '#000' }}
                              onClick={() => goToProductDetails(item.productId)}
                            >
                              {item.text}
                            </h5>
                            <p>{item.price} ج.م</p>
                            <p className="mb-1"><strong>الوزن:</strong> {item.weight}</p>
                            <p className="mb-1"><strong>الطول:</strong> {item.height}</p>
                            <p className="mb-1"><strong>اللون:</strong> {item.color}</p>
                          </Col>
                        </Row>
                      </Col>

                      <Col md={3} className="mt-2 mt-md-0">
                        <div className="d-flex align-items-center">
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              border: '1px solid #ccc',
                              borderRadius: '5px',
                              padding: '5px',
                            }}
                          >
                            <Button
                              variant="none"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              style={{ border: '0' }}
                            >
                              -
                            </Button>
                            <span className="mx-2">{item.quantity}</span>
                            <Button
                              variant="none"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              style={{ border: '0' }}
                            >
                              +
                            </Button>
                          </div>

                          <i className="fa-solid fa-trash mx-4"
                            onClick={() => removeItemFromCart(item.id)}
                            style={{ cursor: "pointer" }}
                          ></i>
                        </div>
                      </Col>

                      <Col md={4} className="mt-3 mt-md-0">
                        {item.price * item.quantity} ج.م
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>

            <div className="d-flex justify-content-between mt-4">
              <h5> المجموع التقديري: {totalPrice} ج.م</h5>
              <Button variant="none" style={{ background: "#a05b00", color: "#fff" }} onClick={proceedToCheckout}>المواصله للدفع</Button>
            </div>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Cart;
