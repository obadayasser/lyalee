import React, { useState, useEffect } from 'react';
import Navs from '../Components/Nav';
import LoadingScreen from './Loading';
import Footer from '../Components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ShippingPolicy = () => {
    const [loading, setLoading] = useState(true);
    
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true, 
    });
  }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <>
            <Navs />
            <div className='recovery'>
                <div className='text'
                              data-aos="fade-up"
              data-aos-easing="ease-out"
              data-aos-duration="700"
              data-aos-once="true"
                >
                    <h1>سياسة الشحن</h1>

                    <h3>
                        في <strong>Layalee Fashion</strong> نضمن توصيل منتجاتنا بأمان وسرعة لجميع عملائنا في أنحاء الجمهورية.
                    </h3>

                    <hr />
                    <h2>تفاصيل الشحن:</h2>
                    <h4>
                        - <strong>مدة التوصيل:</strong> من 2 إلى 5 أيام عمل حسب المدينة.
                        <br />
                        - <strong>تكلفة الشحن:</strong> ثابتة 65ج.م
                        <br />
                        - <strong>شركات التوصيل:</strong> نتعاون مع أفضل شركات الشحن لضمان وصول الطلب بأمان.
                    </h4>

                    <hr />
                    <h2>ملاحظات مهمة:</h2>
                    <h4>
                        - في حال لم يكن العميل متاحًا عند التوصيل، سيتم إعادة جدولة التسليم مرة واحدة فقط.
                        <br />
                        - يجب التأكد من صحة العنوان ورقم الهاتف لتفادي أي تأخير.
                    </h4>

                    <hr />
                    <h2>خدمة التوصيل السريع:</h2>
                    <h4>
                        - متوفرة في بعض المدن فقط 
                        <br />
                        - يُرجى التواصل معنا قبل الطلب لتأكيد توفرها في منطقتك.
                    </h4>

                    <hr />
                    <h3>نحن هنا لخدمتكم دائمًا 🚚</h3>
                    <p>فريق Layalee Fashion يتمنى لكم تجربة توصيل مريحة وآمنة.</p>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default ShippingPolicy;
