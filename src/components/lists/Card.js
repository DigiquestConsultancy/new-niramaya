import React from 'react';
import '../../css/Card.css';

const Card = ({ images, title, description }) => {
    return (
        <div className="card">
            <img src={images} alt="Card" className="card-image" />
            <div className="card-content">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
};

export default Card;
