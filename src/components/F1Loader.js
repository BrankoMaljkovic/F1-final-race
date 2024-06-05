import React from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframes for the animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styling for the loader container
const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #000;
`;

// Styling for the wheel loader
const Wheel = styled.div`
  width: 80px;
  height: 80px;
  border: 10px solid #f3f3f3;
  border-top: 10px solid #e10600; // Red color for F1 theme
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    background-color: #000;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
`;

const F1WheelLoader = () => (
  <LoaderContainer>
    <Wheel />
  </LoaderContainer>
);

export default F1WheelLoader;