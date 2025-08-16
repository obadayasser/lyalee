import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingScreen from "../pages/Loading";
import Navs from "../Components/Nav";
import Footer from "../Components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

// ✅ Redux
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantityInCart, fetchCartFromFirestore } from "../slices/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ جاي من Redux
  const { items: cartItems, totalPrice, loading } = useSelector((state) => state.cart);

  const [loadingItemId, setLoadingItemId] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
    dispatch(fetchCartFromFirestore()); // ✅ أول ما الصفحة تفتح
  }, [dispatch]);

  const updateQuantity = async (itemId, quantity) => {
    setLoadingItemId(itemId);
    try {
      await dispatch(updateQuantityInCart({ itemId, quantity }));
      toast.success("تم تحديث الكمية");
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث الكمية");
    } finally {
      setLoadingItemId(null);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await dispatch(removeFromCart(itemId));
      toast.success("تم حذف المنتج من السلة");
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const proceedToCheckout = () => navigate("/checkout");
  const continueShopping = () => navigate("/");
  const goToProductDetails = (productId) => navigate(`/product/${productId}`);

  if (loading) return <LoadingScreen />;
  return (
    <>
      <Navs />
      <Container className="my-5" style={{ paddingTop: "100px" }}>
        <div className="d-flex justify-content-between mt-4">
          <h2 style={{ color: "#000", paddingBottom: "30px" }}>
            سلة المشتريات
          </h2>
          <Link style={{ color: "#000" }} to="/all">
            تكملة التسوق
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <Alert variant="warning">لا توجد منتجات في السلة.</Alert>
        ) : (
          <>
            <div
              className="cart-items-list"
              style={{ border: "1px solid #ccc" }}
            >
              {cartItems.map((item) => (
                <Card
                  key={item.id}
                  className="mb-2 border-0"
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
                              loading="lazy"
                              style={{
                                width: "120px",
                                height: "100px",
                                objectFit: "cover",
                              }}
                            />
                          </Col>
                          <Col>
                            <h5
                              style={{ cursor: "pointer", color: "#000" }}
                              onClick={() => goToProductDetails(item.productId)}
                            >
                              {item.text}
                            </h5>
                            <p>{item.price} ج.م</p>
                            <p className="mb-1">
                              <strong>الوزن:</strong> {item.weight}
                            </p>
                            <p className="mb-1">
                              <strong>الطول:</strong> {item.height}
                            </p>
                            <p className="mb-1">
                              <strong>اللون:</strong> {item.color}
                            </p>
                          </Col>
                        </Row>
                      </Col>

                      <Col md={3} className="mt-2 mt-md-0">
                        <div className="d-flex align-items-center">
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              border: "1px solid #ccc",
                              borderRadius: "5px",
                              padding: "5px",
                            }}
                          >
                            <Button
                              type="button"
                              variant="none"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={
                                item.quantity <= 1 || loadingItemId === item.id
                              }
                              style={{ border: "0" }}
                            >
                              -
                            </Button>

                            <span
                              className="mx-2"
                              style={{ width: "24px", textAlign: "center" }}
                            >
                              {loadingItemId === item.id ? (
                                <span
                                  className="spinner-border spinner-border-sm text-secondary"
                                  role="status"
                                ></span>
                              ) : (
                                item.quantity
                              )}
                            </span>

                            <Button
                              type="button"
                              variant="none"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={loadingItemId === item.id}
                              style={{ border: "0" }}
                            >
                              +
                            </Button>
                          </div>

                          <i
                            className="fa-solid fa-trash mx-4"
                            onClick={() => removeItem(item.id)}
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
              <Button
                variant="none"
                style={{ background: "#a05b00", color: "#fff" }}
                onClick={proceedToCheckout}
              >
                المواصله للدفع
              </Button>
            </div>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Cart;
