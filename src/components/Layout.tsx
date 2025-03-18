import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const MainContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <StyledAppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            News Aggregator
          </Typography>
        </Toolbar>
      </StyledAppBar>
      <MainContainer maxWidth="lg">
        {children}
      </MainContainer>
    </Box>
  );
};