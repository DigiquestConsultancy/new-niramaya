// import React from 'react';
// import Card from './Card';
// import '../../css/CardContainer.css';
// import image1 from '../../images/videoconsult.jpg';
// import image2 from '../../images/finddoctors.jpg';
// import image3 from '../../images/medicines.jpg';
// import image4 from '../../images/labtest.jpg';
// import image5 from '../../images/surgery.jpg';
// import image6 from '../../images/nutrition.jpg';

// const cardsData = [
//     {
//         images: image1,
//         title: 'Instant Video Consultation',
//         description: 'Connect within a minute'
//     },
//     {
//         images: image2,
//         title: 'Find Doctors Near You',
//         description: 'Confirmed Appointment'
//     },
//     {
//         images: image3,
//         title: 'Medicines',
//         description: 'Get medicines at your doorstep'
//     },
//     {
//         images: image4,
//         title: 'Lab Test',
//         description: 'Sample pickup at your home'
//     },
//     {
//         images: image5,
//         title: 'Surgeries',
//         description: 'Safe and trusted surgery centre'
//     },
//     {
//         images: image6,
//         title: 'Nutrition/Dietitian',
//         description: 'Get guidance on nutrition'
//     }
// ];

// const CardContainer = () => {
//     return (
//         <div className="card-container">
//             {cardsData.map((card, index) => (
//                 <Card 
//                     key={index} 
//                     images={card.images} 
//                     title={card.title} 
//                     description={card.description} 
//                 />
//             ))}
//         </div>
//     );
// };

// export default CardContainer;


import React from 'react';
import Card from './Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/CardContainer.css';
import image1 from '../../images/videoconsult.jpg';
import image2 from '../../images/finddoctors.jpg';
import image3 from '../../images/medicines.jpg';
import image4 from '../../images/labtest.jpg';
import image5 from '../../images/surgery.jpg';
import image6 from '../../images/nutrition.jpg';
 
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
 
const CardContainer = () => {
    return (
        <div className="container-fluid p-2">
            <div className="row no-gutters">
                {cardsData.map((card, index) => (
                    <div className="col-lg-4 col-md-6 col-sm-12 p-2" key={index}>
                        <Card
                            images={card.images}
                            title={card.title}
                            description={card.description}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
 
export default CardContainer;