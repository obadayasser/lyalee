import React, { useState, useEffect } from 'react';
import Navs from '../Components/Nav';
import LoadingScreen from './Loading';
import Footer from '../Components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
const Recovery = () => {
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, []);
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true, 
    });
  }, []);
    if (loading) {
        return <LoadingScreen/>
    }

    return (
        <>
            <Navs />
            <div className='recovery'>
                <div className='text'
                              data-aos="fade-in"
              data-aos-easing="ease-out"
              data-aos-duration="700"
              data-aos-once="true"
                >
                    <h1>سياسة الاستبدال والإرجاع</h1>

                    <h3>
                        نحرص في <strong>Layalee Fashion</strong> على رضا عملائنا وتقديم أفضل تجربة تسوق ممكنة...
                    </h3>

                    <hr />
                    <h2>شروط الاسترجاع:</h2>
                    <h4>
                        - <strong>الحق في المعاينة:</strong> يحق للعميل معاينة المنتج...
                        <br />
                        - <strong>رفض الطلب:</strong> ...
                        <br />
                        - <strong>استرجاع المنتج:</strong> ...
                        <br />
                        - يتحمل العميل تكلفة الشحن...
                    </h4>

                    <hr />
                    <strong>ملاحظة مهمة:</strong><br />
                    <h4>
                        بعد مغادرة مندوب التوصيل، لا يمكن الاسترجاع ...
                    </h4>

                    <hr />
                    <h2>حالات لا يُقبل فيها الاسترجاع:</h2>
                    <h4>
                        - إذا تم استخدام المنتج...
                        <br />
                        - إذا انتهت المهلة...
                    </h4>

                    <hr />
                    <h3>نحن دائمًا هنا لخدمتكم 💖</h3>
                    <p>فريق Layalee Fashion يتمنى لكم تجربة رائعة.</p>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default Recovery;

