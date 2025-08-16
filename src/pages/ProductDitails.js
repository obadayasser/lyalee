import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Carousel,
  Collapse,
  Alert,
} from "react-bootstrap";
import {
  db,
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "../FireBase/Firebase";
import sss from "../Assets/1.jpg";
import Navs from "../Components/Nav";
import LoadingScreen from "../pages/Loading";
import { toast } from "react-toastify";
import Footer from "../Components/Footer";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useDispatch } from "react-redux";
import { addToCartInFirestore, updateQuantityInCart } from "../slices/cartSlice"; 
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFeatures, setOpenFeatures] = useState(false);
  const [openCare, setOpenCare] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedHeight, setSelectedHeight] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const collections = ["one", "two", "three", "pageone"];
        for (const name of collections) {
          const docRef = doc(db, name, id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProduct({ id: docSnap.id, ...docSnap.data() });
            break;
          }
        }
      } catch (err) {
        console.error("خطأ في جلب المنتج:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

const checkIfProductInCart = async (guestId) => {
  const cartRef = collection(db, "cart");
  const q = query(
    cartRef,
    where("guestId", "==", guestId), 
    where("productId", "==", product.id),
    where("color", "==", selectedColor),
    where("weight", "==", selectedWeight),
    where("height", "==", selectedHeight)
  );
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : snapshot.docs[0];
};


const getGuestId = () => {
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
};

const handleAddOrUpdate = async (goToCheckout = false) => {
  if (!selectedColor || !selectedWeight || !selectedHeight) {
    toast.error("❌ اختر اللون والوزن والطول أولاً");
    return;
  }

  if (!product.availability) {
    toast.error("❌ المنتج غير متوفر حالياً");
    return;
  }

  try {
    const guestId = getGuestId(); 

    const existingItem = await checkIfProductInCart(guestId);

    if (existingItem) {
      // 👇 نستخدم thunk من cartSlice
      dispatch(
        updateQuantityInCart({
          itemId: existingItem.id,
          quantity: existingItem.data().quantity + quantity,
        })
      );
      toast.success(`✅ تم تحديث الكمية لـ ${product.text}`);
    } else {
      dispatch(
        addToCartInFirestore({
          productId: product.id,
          text: product.text,
          price: product.price,
          img: product.image || sss,
          quantity,
          weight: selectedWeight,
          height: selectedHeight,
          color: selectedColor,
          guestId,
        })
      );
      toast.success("✅ تمت الإضافة للسلة");
    }

    if (goToCheckout) navigate("/checkout");
  } catch (error) {
    console.error("خطأ:", error);
    toast.error("❌ حدث خطأ أثناء الإضافة!");
  }
};

  if (loading) return <LoadingScreen />;
  if (!product) return <Alert variant="danger">المنتج غير موجود</Alert>;

  const productImages = product.images || [sss];

  return (
    <>
      <Navs />
      <Container
        className="my-5 product-details"
        style={{ paddingTop: "100px" }}
      >
        <Row>
          <Col md={6}>
            <Carousel>
              {productImages.map((img, index) => (
                <Carousel.Item key={index}>
                  <Zoom>
                    <img
                      className="d-block w-100"
                      src={img}
                      loading="lazy"
                      alt={`صورة المنتج ${index + 1}`}
                      onError={(e) => (e.target.src = sss)}
                      style={{ cursor: "zoom-in" }}
                    />
                  </Zoom>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
          <Col md={6}>
            <Card className="details-card">
              <Card.Body>
                <Card.Title className="product-title">
                  {product.text}
                </Card.Title>
                <Card.Text className="product-price">
                  السعر: {product.price} ج.م
                </Card.Text>
                {!product.availability && (
                  <Alert variant="danger">المنتج غير متوفر</Alert>
                )}
                <Card.Text className="product-description">
                  {product.description || "لا يوجد وصف متاح لهذا المنتج."}
                </Card.Text>
                <hr />
                <h5
                  onClick={() => setOpenFeatures(!openFeatures)}
                  style={{ cursor: "pointer" }}
                >
                  مميزات المنتج:
                </h5>
                <Collapse in={openFeatures}>
                  <div>
                    طول الموديل: 176 سم
                    <br />
                    وزن الموديل: 70 كجم
                  </div>
                </Collapse>
                <hr />
                <h5
                  onClick={() => setOpenCare(!openCare)}
                  style={{ cursor: "pointer" }}
                >
                  الوقت والعناية:
                </h5>
                <Collapse in={openCare}>
                  <div>
                    الوقت المتوقع للتوصيل: 3 أيام.
                    <br />
                    تعليمات العناية: يُغسل يدوياً أو بغسالة بدرجة حرارة منخفضة.
                  </div>
                </Collapse>
                <hr />
                <h5 className="pt-4">اختر اللون ✨</h5>
                <div className="d-flex flex-wrap gap-2 pb-3">
                  {(product.colors || []).map((color, index) => (
                    <Button
                      key={index}
                      variant={
                        selectedColor === color
                          ? "secondary"
                          : "outline-secondary"
                      }
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color }}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
                <h5 className="pt-4">اختر الوزن ✨</h5>
                <div className="d-flex flex-wrap gap-2 pb-3">
                  <Button
                    variant={
                      selectedWeight === "1" ? "secondary" : "outline-secondary"
                    }
                    onClick={() => setSelectedWeight("1")}
                  >
                    من 60 إلى 90 كيلو
                  </Button>
                  <Button
                    variant={
                      selectedWeight === "2" ? "secondary" : "outline-secondary"
                    }
                    onClick={() => setSelectedWeight("2")}
                  >
                    من 90 إلى 125 كيلو
                  </Button>
                </div>
                <h5 className="pt-4">اختر الطول ✨</h5>
                <div className="d-flex gap-2 pb-3">
                  <Button
                    variant={
                      selectedHeight === "over160"
                        ? "secondary"
                        : "outline-secondary"
                    }
                    onClick={() => setSelectedHeight("over160")}
                  >
                    أكثر من 160 سم
                  </Button>
                  <Button
                    variant={
                      selectedHeight === "under160"
                        ? "secondary"
                        : "outline-secondary"
                    }
                    onClick={() => setSelectedHeight("under160")}
                  >
                    أقل من 160 سم
                  </Button>
                </div>
                <div className="d-flex align-items-center pt-3 pb-3">
                  <Button
                    variant="outline-secondary"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="mx-3">{quantity}</span>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
                <Button
                  variant="dark"
                  className="w-100 mb-2"
                  onClick={() => handleAddOrUpdate(false)}
                  disabled={!product.availability}
                >
                  أضف إلى السلة 🛒
                </Button>
                <Button
                  variant="outline-dark"
                  className="w-100"
                  onClick={() => handleAddOrUpdate(true)}
                  disabled={!product.availability}
                >
                  اشترِ الآن ⚡
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default ProductDetails;
