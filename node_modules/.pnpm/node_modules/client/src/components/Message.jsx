// apps/client/src/components/Message.jsx
import React from 'react';
import { Alert } from 'react-bootstrap'; // Assuming react-bootstrap is used

const Message = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

Message.defaultProps = {
  variant: 'info', // Default message type is 'info'
};

export default Message;