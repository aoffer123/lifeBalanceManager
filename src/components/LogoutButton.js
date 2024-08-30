import React from 'react';
import { Button } from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Navigate the user to the login page or home page after logout
      navigate('/');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default LogoutButton;