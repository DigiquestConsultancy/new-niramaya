import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import BaseUrl from "../../api/BaseUrl";
import { load } from "@cashfreepayments/cashfree-js";
 
const PaymentModal = ({ show, onHide, onSuccess, patientId }) => {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [paymentSessionId, setPaymentSessionId] = useState(null);
    let cashfree;
 
    // Initialize Cashfree SDK
    useEffect(() => {
        const initializeSDK = async () => {
            cashfree = await load({ mode: "sandbox" });
        };
        initializeSDK();
    }, []);
 
    const handlePayment = async () => {
        const paymentData = {
            amount,
            currency,
            customer_name: customerName,
            customer_phone: customerPhone,
        };
 
        try {
            // Send payment data to backend to get the payment session ID
            const paymentResponse = await BaseUrl.post("/payment/create/", paymentData);
            if (paymentResponse.data && paymentResponse.data.payment_session_id) {
                console.log("Received payment session ID:", paymentResponse.data.payment_session_id);
                setPaymentSessionId(paymentResponse.data.payment_session_id);
               
                // Trigger Cashfree UPI payment with the session ID
                doPayment(paymentResponse.data.payment_session_id);
            } else {
                console.error("Failed to retrieve payment session ID.");
            }
        } catch (error) {
            console.error("Payment initiation failed:", error);
        }
    };
 
    const doPayment = async (sessionId) => {
        const checkoutOptions = {
            paymentSessionId: sessionId,
            redirectTarget: "_self",  // Open in the same tab
        };
 
        try {
            if (!cashfree) {
                cashfree = await load({ mode: "sandbox" });
            }
            await cashfree.checkout(checkoutOptions);
            console.log("Redirected to Cashfree for payment.");
        } catch (error) {
            console.error("Cashfree checkout failed:", error);
        }
    };
 
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Complete Payment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Currency</Form.Label>
                        <Form.Control as="select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                            <option value="INR">INR</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Customer Name</Form.Label>
                        <Form.Control type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Customer Phone</Form.Label>
                        <Form.Control type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancel</Button>
                <Button variant="primary" onClick={handlePayment}>Pay Now</Button>
            </Modal.Footer>
        </Modal>
    );
};
 
export default PaymentModal;