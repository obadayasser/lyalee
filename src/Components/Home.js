import React, { useEffect } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom'
import ss from '../Assets/1746837062044.png'
const slides = [
  {
    image: ss,
    title: 'مرحبًا بك في متجرنا',
    text: 'اكتشف أفضل المنتجات بأفضل الأسعار',
    button: 'تسوق الآن',
    link: '#products'
  },
  {
    image: '/images/banner2.jpg',
    title: 'عروض الصيف',
    text: 'خصومات تصل إلى 50% على جميع المنتجات',
    button: 'تصفح العروض',
    link: '#products'
  },
  {
    image: '/images/banner3.jpg',
    title: 'منتجات جديدة',
    text: 'تشكيلة مميزة وصلت حديثًا',
    button: 'ابدأ التسوق',
    link: '#products'
  }
];

function HeroSlider() {
  const navigate = useNavigate();

  // التمرير إلى المنتجات عند تحميل الصفحة
  useEffect(() => {
    const section = document.querySelector('#products');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false
  };

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} style={{ position: 'relative', height: '90vh' }}>
            <img
              src={slide.image}
              alt={slide.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              top: '40%',
              left: '10%',
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: '20px',
              borderRadius: '10px',
              maxWidth: '40%'
            }}>
              <h1 style={{ fontSize: '2.5rem' }}>{slide.title}</h1>
              <p>{slide.text}</p>
              <a href={slide.link}>
                <button style={{
                  marginTop: '10px',
                  padding: '10px 20px',
                  fontSize: '1rem',
                  backgroundColor: '#ff6600',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}>
                  {slide.button}
                </button>
              </a>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default HeroSlider;
