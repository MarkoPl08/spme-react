// src/components/CustomButton.tsx

import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

// eslint-disable-next-line no-empty-pattern
const StyledButton = styled(Button)(({ }) => ({
    background: 'linear-gradient(45deg, #E1306C 30%, #405DE6 90%)',
    border: 0,
    borderRadius: "10px",
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    minWidth: "15rem",
    transition: 'background 2s',
    '&:hover': {
        background: 'linear-gradient(45deg, #405DE6 30%, #E1306C 90%)',
    },
}));

const CustomButton: React.FC<ButtonProps> = (props) => {
    return <StyledButton {...props} />;
};

export default CustomButton;
