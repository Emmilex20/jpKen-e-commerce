// apps/client/src/pages/ShippingReturnsPage.jsx
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Meta from '../components/Meta';

const ShippingReturnsPage = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Meta
        title="Shipping & Returns | JP Ken Parfait & Yogurt"
        description="Learn about JP Ken's delivery areas, shipping times, fees, and our policy on returns for fresh parfait and yogurt orders in Lagos, Nigeria."
      />

      <Container className="py-5 policy-page-container"> {/* Reusing policy-page-container for consistent styling */}
        <Row className="text-center mb-5">
          <Col>
            <h1 className="policy-heading mb-3">Shipping & Returns Policy</h1>
            <p className="lead policy-subheading">
              Delivering Freshness to Your Doorstep, With Care.
            </p>
            <p className="policy-text-intro">
              <strong>Last Updated: June 16, {currentYear}</strong>
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={10} lg={9}>
            <Card className="policy-card p-4 p-md-5 mb-5"> {/* Added mb-5 for space below card */}
              <Card.Body>
                <h2 className="policy-section-title mb-3">1. Shipping Policy</h2>
                <p className="policy-text">
                  At JP Ken, we are committed to delivering your fresh parfaits and yogurts promptly and in perfect condition. Please review our shipping policy below.
                </p>

                <h3 className="policy-subsection-title mt-4 mb-2">1.1 Delivery Areas</h3>
                <p className="policy-text">
                  We currently offer delivery services within **Lekki, Lagos, and select surrounding areas**. During checkout, you can enter your delivery address to confirm if your location falls within our service area. For inquiries about delivery to areas outside our standard zones, please <Link to="/contact-us" className="policy-link">contact us</Link> directly.
                </p>

                <h3 className="policy-subsection-title mt-4 mb-2">1.2 Delivery Times & Days</h3>
                <ul className="policy-list">
                  <li><strong>Standard Delivery:</strong> Orders placed before our daily cut-off time (see below) are typically delivered within **2-4 hours** on the same day.</li>
                  <li><strong>Delivery Days:</strong> We deliver Monday to Saturday, from 8:00 AM to 6:00 PM. We do not currently offer deliveries on Sundays or public holidays.</li>
                  <li><strong>Pre-Orders:</strong> You can place orders up to 48 hours in advance for scheduled delivery.</li>
                </ul>

                <h3 className="policy-subsection-title mt-4 mb-2">1.3 Order Cut-off Times</h3>
                <p className="policy-text">
                  To ensure same-day delivery, please place your order by:
                </p>
                <ul className="policy-list">
                  <li>**Monday - Friday:** 3:00 PM (WAT)</li>
                  <li>**Saturday:** 1:00 PM (WAT)</li>
                </ul>
                <p className="policy-text">
                  Orders placed after the cut-off time will be processed for delivery on the next business day.
                </p>

                <h3 className="policy-subsection-title mt-4 mb-2">1.4 Delivery Fees</h3>
                <p className="policy-text">
                  Delivery fees are calculated based on your delivery address within our service area. The exact fee will be displayed at checkout before you finalize your order. From time to time, we may offer promotions for free delivery on orders exceeding a certain value.
                </p>

                <h3 className="policy-subsection-title mt-4 mb-2">1.5 Delivery Process & Packaging</h3>
                <p className="policy-text">
                  Your fresh parfaits and yogurts are carefully prepared and packaged in insulated containers with ice packs (where necessary) to maintain optimal freshness and temperature during transit. Our delivery personnel will contact you upon arrival. We encourage contactless delivery whenever possible.
                </p>

                <h3 className="policy-subsection-title mt-4 mb-2">1.6 Missed Deliveries</h3>
                <p className="policy-text">
                  If you are unavailable to receive your order at the time of delivery, our driver will attempt to contact you. We allow a waiting period of up to 10 minutes. If contact cannot be made or the delivery is unsuccessful, the order may be returned to our facility. Re-delivery attempts may incur an additional delivery fee. Due to the perishable nature of our products, we cannot guarantee the freshness of items that have undergone multiple delivery attempts or significant delays.
                </p>
              </Card.Body>
            </Card>

            <Card className="policy-card p-4 p-md-5">
              <Card.Body>
                <h2 className="policy-section-title mb-3">2. Returns & Refunds Policy</h2>
                <p className="policy-text">
                  Due to the perishable nature of our products (parfaits and yogurts) and for hygiene reasons, **we generally do not accept returns or offer refunds for change of mind.**
                </p>
                <p className="policy-text">
                  Your satisfaction is incredibly important to us. If you encounter any issues with your order, please notify us immediately.
                </p>

                <h3 className="policy-subsection-title mt-4 mb-2">2.1 Exceptions for Refunds/Replacements</h3>
                <p className="policy-text">
                  We will gladly offer a refund or replacement in the following circumstances:
                </p>
                <ul className="policy-list">
                  <li><strong>Damaged or Spoiled Upon Arrival:</strong> If your products arrive damaged, spoiled, or are not in satisfactory condition.</li>
                  <li><strong>Incorrect Order:</strong> If you receive products different from what you ordered.</li>
                </ul>

                <h3 className="policy-subsection-title mt-4 mb-2">2.2 Reporting an Issue</h3>
                <p className="policy-text">
                  To report a problem with your order, you must contact us within **2 hours of delivery**. Please provide:
                </p>
                <ul className="policy-list">
                  <li>Your Order Number.</li>
                  <li>A clear description of the issue.</li>
                  <li>Photographs of the damaged or incorrect item(s) (this is crucial for perishable goods).</li>
                </ul>
                <p className="policy-text">
                  You can reach our customer support team via:
                </p>
                <ul className="policy-list">
                  <li>Email: <a href="mailto:support@jpken.com" className="policy-link">support@jpken.com</a></li>
                  <li>Phone: +234 (80) 1234-5678</li>
                  <li>Our <Link to="/contact-us" className="policy-link">Contact Us Page</Link></li>
                </ul>

                <h3 className="policy-subsection-title mt-4 mb-2">2.3 Refund and Replacement Process</h3>
                <p className="policy-text">
                  Once your claim is received and inspected, we will notify you of the approval or rejection of your refund/replacement.
                </p>
                <ul className="policy-list">
                  <li>If approved, a replacement will be sent out with the next available delivery slot, or a refund will be processed to your original method of payment within 3-5 business days.</li>
                  <li>JP Ken reserves the right to refuse a refund or replacement if the issue is not reported within the specified timeframe or if sufficient evidence is not provided.</li>
                </ul>

                <h2 className="policy-section-title mt-5 mb-3">3. Contact Us</h2>
                <p className="policy-text">
                  For any questions or concerns regarding our shipping and returns policy, please do not hesitate to contact our customer service team. Your satisfaction is our priority.
                </p>
                <ul className="policy-list">
                  <li>Email: <a href="mailto:info@jpken.com" className="policy-link">info@jpken.com</a></li>
                  <li>Phone: <a href="tel:+2348012345678" className="policy-link">+234 (80) 1234-5678</a></li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ShippingReturnsPage;