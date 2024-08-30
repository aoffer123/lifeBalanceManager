import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { addDoc, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function CreateAppointment() {
  const [user] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [appointmentFor, setAppointmentFor] = useState('');
  const [assignedTo, setAssignedTo] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);

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
              firstName: doc.data().firstName,
              lastName: doc.data().lastName,
              name: `${doc.data().firstName} ${doc.data().lastName}`,
            }));

            // Fetch family members without accounts (combine first and last names)
            const familyMembersWithoutAccount = (userDoc.data().familyMembersWithoutAccount || []).map(member => ({
              id: `${member.firstName}-${member.lastName}`, // Unique ID for this list
              firstName: member.firstName,
              lastName: member.lastName,
              name: `${member.firstName} ${member.lastName}`
            }));

            // Combine the members with accounts and those without accounts
            setFamilyMembers([...members, ...familyMembersWithoutAccount]);
          }
        }
      }
    };

    fetchFamilyMembers();
  }, [user]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateAppointment = async () => {
    if (user) {
      await addDoc(collection(db, "appointments"), {
        date,
        startTime,
        endTime,
        location,
        appointmentFor,
        assignedTo,
        userId: user.uid,
      });
      handleClose(); // Close dialog after appointment creation
    }
  };

  const handleSelectChange = (event) => {
    const {
      target: { value },
    } = event;
    setAssignedTo(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Create Appointment
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a New Appointment</DialogTitle>
        <DialogContent>
          <TextField
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Start Time"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            margin="normal"
          />
          <TextField
            label="End Time"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Location"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            margin="normal"
          />
          <TextField
            label="What is the appointment for?"
            fullWidth
            value={appointmentFor}
            onChange={(e) => setAppointmentFor(e.target.value)}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Who is the appointment for?</InputLabel>
            <Select
              multiple
              value={assignedTo}
              onChange={handleSelectChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {familyMembers.map(member => (
                <MenuItem key={member.id} value={member.name}>
                  <Checkbox checked={assignedTo.indexOf(member.name) > -1} />
                  <ListItemText primary={member.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateAppointment}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CreateAppointment;