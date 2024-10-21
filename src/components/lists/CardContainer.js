import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import image1 from '../../images/111.png';
import image2 from '../../images/222.png';
import image3 from '../../images/333.png';
import image4 from '../../images/444.png';
import image5 from '../../images/555.png';
import image6 from '../../images/666.png';
 
const cardsData = [
    {
        images: image1,
        title: 'Instant Video Consultation',
        description: 'Connect within a minute'
    },
    {
        images: image2,
        title: 'Find Doctors Near You',
        description: 'Confirmed Appointment'
    },
    {
        images: image3,
        title: 'Medicines',
        description: 'Get medicines at your doorstep'
    },
    {
        images: image4,
        title: 'Lab Test',
        description: 'Sample pickup at your home'
    },
    {
        images: image5,
        title: 'Surgeries',
        description: 'Safe and trusted surgery centre'
    },
    {
        images: image6,
        title: 'Nutrition/Dietitian',
        description: 'Get guidance on nutrition'
    }
];
 
const containerStyle = {
  background: '#D7EAF0',
  padding: ' 0'
};
 
const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '10px',
  padding: '0px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out, color 0.2s ease-in-out',
  margin: '10px',
  background: '#fff',
  fontFamily: 'sans-serif',
  color: 'black'
};
 
const cardHoverStyle = {
  transform: 'scale(1.05)',
  background: 'rgba(0, 145, 165, 1)',
  color: '#fff'
};
 
const CardContainer = () => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
 
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
 
    // Responsive font styles
    const getTitleStyle = (isHovered) => ({
        fontSize: screenWidth > 1200 ? '1.8rem' : screenWidth > 768 ? '1.5rem' : '1rem',
        marginTop: '10px',
        fontWeight: screenWidth > 768 ? 'normal' : 'normal',
        color: isHovered ? '#fff' : '#000000',
    });
 
    const getDescriptionStyle = (isHovered) => ({
        fontSize: screenWidth > 1200 ? '1.3rem' : screenWidth > 768 ? '1rem' : '0.90rem',
        color: isHovered ? '#fff' : '#000000',
        marginTop: '10px',
    });
 
    return (
        <div style={containerStyle} className="container-fluid p-2">
            <div className="row no-gutters">
                {cardsData.map((card, index) => (
                    <div className="col-lg-4 col-md-6 col-sm-12 p-2" key={index}>
                        <div
                            className="card"
                            style={{
                                ...cardStyle,
                                ...(hoveredCard === index ? cardHoverStyle : {})
                            }}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <img src={card.images} alt={card.title} style={{ maxWidth: '100%', borderRadius: '10px' }} />
                            <div className="card-content">
                                <h3 style={getTitleStyle(hoveredCard === index)}>
                                    {card.title}
                                </h3>
                                <p style={getDescriptionStyle(hoveredCard === index)}>
                                    {card.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
 
export default CardContainer;