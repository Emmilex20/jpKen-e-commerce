// apps/client/src/pages/PrivacyPolicyPage.jsx
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // For internal links within the policy
import Meta from '../components/Meta'; // For SEO

const PrivacyPolicyPage = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Meta
        title="Privacy Policy | JP Ken Parfait & Yogurt"
        description="Understand how JP Ken collects, uses, and protects your personal information. Your privacy is our priority."
      />

      <Container className="py-5 policy-page-container">
        <Row className="text-center mb-5">
          <Col>
            <h1 className="policy-heading mb-3">Privacy Policy</h1>
            <p className="lead policy-subheading">
              Your trust is our utmost priority. This policy outlines how JP Ken protects your data.
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
                <p className="policy-text">
                  Welcome to JP Ken! We are committed to protecting your privacy and personal information. This Privacy Policy explains how JP Ken ("we," "us," or "our") collects, uses, discloses, and protects your information when you visit and make a purchase through our website, located at{' '}
                  <a href="http://localhost:5173" className="policy-link">http://localhost:5173</a>, and our related services. By accessing or using our services, you agree to the terms of this Privacy Policy.
                </p>

                <h2 className="policy-section-title mt-5 mb-3">1. Information We Collect</h2>
                <p className="policy-text">
                  We collect various types of information to provide and improve our services to you.
                </p>
                <h3 className="policy-subsection-title mt-4 mb-2">1.1 Personal Data</h3>
                <p className="policy-text">
                  When you create an account, place an order, or contact us, we may collect personally identifiable information, including but not limited to:
                </p>
                <ul className="policy-list">
                  <li><strong>Contact Information:</strong> Name, email address, phone number, shipping address, and billing address.</li>
                  <li><strong>Account Information:</strong> Username and password.</li>
                  <li><strong>Order Details:</strong> Products purchased, order history, and delivery instructions.</li>
                </ul>

                <h3 className="policy-subsection-title mt-4 mb-2">1.2 Payment Data</h3>
                <p className="policy-text">
                  When you make a purchase, payment information (such as credit/debit card numbers) is processed by secure third-party payment gateways (e.g., Paystack, Flutterwave). We do not store your full payment card details on our servers.
                </p>

                <h3 className="policy-subsection-title mt-4 mb-2">1.3 Usage Data</h3>
                <p className="policy-text">
                  We automatically collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
                </p>

                <h3 className="policy-subsection-title mt-4 mb-2">1.4 Cookies and Tracking Technologies</h3>
                <p className="policy-text">
                  We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Other tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service.
                </p>
                <p className="policy-text">
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
                </p>

                <h2 className="policy-section-title mt-5 mb-3">2. How We Use Your Information</h2>
                <p className="policy-text">
                  JP Ken uses the collected data for various purposes:
                </p>
                <ul className="policy-list">
                  <li>To provide and maintain our Service, including processing your orders and delivering your products.</li>
                  <li>To notify you about changes to our Service.</li>
                  <li>To allow you to participate in interactive features of our Service when you choose to do so.</li>
                  <li>To provide customer care and support.</li>
                  <li>To provide analysis or valuable information so that we can improve the Service.</li>
                  <li>To monitor the usage of the Service.</li>
                  <li>To detect, prevent, and address technical issues.</li>
                  <li>To personalize your experience and offer products or promotions tailored to your interests (with your consent where required).</li>
                  <li>To fulfill any other purpose for which you provide it.</li>
                </ul>

                <h2 className="policy-section-title mt-5 mb-3">3. Disclosure of Your Information</h2>
                <p className="policy-text">
                  We may share your personal information in the following situations:
                </p>
                <ul className="policy-list">
                  <li><strong>With Service Providers:</strong> We may employ third-party companies and individuals to facilitate our Service, provide the Service on our behalf, perform Service-related services, or assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose. This includes delivery partners and payment processors.</li>
                  <li><strong>For Legal Requirements:</strong> We may disclose your Personal Data in the good faith belief that such action is necessary to:
                    <ul className="policy-sublist">
                      <li>Comply with a legal obligation (e.g., court order or government request).</li>
                      <li>Protect and defend the rights or property of JP Ken.</li>
                      <li>Prevent or investigate possible wrongdoing in connection with the Service.</li>
                      <li>Protect the personal safety of users of the Service or the public.</li>
                      <li>Protect against legal liability.</li>
                    </ul>
                  </li>
                  <li><strong>Business Transfer:</strong> If JP Ken is involved in a merger, acquisition, or asset sale, your Personal Data may be transferred. We will provide notice before your Personal Data is transferred and becomes subject to a different Privacy Policy.</li>
                  <li><strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with your explicit consent.</li>
                </ul>

                <h2 className="policy-section-title mt-5 mb-3">4. Data Security</h2>
                <p className="policy-text">
                  The security of your data is important to us. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security. No method of transmission over the Internet, or method of electronic storage, is 100% secure. We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.
                </p>

                <h2 className="policy-section-title mt-5 mb-3">5. Your Data Protection Rights (Under Nigerian Law)</h2>
                <p className="policy-text">
                  In accordance with the Nigerian Data Protection Regulation (NDPR) and other applicable laws, you have certain data protection rights. We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.
                </p>
                <ul className="policy-list">
                  <li><strong>The Right to Access:</strong> You have the right to request copies of your Personal Data.</li>
                  <li><strong>The Right to Rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
                  <li><strong>The Right to Erasure:</strong> You have the right to request that we erase your Personal Data, under certain conditions.</li>
                  <li><strong>The Right to Object to Processing:</strong> You have the right to object to our processing of your Personal Data, under certain conditions.</li>
                  <li><strong>The Right to Data Portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
                </ul>
                <p className="policy-text">
                  If you wish to exercise any of these rights, please contact us. We may ask you to verify your identity before responding to such requests.
                </p>

                <h2 className="policy-section-title mt-5 mb-3">6. Children's Privacy</h2>
                <p className="policy-text">
                  Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children have provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
                </p>

                <h2 className="policy-section-title mt-5 mb-3">7. Links to Other Sites</h2>
                <p className="policy-text">
                  Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
                </p>

                <h2 className="policy-section-title mt-5 mb-3">8. Changes to This Privacy Policy</h2>
                <p className="policy-text">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>

                <h2 className="policy-section-title mt-5 mb-3">9. Contact Us</h2>
                <p className="policy-text">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul className="policy-list">
                  <li>By email: <a href="mailto:info@jpken.com" className="policy-link">info@jpken.com</a></li>
                  <li>By visiting this page on our website: <Link to="/contact-us" className="policy-link">Contact Us Page</Link> (If you have a dedicated contact page)</li>
                  <li>By phone: +234 (80) 1234-5678</li>
                  <li>By mail: 123 E-Commerce Way, Digital City, Lekki, Lagos, Nigeria</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PrivacyPolicyPage;