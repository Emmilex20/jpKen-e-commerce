// apps/client/src/pages/ContactUsPage.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react'; // useEffect is kept for other potential uses, but the redirect-check is removed
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from 'react-icons/fa';
import { Link } from 'react-router-dom'; // useLocation and useNavigate are no longer needed for this specific feature
import Meta from '../components/Meta';
import { toast } from 'react-toastify';

const ContactUsPage = () => {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Removed: useLocation and useNavigate hooks are no longer needed for AJAX submission
  // Removed: useEffect hook for checking URL parameters is no longer needed for AJAX submission

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ⭐ NEW/MODIFIED: handleSubmit function for AJAX submission ⭐
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission (page reload)

    // Formspree endpoint URL
    const formspreeEndpoint = "https://formspree.io/f/xjkrrqvg"; // ⭐ Your Formspree Endpoint URL ⭐

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Send as JSON for easier handling
          'Accept': 'application/json' // Request JSON response
        },
        body: JSON.stringify(formData), // Convert state data to JSON string
      });

      if (response.ok) { // Check if the response status is 200-299 (success)
        toast.success('Thank you for your message! We will get back to you soon.');
        // Clear the form fields after successful submission
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        // Handle errors from Formspree (e.g., invalid email, rate limiting)
        const data = await response.json(); // Try to parse error message from response
        const errorMessage = data.errors ? data.errors.map(err => err.message).join(', ') : 'Something went wrong. Please try again.';
        toast.error(`Submission failed: ${errorMessage}`);
        console.error('Formspree submission error:', data);
      }
    } catch (error) {
      // Handle network errors
      toast.error('Network error. Please check your internet connection and try again.');
      console.error('Fetch error:', error);
    }
  };

  return (
    <>
      <Meta
        title="Contact Us | JP Ken Parfait & Yogurt"
        description="Get in touch with JP Ken for questions, feedback, or custom orders. Reach us by phone, email, or our online contact form."
      />

      <Container className="py-5 policy-page-container">
        <Row className="text-center mb-5">
          <Col>
            <h1 className="policy-heading mb-3">Contact JP Ken</h1>
            <p className="lead policy-subheading">
              We'd love to hear from you! Your feedback and inquiries are important to us.
            </p>
            <p className="policy-text-intro">
              <strong>Last Updated: June 16, {currentYear}</strong>
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={10} lg={9}>
            <Card className="policy-card p-4 p-md-5 mb-5">
              <Card.Body>
                <h2 className="policy-section-title mb-4">Send Us a Message</h2>
                <p className="policy-text mb-4">
                  Have a question about our parfaits, a special request, or just want to share your feedback? Fill out the form below, and our team will get back to you as soon as possible.
                </p>

                {/* Form now uses onSubmit for AJAX handling */}
                <Form
                  // action and method are removed for AJAX submission
                  onSubmit={handleSubmit} // ⭐ Added onSubmit handler ⭐
                  className="contact-form"
                >
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="formName" className="mb-3">
                        <Form.Label>Your Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="contact-form-control"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="formEmail" className="mb-3">
                        <Form.Label>Your Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="contact-form-control"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group controlId="formSubject" className="mb-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      placeholder="Subject of your message"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="contact-form-control"
                    />
                  </Form.Group>
                  <Form.Group controlId="formMessage" className="mb-4">
                    <Form.Label>Your Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="message"
                      rows={5}
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="contact-form-control"
                    />
                  </Form.Group>

                  {/* Removed: _next hidden field is no longer needed for redirection */}
                  {/* Optional: Hidden field for auto-response email to sender (still works with AJAX) */}
                  <input
                    type="hidden"
                    name="_autoresponse"
                    value="Thank you for your message! We've received it and will get back to you shortly."
                  />

                  <Button type="submit" variant="primary" className="contact-submit-btn">
                    Send Message
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <Card className="policy-card p-4 p-md-5 mb-5">
              <Card.Body>
                <h2 className="policy-section-title mb-4">Other Ways to Reach Us</h2>
                <Row className="gy-4">
                  <Col md={6}>
                    <div className="contact-info-item d-flex align-items-center">
                      <FaPhone className="contact-icon me-3" />
                      <div>
                        <h4 className="mb-1">Phone</h4>
                        <p className="mb-0">
                          <a href="tel:+2348012345678" className="policy-link">
                            +234 (80) 1234-5678
                          </a>
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="contact-info-item d-flex align-items-center">
                      <FaWhatsapp className="contact-icon me-3" />
                      <div>
                        <h4 className="mb-1">WhatsApp</h4>
                        <p className="mb-0">
                          <a
                            href="https://wa.me/2348012345678"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="policy-link"
                          >
                            +234 (80) 1234-5678
                          </a>
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="contact-info-item d-flex align-items-center">
                      <FaEnvelope className="contact-icon me-3" />
                      <div>
                        <h4 className="mb-1">Email</h4>
                        <p className="mb-0">
                          <a href="mailto:info@jpken.com" className="policy-link">
                            info@jpken.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="contact-info-item d-flex align-items-center">
                      <FaClock className="contact-icon me-3" />
                      <div>
                        <h4 className="mb-1">Operating Hours</h4>
                        <p className="mb-0">Mon - Sat: 8:00 AM - 6:00 PM (WAT)</p>
                        <p className="mb-0">Closed on Sundays & Public Holidays</p>
                      </div>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="contact-info-item d-flex align-items-center">
                      <FaMapMarkerAlt className="contact-icon me-3" />
                      <div>
                        <h4 className="mb-1">Address</h4>
                        <p className="mb-0">JP Ken Parfait & Yogurt</p>
                        <p className="mb-0">123 Freshness Lane, Harmony Estate,</p>
                        <p className="mb-0">Lekki Phase 1, Lagos, Nigeria</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Optional: Map Embed Card */}
            <Card className="policy-card p-4 p-md-5 mb-5">
              <Card.Body>
                <h2 className="policy-section-title mb-4">Find Us on the Map</h2>
                <div className="map-responsive">
                  <iframe
                    // ⭐ IMPORTANT: REPLACE THIS with your ACTUAL GOOGLE MAPS EMBED URL ⭐
                    // You get this by searching your business on Google Maps, clicking 'Share', then 'Embed a map'.
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d991.1011441747504!2d3.2806755596682486!3d6.470326370160138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8953760e8a95%3A0x7f6cea99dda6268f!2sJP-KEN%20Limited!5e0!3m2!1sen!2sng!4v1750105704246!5m2!1sen!2sng"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="JP Ken Location Map"
                  ></iframe>
                </div>
              </Card.Body>
            </Card>

            {/* Social Media Card */}
            <Card className="policy-card p-4 p-md-5">
              <Card.Body className="text-center">
                <h2 className="policy-section-title mb-4">Connect With Us</h2>
                <p className="policy-text mb-4">
                  Follow us on social media for updates, new product announcements, and special offers!
                </p>
                <div className="social-icons-container">
                  <a
                    href="https://facebook.com/jpkenofficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-link"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href="https://instagram.com/jpken_parfait"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-link"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="https://twitter.com/jpken_ng"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-link"
                  >
                    <FaTwitter />
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ContactUsPage;