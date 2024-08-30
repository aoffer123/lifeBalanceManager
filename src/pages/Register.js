import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Stepper, Step, StepLabel, Box, Typography, Paper, Grid, FormControlLabel, Switch, Divider } from '@mui/material';
import { styled } from '@mui/system';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import Check from '@mui/icons-material/Check';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, collection  } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";

// Styled Components
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& label.Mui-focused': {
    color: '#504FF8',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#504FF8',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#c4c4c4',
      borderRadius: '7px'
    },
    '&:hover fieldset': {
      borderColor: '#504FF8',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#504FF8',
    },
  },
}));

const BlueSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#5C5BFF',
    '&:hover': {
      backgroundColor: 'rgba(238, 237, 254, 0.80)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#5C5BFF',
  },
}));

const steps = ['Account Details', 'Family Members with Accounts', 'Family Members without Accounts'];

const Connector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#504FF8',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#504FF8',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const StepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#504FF8',
  }),
  '& .StepIcon-completedIcon': {
    color: '#504FF8',
    zIndex: 1,
    fontSize: 20,
  },
  '& .StepIcon-circle': {
    width: 15,
    height: 15,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function StepIcon(props) {
  const { active, completed, className } = props;

  return (
    <StepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="StepIcon-completedIcon" />
      ) : (
        <div className="StepIcon-circle" />
      )}
    </StepIconRoot>
  );
}

StepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  className: PropTypes.string,
};

function Register() {
  const [activeStep, setActiveStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [associationFamily, setAssociationFamily] = useState('');
  const [linkedGoogleCalendar, setLinkedGoogleCalendar] = useState(true);
  const [familyMembersWithAccount, setFamilyMembersWithAccount] = useState([{ email: "", relationship: "", password: "", birthdate: "", firstName: "", lastName: "" }]);
  const [familyMembersWithoutAccount, setFamilyMembersWithoutAccount] = useState([{ firstName: "", lastName: "", relationship: "", birthdate: "" }]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleFamilyMemberWithAccountChange = (index, event) => {
    const { name, value } = event.target;
    const newFamilyMembers = [...familyMembersWithAccount];
    newFamilyMembers[index][name] = value;
    setFamilyMembersWithAccount(newFamilyMembers);
  };

  const handleFamilyMemberWithoutAccountChange = (index, event) => {
    const { name, value } = event.target;
    const newFamilyMembers = [...familyMembersWithoutAccount];
    newFamilyMembers[index][name] = value;
    setFamilyMembersWithoutAccount(newFamilyMembers);
  };

  const addFamilyMemberWithAccount = () => setFamilyMembersWithAccount([...familyMembersWithAccount, { email: "", relationship: "", password: "", birthdate: "", firstName: "", lastName: "" }]);
  const removeFamilyMemberWithAccount = (index) => setFamilyMembersWithAccount(familyMembersWithAccount.filter((_, i) => i !== index));

  const addFamilyMemberWithoutAccount = () => setFamilyMembersWithoutAccount([...familyMembersWithoutAccount, { firstName: "", lastName: "", relationship: "", birthdate: "" }]);
  const removeFamilyMemberWithoutAccount = (index) => setFamilyMembersWithoutAccount(familyMembersWithoutAccount.filter((_, i) => i !== index));

  const handleRegister = async () => {
    setError(null);
    try {
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
        throw new Error("Name, Email, and Password cannot be empty.");
      }

      // Create the primary user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Generate a unique family ID for the family
      const familyId = doc(collection(db, "families")).id;

      // Save the primary user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        associationFamily,
        birthdate,
        email,
        familyId,
        linkedGoogleCalendar,
        familyMembersWithoutAccount // Save the family members without their own accounts in an array
      });

      // Register each family member that requires their own account
      await Promise.all(
        familyMembersWithAccount.map(async (member) => {
          const { email, relationship, firstName, lastName, password, birthdate } = member;
          const memberCredential = await createUserWithEmailAndPassword(auth, email, password);
          const memberUser = memberCredential.user;

          await setDoc(doc(db, "users", memberUser.uid), {
            familyId,
            email,
            relationship,
            firstName,
            lastName,
            birthdate,
          });
        })
      );

      navigate("/dashboard"); // Redirect to the dashboard after successful registration
    } catch (error) {
      setError(error.message);
      console.error("Error registering user: ", error);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'row', width: '100%' }}>
      <Grid container component="main" sx={{ height: '100%', backgroundColor: '#F2F4FA', padding: 5, justifyContent: 'center' }}>
        <Grid item xs={12} sm={8} md={6} sx={{ borderRadius: 5 }} component={Paper} elevation={3} square>
          <Box sx={{ p: 3, height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly' }}>
            <Stepper sx={{ padding: 1, width: '100%' }} connector={<Connector />} activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={StepIcon}>
                    <Typography>{label}</Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <Divider flexItem />
            <Box sx={{ width: '100%', padding: 2 }}>
              {activeStep === 0 && (
                <>
                  <Typography variant="h5" color="#232530">Create an Account</Typography>
                  <Typography variant="subtitle1" color="#232530">Enter your account details</Typography>
                  <div className="container p-0">
                    <div className="row">
                        <div className="col-6">
                            <StyledTextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth margin="normal" />
                        </div>
                        <div className="col-6">
                            <StyledTextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth margin="normal" />
                        </div>
                    </div>
                    <div className="col-12">
                        <StyledTextField label="Birthdate" name="birthdate" type="date" InputLabelProps={{ shrink: true }} value={birthdate} onChange={(e) => setBirthdate(e.target.value)} fullWidth margin="normal"/>
                    </div>
                    <div className="col-12">
                        <StyledTextField label="Title in family" value={associationFamily} onChange={(e) => setAssociationFamily(e.target.value)} fullWidth margin="normal" />
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <StyledTextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
                        </div>
                        <div className="col-6">
                            <StyledTextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />
                        </div>
                    </div>
                    <div className="col-12">
                        <FormControlLabel control={<BlueSwitch checked={linkedGoogleCalendar} onChange={(e) => setLinkedGoogleCalendar(e.target.checked)} />} label="Link Google Calendar" />
                    </div>
                    </div>
                  {error && <Typography color="error" variant="body2">{error}</Typography>}
                </>
              )}
              {activeStep === 1 && (
                <>
                  <Typography variant="h5" color="#232530">Family Members with Accounts</Typography>
                  <Typography variant="subtitle1" className="mb-3" color="#232530">Add family members who need their own accounts</Typography>
                  {familyMembersWithAccount.map((member, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column' }}>
                      <div className="container p-0">
                            <div className="row mb-3">
                                <div className="col-6">
                                <StyledTextField label="First Name" name="firstName" value={member.firstName} onChange={(e) => handleFamilyMemberWithAccountChange(index, e)} fullWidth />
                                </div>
                                <div className="col-6">
                                <StyledTextField label="Last Name" name="lastName" value={member.lastName} onChange={(e) => handleFamilyMemberWithAccountChange(index, e)} fullWidth />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-6">
                                    <StyledTextField label="Email" name="email" value={member.email} onChange={(e) => handleFamilyMemberWithAccountChange(index, e)} fullWidth />
                                </div>
                                <div className="col-6">
                                    <StyledTextField label="Password" name="password" value={member.password} onChange={(e) => handleFamilyMemberWithAccountChange(index, e)} fullWidth />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-6">
                                    <StyledTextField label="Relationship" name="relationship" value={member.relationship} onChange={(e) => handleFamilyMemberWithAccountChange(index, e)} fullWidth />
                                </div>
                                <div className="col-6">
                                    <StyledTextField label="Birthdate" name="birthdate" type="date" InputLabelProps={{ shrink: true }} value={member.birthdate} onChange={(e) => handleFamilyMemberWithAccountChange(index, e)} fullWidth />
                                </div>
                            </div>
                        </div>
                     <div className="w-100 d-flex justify-content-end">
                      <Button 
                      variant="contained" 
                      disableElevation 
                      sx={{ 
                        marginBottom: 1, 
                        backgroundColor: 'rgba(238, 237, 254, 0.80)',
                        '&:hover': {
                            backgroundColor: 'rgba(213, 213, 253, 0.70)',
                        }, 
                        color: '#504FF8', 
                        width: 110  }} 
                      onClick={() => removeFamilyMemberWithAccount(index)}><RemoveIcon sx={{ paddingLeft: 0 }} /> 
                      Remove
                      </Button>
                      </div>
                    </Box>
                  ))}
                  <Button onClick={addFamilyMemberWithAccount} startIcon={<AddIcon />}>Add Family Member with Account</Button>
                </>
              )}
              {activeStep === 2 && (
                <>
                  <Typography variant="h5" color="#232530">Family Members without Accounts</Typography>
                  <Typography variant="subtitle1" className="mb-2" color="#232530">Add family members who don’t need their own accounts</Typography>
                  {familyMembersWithoutAccount.map((member, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column'}}>
                        <div className="container p-0">
                            <div className="row">
                                <div className="col-3"><StyledTextField label="First Name" name="firstName" value={member.firstName} onChange={(e) => handleFamilyMemberWithoutAccountChange(index, e)} fullWidth /></div>
                                <div className="col-3"><StyledTextField label="Last Name" name="lastName" value={member.lastName} onChange={(e) => handleFamilyMemberWithoutAccountChange(index, e)} fullWidth /></div>
                                <div className="col-3"><StyledTextField label="Relationship" name="relationship" value={member.relationship} onChange={(e) => handleFamilyMemberWithoutAccountChange(index, e)} fullWidth /></div>
                                <div className="col-3"><StyledTextField label="Birthdate" name="birthdate" type="date" InputLabelProps={{ shrink: true }} value={member.birthdate} onChange={(e) => handleFamilyMemberWithoutAccountChange(index, e)} fullWidth /></div>
                            </div>
                        </div>
                        <div className="w-100 d-flex justify-content-end">
                            <Button
                            variant="contained" 
                            disableElevation 
                            sx={{ 
                                marginBottom: 1, 
                                marginTop: 1, 
                                backgroundColor: 'rgba(238, 237, 254, 0.80)', 
                                color: '#504FF8',
                                '&:hover': {
                                    backgroundColor: 'rgba(213, 213, 253, 0.70)',
                                },
                                width: 110  
                            }} 
                            onClick={() => removeFamilyMemberWithoutAccount(index)}>
                                <RemoveIcon />
                            </Button>
                        </div>
                    </Box>
                  ))}
                  <Button onClick={addFamilyMemberWithoutAccount} startIcon={<AddIcon />}>Add Family Member without Account</Button>
                </>
              )}
            </Box>
            <Box sx={{ width: '100%', paddingLeft: 2, paddingRight: 2  }} display="flex" justifyContent="space-between">
              {activeStep !== 0 && (
                <Button variant="outlined" sx={{ width: 200, height: 40, borderColor: '#767676', color: '#767676' }} onClick={handleBack}>Back</Button>
              )}
              {activeStep === steps.length - 1 ? (
                <Button variant="contained" disableElevation sx={{ width: 200, height: 40, bgcolor: '#504FF8' }} onClick={handleRegister}>Register</Button>
              ) : (
                <Button variant="contained" sx={{ width: 200, height: 40, bgcolor: '#504FF8' }} onClick={handleNext}>Next</Button>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Register;