import React from 'react';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';

interface CenteredLayoutProps {
    children: React.ReactNode;
}

const CenteredLayout: React.FC<CenteredLayoutProps> = ({ children }) => {
    return (
        <Container>
            <Box
                display="flex"
                flexDirection="column"
                minHeight="100vh"
                alignItems="center"
                width="100vw"
                textAlign="center"
                padding={2}
            >
                {children}
            </Box>
        </Container>
    );
};

export default CenteredLayout;
