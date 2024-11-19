
// import { load } from "@cashfreepayments/cashfree-js";

// function Checkout() {
//     let cashfree;
//     var initializeSDK = async function () {
//         cashfree = await load({
//             mode: "production"
//         });
//     }
//     initializeSDK();

//     const doPayment = async () => {
//         let checkoutOptions = {
//             paymentSessionId: "your-payment-session-id",
//             redirectTarget: "_self",
//         };
//         cashfree.checkout(checkoutOptions);
//     };

//     return (
//         <div class="row">
//             <p>Click below to open the checkout page in current tab</p>
//             <button type="submit" class="btn btn-primary" id="renderBtn" onClick={doPayment}>
//                 Pay Now
//             </button>
//         </div>
//     );
// }
// export default Checkout;






// // Checkout.js
// import React, { useState } from 'react';
// import { load } from '@cashfreepayments/cashfree-js';

// function Checkout() {
//     const [cashfree, setCashfree] = useState(null);
//     const [formData, setFormData] = useState({
//         amount: '',
//         currency: 'INR',
//         customer_name: '',
//         customer_phone: '',
//     });

//     // Initialize Cashfree SDK once
//     const initializeSDK = async () => {
//         if (!cashfree) {
//             const cf = await load({ mode: 'production' });
//             setCashfree(cf);
//         }
//     };

//     // Call initializeSDK when the component mounts
//     React.useEffect(() => {
//         initializeSDK();
//     }, []);

//     // Handle input changes
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     // Handle form submission to initiate payment
//     const handlePayment = async (e) => {
//         e.preventDefault();

//         try {
//             // Make POST request to backend to create a payment session
//             const response = await fetch('http://192.168.29.95:8000/payment/create/', {
//                 method: 'POST',
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData),
//             });

//             const data = await response.json();

//             if (data.paymentSessionId) {
//                 // Call Cashfree checkout with received session ID
//                 const checkoutOptions = {
//                     paymentSessionId: data.paymentSessionId,
//                     redirectTarget: '_self',
//                 };

//                 // Trigger Cashfree checkout
//                 cashfree.checkout(checkoutOptions).catch(error => {
//                     console.error('Payment error:', error);
//                 });
//             } else {
//                 console.error('Failed to retrieve payment session ID:', data);
//             }
//         } catch (error) {
//             console.error('Error initiating payment:', error);
//         }
//     };

//     const doPayment = async () => {
//         let checkoutOptions = {
//             paymentSessionId: "session_sN0-aLjhxFSTq9jeb2KNLNQ1k7yy_xXe4hyTp9WqKfI9w7bzYgKDgyAMXE57Z-toHfCwPIbq7c_YeoVKR8KTeJuEihkLD7JYowJniquQd4kA",
//             redirectTarget: "_self",
//         };
//         cashfree.checkout(checkoutOptions);
//     };

//     return (
//         <div className="container">
//             <h2>Make a Payment</h2>
//             <form onSubmit={handlePayment}>
//                 <div className="form-group">
//                     <label>Amount</label>
//                     <input
//                         type="number"
//                         className="form-control"
//                         name="amount"
//                         value={formData.amount}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>Currency</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         name="currency"
//                         value={formData.currency}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>Customer Name</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         name="customer_name"
//                         value={formData.customer_name}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>Customer Phone</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         name="customer_phone"
//                         value={formData.customer_phone}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <button type="submit" className="btn btn-primary" onClick={doPayment}>
//                     Pay Now
//                 </button>
//             </form>
//         </div>
//     );
// }

// export default Checkout;







// Checkout.js
import React, { useState } from 'react';
import { load } from '@cashfreepayments/cashfree-js';
import { Spinner, Form, InputGroup, Button } from 'react-bootstrap';
import { FiUser, FiPhone, FiDollarSign, FiCreditCard } from 'react-icons/fi';
import '../../css/Checkout.css';

function Checkout() {
    const [cashfree, setCashfree] = useState(null);
    const [formData, setFormData] = useState({
        amount: '100',
        currency: 'INR',
        customer_name: '',
        customer_phone: '',
    });
    const [loading, setLoading] = useState(false);

    // Initialize Cashfree SDK once
    const initializeSDK = async () => {
        if (!cashfree) {
            const cf = await load({ mode: 'production' });
            setCashfree(cf);
        }
    };

    // Call initializeSDK when the component mounts
    React.useEffect(() => {
        initializeSDK();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission to initiate payment
    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Make POST request to backend to create a payment session
            const response = await fetch('http://192.168.29.95:8000/payment/create/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.paymentSessionId) {
                // Call Cashfree checkout with received session ID
                const checkoutOptions = {
                    //   paymentSessionId: data.paymentSessionId,
                    paymentSessionId: 'session_JyPOs78nbwbBd_I1tSJ--9T50DPimv38w8BUBnsLnM6LUu3Xg42q9FjgREtsEyeC4Ihh0ZECD4TFzhHEa0TkgQkl1UiLHhn5zpuakcMMDzug',
                    redirectTarget: '_self',
                };

                // Trigger Cashfree checkout
                cashfree.checkout(checkoutOptions).catch((error) => {
                    console.error('Payment error:', error);
                });
            } else {
                console.error('Failed to retrieve payment session ID:', data);
            }
        } catch (error) {
            console.error('Error initiating payment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <h2 className="checkout-title">Secure Payment</h2>
            <p className="checkout-description">
                Enter your details to complete the payment.
            </p>
            <Form onSubmit={handlePayment} className="checkout-form">
                <Form.Group className="form-group">
                    <Form.Label>Amount</Form.Label>
                    <InputGroup>
                        <InputGroup.Text><FiDollarSign /></InputGroup.Text>
                        <Form.Control
                            type="number"
                            placeholder="Enter amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                </Form.Group>

                <Form.Group className="form-group">
                    <Form.Label>Currency</Form.Label>
                    <InputGroup>
                        <InputGroup.Text><FiCreditCard /></InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Currency (e.g., INR)"
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                </Form.Group>

                <Form.Group className="form-group">
                    <Form.Label>Customer Name</Form.Label>
                    <InputGroup>
                        <InputGroup.Text><FiUser /></InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Enter your name"
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                </Form.Group>

                <Form.Group className="form-group">
                    <Form.Label>Customer Phone</Form.Label>
                    <InputGroup>
                        <InputGroup.Text><FiPhone /></InputGroup.Text>
                        <Form.Control
                            type="tel"
                            placeholder="Enter your phone number"
                            name="customer_phone"
                            value={formData.customer_phone}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                </Form.Group>

                <Button
                    type="submit"
                    className="pay-button"
                    disabled={loading}
                    style={{
                        backgroundColor: '#5A67D8',
                        borderColor: '#5A67D8',
                        fontWeight: 'bold',
                        width: '100%',
                        padding: '12px',
                    }}
                >
                    {loading ? <Spinner animation="border" size="sm" /> : 'Proceed to Pay'}
                </Button>
            </Form>
        </div>
    );
}

export default Checkout;
