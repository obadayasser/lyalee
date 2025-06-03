import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Carousel, Collapse, Alert } from 'react-bootstrap';
import { db, doc, getDoc, addDoc, collection, query, where, getDocs, updateDoc } from '../FireBase/Firebase';
import sss from '../Assets/1.jpg';
import Navs from '../Components/Nav';
import LoadingScreen from '../pages/Loading';
import { toast } from 'react-toastify';
import Footer from '../Components/Footer';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

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

  const fetchProduct = async () => {
    try {
      const collectionNames = ["one", "two", "three", "pageone"];
      let found = false;

      for (const collectionName of collectionNames) {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
          found = true;
          break;
        }
      }

      if (!found) {
        console.log("No such document in any collection!");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const checkIfProductInCart = async () => {
    const cartRef = collection(db, "cart");
    const q = query(
      cartRef,
      where("productId", "==", product.id),
      where("color", "==", selectedColor),
      where("weight", "==", selectedWeight),
      where("height", "==", selectedHeight)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty ? null : querySnapshot.docs[0];
  };

  const addToCart = async () => {
    if (!selectedColor || !selectedWeight || !selectedHeight) {
      toast.error("❌ الرجاء اختيار اللون، الوزن والطول قبل إضافة المنتج إلى السلة.");
      return;
    }

    try {
      const existingCartItem = await checkIfProductInCart();

      if (existingCartItem) {
        const itemRef = doc(db, "cart", existingCartItem.id);
        await updateDoc(itemRef, { quantity: existingCartItem.data().quantity + quantity });
        toast.success("تم تحديث الكمية في السلة");
      } else {
        await addDoc(collection(db, "cart"), {
          productId: product.id,
          text: product.text,
          price: product.price,
          image: product.image || sss,
          quantity: quantity,
          weight: selectedWeight,
          height: selectedHeight,
          color: selectedColor,
          timestamp: new Date(),
        });
        toast.success("تمت الإضافة إلى السلة");
      }

      navigate('/cart');
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("❌ حدث خطأ أثناء إضافة المنتج!");
    }
  };

  if (loading) return <LoadingScreen />;
  if (!product) return <Alert variant="danger">المنتج غير موجود</Alert>;

  const productImages = product.images || [sss];

  return (
    <>
      <Navs />
      <Container className="my-5 product-details" style={{ paddingTop: "100px" }}>
        <Row>
          <Col md={6}>
            <Carousel>
              {productImages.map((img, index) => (
                <Carousel.Item key={index}>
                  <Zoom>
                    <img
                      className="d-block w-100"
                      src={img}
                      alt={`صورة المنتج ${index + 1}`}
                      onError={(e) => { e.target.src = sss; }}
                      style={{ cursor: 'zoom-in'}}
                    />
                  </Zoom>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
          <Col md={6}>
            <Card className="details-card">
              <Card.Body>
                <Card.Title className="product-title">{product.text}</Card.Title>

                <Card.Text className="product-price">
                  السعر: {product.price} ج.م
                </Card.Text>

                {product.availability === false && (
                  <Alert variant="danger">المنتج غير متوفر في المخزن</Alert>
                )}

                <Card.Text className="product-description">
                  {product.description || "لا يوجد وصف متاح لهذا المنتج."}
                </Card.Text>
                <hr />

                <h5 onClick={() => setOpenFeatures(!openFeatures)} style={{ cursor: "pointer" }}>
                  مميزات المنتج:
                </h5>
                <Collapse in={openFeatures}>
                  <div>
                    طول الموديل: 176 سم<br />
                    وزن الموديل: 70 كجم
                  </div>
                </Collapse>
                <hr />

                <h5 onClick={() => setOpenCare(!openCare)} style={{ cursor: "pointer" }}>
                  الوقت والعناية:
                </h5>
                <Collapse in={openCare}>
                  <div>
                    الوقت المتوقع للتوصيل: يتم شحن المنتج في غضون 3 أيام.<br />
                    تعليمات العناية: يُغسل يدوياً أو باستخدام غسالة على درجة حرارة منخفضة.
                  </div>
                </Collapse>
                <hr />

                <h5 className="pt-4">اختر اللون ✨</h5>
                <div className="d-flex flex-wrap gap-2 pb-3">
                  {(product.colors || []).map((color, index) => (
                    <Button
                      key={index}
                      variant={selectedColor === color ? 'secondary' : 'outline-secondary'}
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
                    variant={selectedWeight === '1' ? 'secondary' : 'outline-secondary'}
                    onClick={() => setSelectedWeight('1')}
                  >
                    من 60 إلى 90 كيلو
                  </Button>
                  <Button
                    variant={selectedWeight === '2' ? 'secondary' : 'outline-secondary'}
                    onClick={() => setSelectedWeight('2')}
                  >
                    من 90 إلى 125 كيلو
                  </Button>
                </div>

                <h5 className="pt-4">اختر الطول ✨</h5>
                <div className="d-flex gap-2 pb-3">
                  <Button
                    variant={selectedHeight === 'over160' ? 'secondary' : 'outline-secondary'}
                    onClick={() => setSelectedHeight('over160')}
                  >
                    أكثر من 160 سم
                  </Button>
                  <Button
                    variant={selectedHeight === 'under160' ? 'secondary' : 'outline-secondary'}
                    onClick={() => setSelectedHeight('under160')}
                  >
                    أقل من 160 سم
                  </Button>
                </div>

                <div className="d-flex align-items-center pt-3 pb-3">
                  <Button variant="outline-secondary" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                  <span className="mx-3">{quantity}</span>
                  <Button variant="outline-secondary" onClick={() => setQuantity(quantity + 1)}>+</Button>
                </div>

                <Button
                  variant="dark"
                  className="w-100 mb-2"
                  onClick={addToCart}
                  disabled={!product.availability}
                >
                  أضف إلى السلة 🛒
                </Button>

                <Button
                  variant="outline-dark"
                  className="w-100"
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
