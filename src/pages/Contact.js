import React, { useEffect, useState } from 'react'
import Nav from '../Components/Nav'
import Footer from '../Components/Footer'
import { Button, Container } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { db } from '../FireBase/Firebase'
import { collection, addDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import LoadingScreen from './Loading';
import AOS from 'aos';
import 'aos/dist/aos.css'
const Contact = () => {
    const [loading, setLoading] = useState(true);
   
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    })

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true, 
    });
  }, []);
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await addDoc(collection(db, "messages"), formData)
            toast.success('تم إرسال الرسالة بنجاح!')
            setFormData({ name: '', email: '', message: '' })
        } catch (error) {
            console.error("Error sending message: ", error)
            toast.error('حدث خطأ أثناء الإرسال')
        }
    }
     useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <LoadingScreen/>
    }

    return (
        <>
            <Nav />
            <div>
                <Container className='contact'>
                    <div className='left'
                                  data-aos="fade-in"
              data-aos-easing="ease-out"
              data-aos-duration="700"
              data-aos-once="true"
                    >
                        <div>
                            <a href="tel:+201093518834" style={{ color: "inherit", textDecoration: "none" }}>
                                <i className="fa-solid fa-phone" style={{ transform: 'scaleX(-1)', marginLeft: '8px' }}></i> <span>اتصل بنا:</span>
                            </a>
                            <p>نحن متاحون على مدار 24 ساعة طوال أيام الأسبوع.</p>
                        </div>
                        <div>
                            <h5>نحن هنا لخدمتك:</h5>
                            <a href="tel:+201093518834" style={{ color: "inherit", textDecoration: "none" }}>
                                +20-1093518834
                            </a>
                        </div>
                        <div>
                            <i className="fa-solid fa-envelope"></i><span>أرسل لنا رسالة:</span>
                            <p>اركنا التفاصيل وسنكون على تواصل معك خلال أقل من 24 ساعة!</p>
                        </div>
                        <div>
                            <h5>فريق الدعم:</h5>
                            <a href="mailto:obadayasser@gmail.com" style={{ color: "inherit", textDecoration: "none" }}>
                                obadayasser@gmail.com
                            </a>
                        </div>
                    </div>

                    <div className='right'>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formName">
                                <Form.Label>الاسم*</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="أدخل اسمك"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label>البريد الإلكتروني*</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@email.com"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formMessage">
                                <Form.Label>اترك لنا رسالة أو تعليق*</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={7}
                                    name="message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="اكتب رسالتك هنا..."
                                />
                            </Form.Group>

                            <Button variant='none' type="submit">إرسال</Button>
                        </Form>
                    </div>
                </Container>
            </div>
            <Footer />
        </>
    )
}

export default Contact
