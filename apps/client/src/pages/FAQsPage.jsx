// apps/client/src/pages/FAQsPage.jsx
import React from 'react';
import { Container, Row, Col, Card, Accordion } from 'react-bootstrap'; // Import Accordion
import { Link } from 'react-router-dom';
import Meta from '../components/Meta';

const FAQsPage = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Meta
        title="FAQs | JP Ken Parfait & Yogurt"
        description="Find answers to frequently asked questions about JP Ken's parfait and yogurt products, ordering, delivery, and more."
      />

      <Container className="py-5 policy-page-container"> {/* Reusing policy-page-container for consistent styling */}
        <Row className="text-center mb-5">
          <Col>
            <h1 className="policy-heading mb-3">Frequently Asked Questions (FAQs)</h1>
            <p className="lead policy-subheading">
              Have questions? We've got answers! Find common queries about JP Ken here.
            </p>
            <p className="policy-text-intro">
              <strong>Last Updated: June 16, {currentYear}</strong>
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={10} lg={9}>
            <Card className="policy-card p-4 p-md-5">
              <Card.Body>
                {/* General Questions */}
                <h2 className="faq-category-title mb-4">General Questions</h2>
                <Accordion defaultActiveKey="0" className="faq-accordion"> {/* defaultActiveKey for initially open item */}
                  <Accordion.Item eventKey="0">
                    <Accordion.Header className="faq-header">What is JP Ken Parfait & Yogurt?</Accordion.Header>
                    <Accordion.Body className="faq-body">
                      JP Ken is your go-to online shop for freshly made, healthy, and delicious parfaits and yogurts in Lekki, Lagos. We pride ourselves on using high-quality, natural ingredients to create wholesome treats perfect for any time of day.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header className="faq-header">What are your operating hours?</Accordion.Header>
                    <Accordion.Body className="faq-body">
                      Our website is open 24/7 for orders! For deliveries, we operate from Monday to Saturday, 8:00 AM to 6:00 PM. Our customer service is available during these hours as well.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header className="faq-header">Do you have a physical store?</Accordion.Header>
                    <Accordion.Body className="faq-body">
                      Currently, JP Ken operates exclusively as an online store. We focus on direct delivery to ensure the freshest products reach your doorstep without the overheads of a physical location.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="3">
                    <Accordion.Header className="faq-header">How can I contact customer service?</Accordion.Header>
                    <Accordion.Body className="faq-body">
                      You can reach our friendly customer service team via:
                      <ul className="policy-list">
                        <li>Email: <a href="mailto:info@jpken.com" className="policy-link">info@jpken.com</a></li>
                        <li>Phone: <a href="tel:+2348012345678" className="policy-link">+234 (80) 1234-5678</a></li>
                        <li>Or visit our dedicated <Link to="/contact-us" className="policy-link">Contact Us Page</Link>.</li>
                      </ul>
                      We aim to respond to all inquiries within 24 hours during business days.
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                {/* Ordering & Delivery Questions */}
                <h2 className="faq-category-title mt-5 mb-4">Ordering & Delivery</h2>
                <Accordion className="faq-accordion">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header className="faq-header">How do I place an order?</Accordion.Header>
                    <Accordion.Body className="faq-body">
                      Simply browse our "Our Menu" section, add your desired parfaits and yogurts to your cart, and proceed to checkout. Follow the easy steps to enter your delivery details and payment information.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header className="faq-header">What areas do you deliver to?</Accordion.Header>
                    <Accordion.Body className="faq-body">
                      We primarily deliver within Lekki, Lagos, and surrounding areas. During checkout, you can verify if your address is within our delivery zone. For more details, please refer to our <Link to="/shipping-returns" className="policy-link">Shipping & Returns Policy</Link>.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header className="faq-header">What are your delivery times?</Accordion.Header>
                    <Accordion.Body className="faq-body">
                      Standard delivery typically occurs within 2-4 hours for orders placed before our daily cut-off times. We deliver Monday to Saturday, 8:00 AM - 6:00 PM. Specific cut-off times and detailed information can be found on our <Link to="/shipping-returns" className="policy-link">Shipping & Returns Policy</Link> page.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="3">
                    <Accordion.Header className="faq-header">Is there a minimum order for delivery?</Accordion.Header>
                    <Accordion.Body className="faq-body">
                      Currently, there is no minimum order value for delivery, but delivery fees apply based on your location.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="4">
                    <Accordion.Header className="faq-header">Can I schedule a delivery for a specific time or date?</Accordion.Header>
                    <Accordion.Body className="faq-body">
                      Yes, you can! During the checkout process, you'll have the option to select a preferred delivery date and time slot for pre-orders up to 48 hours in advance.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="5">
                    <Accordion.Header className="faq-header">What if I miss my delivery?</Accordion.Header>
                    <Accordion.Body className="faq-body">
                      Our driver will attempt to contact you. We allow a brief waiting period. If delivery is unsuccessful, the order may be returned, and a re-delivery fee might apply. Please see our <Link to="/shipping-returns" className="policy-link">Shipping & Returns Policy</Link> for full details on missed deliveries.
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                {/* Products & Ingredients Questions */}
                <h2 className="faq-category-title mt-5 mb-4">Products & Ingredients</h2>
                <Accordion className="faq-accordion">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header className="faq-header">What types of parfaits and yogurts do you offer?</Accordion.Header>
                    <Accordion.Body className="faq-body">
                      We offer a diverse range, including classic fruit parfaits, granola and nut-based parfaits, and pure creamy yogurts with various topping options. Our menu regularly features seasonal specials to keep things exciting!
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header className="faq-header">Are your ingredients fresh and locally sourced?</Accordion.Header>
                    <Accordion.Body className="faq-body">
                      Absolutely! We are deeply committed to freshness. We prioritize sourcing the finest, freshest fruits and dairy from trusted local suppliers in Nigeria whenever possible, ensuring the highest quality in every product.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header className="faq-header">Do you offer vegan, gluten-free, or dairy-free options?</Accordion.Header>
                    <Accordion.Body className="faq-body">
                      We are continually expanding our menu to cater to various dietary needs. Please check our "Our Menu" page for specific offerings. If you have particular dietary requirements, feel free to <Link to="/contact-us" className="policy-link">contact us</Link> to inquire about custom orders or special preparations.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="3">
                    <Accordion.Header className="faq-header">How long do the parfaits/yogurts stay fresh?</Accordion.Header>
                    <Accordion.Body className="faq-body">
                      Our products are made fresh daily. For best quality and taste, we recommend consuming them within 24-48 hours of delivery, provided they are kept refrigerated at all times.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="4">
                    <Accordion.Header className="faq-header">How should I store my order?</Accordion.Header>
                    <Accordion.Body className="faq-body">
                      Please store all parfaits and yogurts immediately in the refrigerator (at or below 4°C / 40°F). Do not leave them at room temperature for extended periods.
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                {/* Account & Payments Questions */}
                <h2 className="faq-category-title mt-5 mb-4">Account & Payments</h2>
                <Accordion className="faq-accordion">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header className="faq-header">How do I create an account?</Accordion.Header>
                    <Accordion.Body className="faq-body">
                      You can create an account by clicking on the "Sign In" or "Register" link in the header. Creating an account allows for faster checkout, order tracking, and access to your order history.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header className="faq-header">What payment methods do you accept?</Accordion.Header>
                    <Accordion.Body className="faq-body">
                      We accept major credit/debit cards (Visa, MasterCard, Verve) through our secure online payment gateways (e.g., Paystack, Flutterwave). Cash on delivery options might be available for specific delivery zones.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header className="faq-header">Is my payment information secure?</Accordion.Header>
                    <Accordion.Body className="faq-body">
                      Yes, absolutely. All online payments are processed through highly secure and encrypted third-party payment gateways. We do not store your full payment card details on our servers. Your security is our priority.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="3">
                    <Accordion.Header className="faq-header">How do I reset my password?</Accordion.Header>
                    <Accordion.Body className="faq-body">
                      If you've forgotten your password, click on the "Forgot Password" link on the login page. You'll be prompted to enter your email address, and instructions to reset your password will be sent to you.
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default FAQsPage;