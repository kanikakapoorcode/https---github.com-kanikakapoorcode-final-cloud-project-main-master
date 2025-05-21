import { Button, Typography, Box, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../assets/logoo.png';

const Homepage = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center', // Vertical centering
      alignItems: 'center',    // Horizontal centering
      minHeight: '100vh',      // Full viewport height
      width: '100vw',          // Full viewport width
      overflow: 'hidden',      // Prevent scrollbar issues
      bgcolor: '#1976d2',      // Solid blue background
      p: 3,                    // Padding on all sides
      boxSizing: 'border-box'  // Include padding in dimensions
    }}>
      {/* Main Content Container */}
      <Container maxWidth="sm" sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 4
      }}>
        {/* Logo */}
        <Box 
          component="img"
          src={logo}
          alt="Finance Logo"
          sx={{ 
            height: 100,
            width: 'auto',
            mb: 2
          }}
        />

        {/* Title */}
        <Typography variant="h3" sx={{ 
          color: 'white',
          fontWeight: 'bold',
          lineHeight: 1.2
        }}>
          FINANCE MANAGEMENT SYSTEM
        </Typography>

        {/* Subtitle */}
        <Typography variant="h6" sx={{ 
          color: 'rgba(255,255,255,0.9)',
          mb: 4
        }}>
          Smart Money Management Solutions
        </Typography>

        {/* Auth Buttons */}
        <Box sx={{
          width: '100%',
          maxWidth: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 4,
          boxShadow: 3
        }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            component={Link}
            to="/auth/login"
            sx={{
              mb: 2,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            SIGN IN
          </Button>

          <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
            Don't have an account?
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            component={Link}
            to="/auth/signup"
            sx={{
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold',
              color: 'primary.main',
              borderWidth: 2,
              '&:hover': { borderWidth: 2 }
            }}
          >
            SIGN UP
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Typography variant="body2" sx={{ 
        position: 'fixed',
        bottom: 20,
        color: 'rgba(255,255,255,0.7)'
      }}>
        © {new Date().getFullYear()} Finance Pro. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Homepage;