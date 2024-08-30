import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button, TextField, Typography, Stack, Box, Paper, CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import logo from '../img/pana2.png'; // Replace with your image path

// Styled Link Component
const StyledLink = styled(RouterLink)(({ theme }) => ({
  color: '#39379C',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
    color: '#3734FF',
  },
}));

// Custom Styled TextField
const CustomTextField = styled(TextField)(({ theme }) => ({
  '& label.Mui-focused': {
    color: '#996BFF',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#996BFF',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#c4c4c4',
      borderRadius: '7px'
    },
    '&:hover fieldset': {
      borderColor: '#3938B0',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#996BFF',
    },
  },
}));

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, authError] = useAuthState(auth);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // Prevent navigation during loading
    if (user) navigate("/dashboard"); // Redirect to dashboard if logged in
  }, [user, loading, navigate]);

  const handleLogin = async () => {
    try {
      setLoginError(""); // Reset login error before attempting login
      await logInWithEmailAndPassword(email, password); // Attempt login
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Invalid credentials. Please try again."); // Display error message
    }
  };

  // Handle "Enter" key press for login
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
      <Grid container columns={12} component="main" sx={{ height: '100vh'}}>
        {/* Left Side - Illustration */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${logo})`,
            backgroundColor: (t) => t.palette.mode === 'light' ? '#504FF8' : t.palette.grey[900],
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
        {/* Right Side - Sign In Form */}
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Stack justifyContent="center" alignItems="center" mb={3} spacing={2} direction="row">
              <Typography sx={{ fontSize: 38}} color="#232530">
                  LifeSync
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: 25, marginBottom: 2}} color="#232530"> Login</Typography>
            {/* Display Login Error */}
            {loginError && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {loginError}
              </Alert>
            )}
            {/* Email Input */}
            <CustomTextField 
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyPress}
              fullWidth
              margin="normal"
              sx={{ marginBottom: 3 }}
            />
            {/* Password Input */}
            <CustomTextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyPress}
              fullWidth
              margin="normal"
              sx={{ marginBottom: 2 }}
            />
            {authError && <Typography color="error">{authError.message}</Typography>}
            {/* Loading Indicator or Login Button */}
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <Box sx={{ display: 'flex', marginBottom: 4, flexDirection: 'column', alignItems: 'center'}}>
                  <StyledLink to="/reset">Forgot Password?</StyledLink>
                </Box>
                <Stack direction="row" mb={5} spacing={3}>
                  <Button 
                    variant="contained" 
                    disableElevation 
                    sx={{ 
                      bgcolor: '#504FF8', 
                      width: 300, 
                      '&:hover': {
                        backgroundColor: '#3938B0',
                      },
                      height: 40 
                    }} 
                    onClick={handleLogin}
                  >
                    Log in
                  </Button>
                </Stack>           
                <div>
                  Don't have an account? <StyledLink to="/register">Register</StyledLink> now.
                </div>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SignIn;