// apps/client/src/components/Paginate.jsx
import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <Pagination className='justify-content-center my-4'>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={
              !isAdmin // If NOT admin
                ? keyword // If public search (has a keyword)
                  ? `/search/${keyword}/page/${x + 1}` // Link for public search results with pagination
                  : `/products/page/${x + 1}` // Link for all public products with pagination
                : `/admin/productlist/${x + 1}` // Link for admin product list with pagination
            }
          >
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;