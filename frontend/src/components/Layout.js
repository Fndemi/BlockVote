// src/components/Layout.js
import React from 'react';
import Navigation from './Navigation'; // Import the Navigation component
import { Container } from 'react-bootstrap';

const Layout = ({ children }) => {
  return (
    <div>
      <Navigation />
      <Container style={{ marginTop: '70px' }}>
        {/* The children represent the content of each page */}
        {children}
      </Container>
    </div>
  );
};

export default Layout;
