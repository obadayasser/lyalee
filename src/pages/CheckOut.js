import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  db,
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where
} from '../FireBase/Firebase';
import { Container, Form, Button, Card, Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import LoadingScreen from '../pages/Loading';
import los from '../Assets/1746837062044.png';

const Checkout = () => {
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponDetails, setCouponDetails] = useState(null);
  const navigate = useNavigate();
  const shippingCost = 65;

  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    email: '',
    shippingAddress: '',
    billingAddressSame: true,
    billingAddress: '',
    governorate: '',
    district: '',
    shippingNotes: '',
    saveInfo: false,
    paymentMethod: 'cod',
  });

const getGuestId = () => {
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = `guest_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
};

const fetchCartItems = async () => {
  try {
    const guestId = getGuestId(); // 👈 نجيب guestId الخاص بالزائر

    // ✅ نفلتر السلة بحيث تجيب بس عناصر نفس الزائر
    const cartQuery = query(
      collection(db, "cart"),
      where("guestId", "==", guestId)
    );
    const querySnapshot = await getDocs(cartQuery);

    const collectionNames = ["one", "two", "three", "pageone"];

    const items = await Promise.all(
      querySnapshot.docs.map(async (docSnap) => {
        const cartItem = { id: docSnap.id, ...docSnap.data() };
        let foundProduct = null;

        // 👇 نبحث عن المنتج في كل الـ collections
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
          console.warn(
            `Product with id ${cartItem.productId} not found in any collection.`
          );
        }

        return cartItem;
      })
    );

    setCartItems(items);
  } catch (error) {
    toast.error("❌ حدث خطأ في جلب عناصر السلة");
  } finally {
    setLoading(false);
  }
};


  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal + shippingCost - discountAmount;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("يرجى إدخال كود الخصم");
      return;
    }

    if (isCouponApplied) {
      toast.error("تم تطبيق كوبون خصم بالفعل");
      return;
    }

    setLoading(true);
    try {
      const couponsRef = collection(db, "discounts");
      const q = query(couponsRef, where("code", "==", couponCode.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("كود الخصم غير صالح");
        return;
      }

      const couponDoc = querySnapshot.docs[0];
      const couponData = couponDoc.data();

      if (!couponData.status) {
        toast.error("هذا الكوبون غير مفعل حالياً");
        return;
      }

      if (couponData.minPurchase && subtotal < couponData.minPurchase) {
        toast.error(`الحد الأدنى للشراء لتطبيق هذا الكوبون هو ${couponData.minPurchase} ج.م`);
        return;
      }

      let discount = 0;
      if (couponData.discountType === "percentage") {
        const discountPercentage = parseFloat(couponData.discountValue);
        discount = subtotal * (discountPercentage / 100);
      } else {
        discount = parseFloat(couponData.discountValue);
      }

      discount = Math.min(discount, subtotal);

      setDiscountAmount(discount);
      setIsCouponApplied(true);
      setCouponDetails({
        ...couponData,
        id: couponDoc.id
      });
      toast.success(`تم تطبيق الخصم بنجاح! خصم ${discount.toFixed(2)} ج.م`);
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("حدث خطأ أثناء تطبيق الكوبون. يرجى المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountAmount(0);
    setIsCouponApplied(false);
    setCouponCode('');
    setCouponDetails(null);
    toast.info("تم إلغاء كود الخصم");
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (cartItems.length === 0) {
    toast.error("السلة فارغة. لا يمكن تقديم الطلب");
    return;
  }

  setLoading(true);
  try {
    const guestId = getGuestId(); // ✅ نجيب guestId بتاع الزائر

    const orderData = {
      guestId, // ✅ ربط الطلب بالزائر
      customerInfo: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null
      },
      shippingInfo: {
        address: formData.shippingAddress,
        governorate: formData.governorate,
        district: formData.district,
        notes: formData.shippingNotes || null
      },
      billingInfo: {
        address: formData.billingAddressSame ? formData.shippingAddress : formData.billingAddress
      },
      paymentMethod: formData.paymentMethod,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.text, // ✅ خليها text زي ما مستخدم في الـ Cart
        price: item.price,
        quantity: item.quantity,
        img: item.img || null,
        weight: item.weight || null,
        height: item.height || null,
        color: item.color || null,
      })),
      subtotal,
      discount: isCouponApplied ? {
        code: couponCode,
        value: discountAmount,
        couponId: couponDetails?.id
      } : null,
      shippingCost,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // ✅ ننضف البيانات من أي undefined
    const cleanOrderData = JSON.parse(JSON.stringify(orderData));

    const orderRef = await addDoc(collection(db, "orders"), cleanOrderData);

    // ✅ تحديث الكوبون لو مستخدم
    if (isCouponApplied && couponDetails) {
      const couponRef = doc(db, "discounts", couponDetails.id);
      await updateDoc(couponRef, {
        usedCount: (couponDetails.usedCount || 0) + 1,
        lastUsed: new Date().toISOString(),
        lastOrderId: orderRef.id
      });
    }

    // ✅ مسح السلة بتاعة نفس الـ guestId
    const deletePromises = cartItems.map(item =>
      deleteDoc(doc(db, "cart", item.id))
    );
    await Promise.all(deletePromises);

    setCartItems([]);
    toast.success('تم تقديم طلبك بنجاح!');
    setOrderSuccess(true);
  } catch (error) {
    console.error("Order submission error:", error);
    toast.error('حدث خطأ أثناء تقديم الطلب. يرجى المحاولة مرة أخرى');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchCartItems();
  }, []);

  if (loading) return <LoadingScreen />;

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <Container className="my-5 text-center">
        <h4>سلة التسوق فارغة</h4>
        <Button variant="primary" onClick={() => navigate('/')}>العودة للتسوق</Button>
      </Container>
    );
  }

  return (
    <>
      <div className='logo-checkout'>
        <a href='/'><img src={los} alt="Logo" /></a>
      </div>

      <Container className="my-5 checkout-page" style={{ paddingTop: "30px" }}>
        {orderSuccess ? (
          <div className="text-center py-5">
            <h2 className="text-success mb-4">تم تأكيد طلبك!</h2>
            <p>سيتم التواصل معك على رقم الهاتف لتأكيد بيانات الطلب</p>
            <Button variant="primary" onClick={() => navigate('/')}>
              العودة إلى الصفحة الرئيسية
            </Button>
          </div>
        ) : (
          <Row>
          
            <Col md={5}>
              <div style={{ position: 'sticky', top: '100px' }}>
                <Card className="mb-4">
                  <Card.Body>
                    <h4 className="mb-4">ملخص الطلب</h4>

                    {cartItems.map(item => (
                      <Row key={item.id} className="mb-2 align-items-center">
                        <Col xs={3}>
                          <img
                            src={item.img}
                            loading="lazy"
                            alt={item.name}
                            style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "5px" }}
                          />
                        </Col>
                        <Col xs={5}>{item.name}</Col>
                        <Col xs={4} className="text-end">
                          {item.quantity} × {Number(item.price).toFixed(2)} ج.م
                        </Col>
                      </Row>
                    ))}

                    <hr />

                    <Row className="mb-2">
                      <Col xs={6}><strong>المجموع الجزئي:</strong></Col>
                      <Col xs={6} className="text-end">{subtotal.toFixed(2)} ج.م</Col>
                    </Row>

                    {discountAmount > 0 && (
                      <Row className="mb-2">
                        <Col xs={6}><strong>الخصم:</strong></Col>
                        <Col xs={6} className="text-end text-danger">-{discountAmount.toFixed(2)} ج.م</Col>
                      </Row>
                    )}

                    <Row className="mb-2">
                      <Col xs={6}><strong>تكلفة الشحن:</strong></Col>
                      <Col xs={6} className="text-end">{shippingCost.toFixed(2)} ج.م</Col>
                    </Row>

                    <hr />

                    <Row className="mb-2">
                      <Col xs={6}><h5>الإجمالي النهائي:</h5></Col>
                      <Col xs={6} className="text-end"><h5>{total.toFixed(2)} ج.م</h5></Col>
                    </Row>
                  </Card.Body>
                </Card>
              </div>
            </Col>
              <Col md={7}>
              <Card className="mb-4">
                <Card.Body>
                  <h4 className="mb-4">معلومات الاتصال</h4>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder='رقم الهاتف*'
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder='الاسم*'
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder='البريد الالكتروني'
                      />
                    </Form.Group>

                    <h4 className="mb-4 mt-5">معلومات الشحن</h4>

                    <Form.Group className="mb-3">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleInputChange}
                        required
                        placeholder='عنوان الشحن*'
                      />
                    </Form.Group>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>المحافظة *</Form.Label>
                       <Form.Control
                            as="select"
                            name="governorate"
                            value={formData.governorate}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">اختر المحافظة</option>
                            <option value="cairo">القاهرة</option>
                            <option value="giza">الجيزة</option>
                            <option value="alexandria">الإسكندرية</option>
                            <option value="port_said">بورسعيد</option>
                            <option value="suez">السويس</option>
                            <option value="damietta">دمياط</option>
                            <option value="monufia">المنوفية</option>
                            <option value="sharkia">الشرقية</option>
                            <option value="kafr_el_sheikh">كفر الشيخ</option>
                            <option value="gharbia">الغربية</option>
                            <option value="dakahlia">الدقهلية</option>
                            <option value="beheira">البحيرة</option>
                            <option value="matrouh">مطروح</option>
                            <option value="qena">قنا</option>
                            <option value="aswan">أسوان</option>
                            <option value="luxor">الأقصر</option>
                            <option value="asuit">أسيوط</option>
                            <option value="minya">المنيا</option>
                            <option value="bani_suef">بني سويف</option>
                            <option value="fayoum">الفيوم</option>
                            <option value="sohag">سوهاج</option>

                            <option value="ismailia">الإسماعيلية</option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>المنطقة *</Form.Label>
                          <Form.Control
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="shippingNotes"
                        value={formData.shippingNotes}
                        onChange={handleInputChange}
                        placeholder='ملاحظات على الشحن (اختياري)'
                      />
                    </Form.Group>
                    <Form.Check
                      type="checkbox"
                      id="saveInfo"
                      label="حفظ هذه المعلومات للمرة القادمة"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                      className="mb-4"
                    />

                    <h4 className="mb-4 mt-5">معلومات الفاتورة</h4>

                    <Form.Check
                      type="checkbox"
                      id="billingAddressSame"
                      label="نفس عنوان الشحن"
                      name="billingAddressSame"
                      checked={formData.billingAddressSame}
                      onChange={handleInputChange}
                      className="mb-3"
                    />

                    {!formData.billingAddressSame && (
                      <Form.Group className="mb-3">
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="billingAddress"
                          value={formData.billingAddress}
                          onChange={handleInputChange}
                          required={!formData.billingAddressSame}
                          placeholder='عنوان الفاتورة *'
                        />
                      </Form.Group>
                    )}

                    <h4 className="mb-3 mt-5">طريقة الدفع</h4>

                    <div className="radio-group">
                      <label className={`radio-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={handleInputChange}
                        />
                        <span className="radio-label">الدفع عند الاستلام (COD)</span>
                      </label>

               
                    </div>

                    <div className="input-group mb-3">
                      <Form.Control
                        type="text"
                        placeholder="أدخل كود الخصم"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={isCouponApplied || loading}
                      />
                      {isCouponApplied ? (
                        <Button
                          variant="outline-danger"
                          onClick={handleRemoveCoupon}
                          disabled={loading}
                        >
                          إلغاء
                        </Button>
                      ) : (
                        <Button
                          variant="outline-primary"
                          onClick={handleApplyCoupon}
                          disabled={!couponCode.trim() || loading}
                        >
                          {loading ? <Spinner animation="border" size="sm" /> : "تطبيق"}
                        </Button>
                      )}
                    </div>

                    <Button variant="primary" type="submit" className="w-100 mt-4" disabled={loading}>
                      {loading ? <Spinner animation="border" size="sm" /> : "تقديم الطلب"}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default Checkout;