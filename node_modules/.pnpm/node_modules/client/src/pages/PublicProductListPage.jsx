// apps/client/src/pages/PublicProductListPage.jsx

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom'; // Keep Link for 'Go Back'
import { Row, Col, Container } from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';

import { useGetProductsQuery } from '../slices/productsApiSlice';

const PublicProductListPage = () => { // Renamed component
  const { keyword, pageNumber } = useParams();
  const currentPageNumber = pageNumber || 1;

  const { data, isLoading, isError, error } = useGetProductsQuery({
    keyword, // This passes the keyword to your API call
    pageNumber: currentPageNumber,
  });

  return (
    <>
      <Helmet>
        <title>{keyword ? `Search Results for "${keyword}"` : 'All Products - ProShop'}</title>
      </Helmet>

      {/* Product Carousel / Featured Section - Only show on base /products page, not search or admin */}
      {!keyword && !pageNumber && (
        <Container fluid className="py-4 mb-4 mt-4 product-carousel-section">
          <ProductCarousel />
        </Container>
      )}

      <Container className="products-list-section my-5">
        <h1 className="section-heading text-center mb-4">
          {keyword ? `Search Results for "${keyword}"` : 'Our Full Product Catalog'}
        </h1>

        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger" className="app-error-message">
            {error?.data?.message || error?.error || 'An unexpected error occurred.'}
          </Message>
        ) : (
          <>
            <Row>
              {
                data && data.products && data.products.length === 0 && keyword ? ( // Specific message for no search results
                  <Col>
                    <Message variant="info">No products found matching your search: "{keyword}"</Message>
                    <Link to='/products' className='btn btn-light my-3'>Go Back to All Products</Link>
                  </Col>
                ) : (
                  data && data.products && data.products.map((product) => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="product-col-wrapper mb-4">
                      <Product product={product} />
                    </Col>
                  ))
                )
              }
            </Row>
            {/* Ensure data.pages and data.page exist before rendering Paginate */}
            {data && data.pages && data.page && (
              <Paginate
                pages={data.pages}
                page={data.page}
                keyword={keyword}
                // isAdmin={false} // Default to false, no need to explicitly pass here
              />
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default PublicProductListPage;