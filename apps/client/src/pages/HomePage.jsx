// apps/client/src/pages/HomePage.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from 'react-bootstrap'; // Removed Row, Col, Button, Link imports as they are now in FeatureBanner

import HeroSection from '../components/HeroSection';
import ProductCarousel from '../components/ProductCarousel';
import FeatureBanner from '../components/FeatureBanner'; // <--- NEW IMPORT
import SignatureCollections from '../components/SignatureCollections'; // <--- NEW IMPORT
import CallToActionSection from '../components/CallToActionSection';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>ProShop - Indulge in Delicious Parfaits</title>
      </Helmet>

      {/* 1. Hero Section - The welcoming banner */}
      <HeroSection />

      {/* 2. Top-Rated/Featured Products Carousel */}
      <Container fluid className="my-5 py-5 product-carousel-section">
        <h2 className="section-heading text-center mb-4">Our Top-Rated Parfaits</h2>
        <ProductCarousel />
      </Container>

      {/* 3. Feature Banner - Eye-catching "View All Products" CTA with Left/Right split */}
      <FeatureBanner
        heading="Craving Something Special?"
        text="Dive into our complete selection of handcrafted parfaits, each a masterpiece of flavor and texture. Find your perfect treat today!"
        buttonText="View All Parfaits"
        buttonLink="/products"
        imageSrc="/images/explore-all-banner.jpg" // <--- REPLACE with your own image (e.g., a beautiful wide parfait shot)
        imageAlt="Assortment of delicious parfaits"
        reverse={false} // Text on right, image on left
        className="explore-products-banner" // Custom class for specific styling
      />

      {/* 4. Signature Collections Section - Grid of categories/collections */}
      <SignatureCollections />

      {/* 5. Call to Action / Promotional Section (e.g., Newsletter Signup, special offer) */}
      <CallToActionSection />
    </>
  );
};

export default HomePage;