import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #000;
`;

const Loader = styled.div`
  width: 80px;
  height: 80px;
  border: 16px solid #f3f3f3;
  border-top: 16px solid #e10600; // Red color for F1 theme
  border-radius: 50%;
  animation: ${spin} 2s linear infinite;
`;

const F1Loader = () => (
  <LoaderContainer>
    <Loader />
  </LoaderContainer>
);

export default F1Loader;