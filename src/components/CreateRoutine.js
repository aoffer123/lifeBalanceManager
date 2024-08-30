import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Typography,
  Box,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/system';
import RemoveIcon from '@mui/icons-material/Remove';
import { collection, doc, setDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { v4 as uuidv4 } from 'uuid';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const CustomTextField = styled(TextField)(({ theme }) => ({
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

function CreateRoutine() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState([{ name: '' }]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      if (user) {
        // Fetch the current user document from Firestore to get the familyId
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const familyId = userDoc.data().familyId;

          if (familyId) {
            // Query to get all family members with the same familyId
            const q = query(collection(db, "users"), where("familyId", "==", familyId));
            const familySnapshot = await getDocs(q);

            const members = familySnapshot.docs.map((doc) => ({
              id: doc.id,
              name: `${doc.data().firstName}`,
            }));

            // Fetch family members without accounts
            const familyMembersWithoutAccount = (userDoc.data().familyMembersWithoutAccount || []).map(member => ({
            id: `${member.firstName}-${member.lastName}`, // Unique ID for this list
            name: `${member.firstName}`
            }));


            // Combine the members with accounts and those without accounts
            setFamilyMembers([...members, ...familyMembersWithoutAccount]);
          } else {
            console.error("No familyId found in the user document.");
          }
        } else {
          console.error("User document does not exist.");
        }
      }
    };

    fetchFamilyMembers();
  }, [user]);

  console.log(familyMembers)

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTaskChange = (index, event) => {
    const newTasks = [...tasks];
    newTasks[index].name = event.target.value;
    setTasks(newTasks);
  };

  const addTaskField = () => {
    setTasks([...tasks, { name: '' }]);
  };

  const removeTaskField = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleDaysChange = (event) => {
    const { value } = event.target;
    setSelectedDays(typeof value === 'string' ? value.split(',') : value);
  };

  const handleAssignedToChange = (event) => {
    const { value } = event.target;
    setAssignedTo(typeof value === 'string' ? value.split(',') : value);
  };

  const handleRoutineCreate = async () => {
    try {
      const routineId = uuidv4();
      const routineData = {
        title,
        tasks: tasks.map(task => ({ ...task, completed: false })),
        description,
        startTime,
        endTime,
        days: selectedDays,
        assignedTo,
        userId: user.uid,
      };

      // Save the routine in Firestore
      await setDoc(doc(db, "routines", routineId), routineData);
      
      // Close the dialog
      handleClose();
    } catch (error) {
      console.error("Error creating routine: ", error);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Create Routine
      </Button>
      <Dialog open={open} onClose={handleClose} sx={{borderRadius: 20 }} maxWidth="lg" fullWidth>
        <DialogTitle variant="h5" className='pb-1'>Create a Routine</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', paddingTop: 3, flexDirection: 'row'}}>
            <div className='pe-3 w-50 ps-0'>
            <Typography sx={{marginBottom: 2}} variant="subtitle1" gutterBottom>
                Details
            </Typography>
            <CustomTextField
                label="Routine Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                sx={{ marginBottom: 3 }}
            />
            <CustomTextField
                label="Routine Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                sx={{ marginBottom: 3 }}
               
            />
            <div className='d-flex flex-row justify-content-between'>
            <CustomTextField
                label="Start Time"
                type="time"
                sx={{ marginRight: 1, marginBottom: 3 }}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                fullWidth
                
                InputLabelProps={{ shrink: true }}
            />
            <CustomTextField
                label="End Time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                fullWidth
                sx={{ marginBottom: 3 }}
                InputLabelProps={{ shrink: true }}
            />
            </div>
            <FormControl fullWidth>
                <InputLabel>Days of the Week</InputLabel>
                <Select
                multiple
                sx={{ borderRadius: 2, marginBottom: 3  }}
                value={selectedDays}
                onChange={handleDaysChange}
                input={<OutlinedInput label="Days of the Week" />}
                renderValue={(selected) => selected.join(', ')}
                >
                {daysOfWeek.map((day) => (
                    <MenuItem key={day} value={day}>
                    <Checkbox checked={selectedDays.includes(day)} />
                    <ListItemText primary={day} />
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Who is this for?</InputLabel>
                <Select
                multiple
                sx={{ borderRadius: 2, marginBottom: 3 }}
                value={assignedTo}
                onChange={handleAssignedToChange}
                input={<OutlinedInput label="Who is this for?" />}
                renderValue={(selected) => selected.join(', ')}
                >
                {familyMembers.map((member) => (
                <MenuItem key={member.id} value={member.name}>
                  <Checkbox checked={assignedTo.includes(member.name)} />
                  <ListItemText primary={member.name} />
                </MenuItem>
              ))}
                </Select>
            </FormControl>
            </div>
            <Divider orientation='vertical' flexItem/>
            <div className="ps-4 w-50">
                <Typography variant="subtitle1" sx={{marginBottom: 2}} gutterBottom>
                Tasks
                </Typography>
                {tasks.map((task, index) => (
                <div key={index} style={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                    <CustomTextField
                    label={`Task ${index + 1}`}
                    value={task.name}
                    onChange={(e) => handleTaskChange(index, e)}
                    sx={{ width: '90%', marginBottom: 3 }}
                    />
                    <Button 
                    onClick={() => removeTaskField(index)}
                    variant='container'
                    disableElevation
                    disabled={tasks.length === 1}
                    sx={{
                       marginLeft: 2,
                       marginBottom: 3, 
                       width: '10%', 
                       backgroundColor: 'rgba(253, 223, 213, 0.60)',
                      '&:hover': {
                        backgroundColor: 'rgba(253, 223, 213, 0.90)',
                      }, 
                      color: '#FA1717',
                    }}
                    >
                    <RemoveIcon />
                    </Button>
                </div>
                ))}
                <Button 
                onClick={addTaskField}
                variant="contained"
                disableElevation
                sx={{
                    backgroundColor: 'rgba(238, 237, 254, 0.90)',
                        '&:hover': {
                            backgroundColor: 'rgba(213, 213, 253, 0.80)',
                        }, 
                    color: '#504FF8', 
                }}
                
                >
                    Add Task
                </Button>
            </div>
          </Box>
        </DialogContent>
        <DialogActions sx={{  display: 'flex', paddingBottom: 3, justifyContent: 'flex-end', width: '100%'  }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderColor: '#767676',
              color: '#767676',
              
              '&:hover': {
                backgroundColor: 'rgba(118, 118, 118, 0.15)',
                borderColor: '#767676',
              },
            }}
            >
            Cancel
            </Button>
          <Button variant="contained" 
            disableElevation
            sx={{
                backgroundColor: '#504FF8',
                    '&:hover': {
                        backgroundColor: '#3938B0',
                    }, 
            }}
            onClick={handleRoutineCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CreateRoutine;