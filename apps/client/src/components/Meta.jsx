// apps/client/src/components/Meta.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async'; // You'll need to install this package

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome To JP Ken',
  description: 'We sell the best electronics for cheap',
  keywords: 'electronics, buy electronics, cheap electronics, phones, laptops, gadgets, Lagos, Nigeria',
};

export default Meta;