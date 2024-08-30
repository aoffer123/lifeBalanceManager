import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function RoutinesCard() {
  const [user] = useAuthState(auth);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Initialized to null
  const [routines, setRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState('');
  const [tasks, setTasks] = useState([]);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }); // Get current day of the week

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

  useEffect(() => {
    const fetchRoutines = async () => {
      if (selectedUser && selectedUser.firstName) {
        // Query to get all routines assigned to the selected user's first name
        const q = query(collection(db, "routines"), where("assignedTo", "array-contains", selectedUser.firstName));
        const routineSnapshot = await getDocs(q);
        
        const routinesData = routineSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter((routine) => routine.days.includes(today)); // Filter routines by current day

        setRoutines(routinesData);
      }
    };

    fetchRoutines();
  }, [selectedUser, today]); // Add today to the dependencies

  const handleUserChange = (event) => {
    const selectedUserName = familyMembers.find(member => member.name === event.target.value);
    setSelectedUser(selectedUserName);
    setSelectedRoutine('');
    setTasks([]);
  };

  const handleRoutineChange = (event) => {
    const selectedRoutineId = event.target.value;
    const routine = routines.find(routine => routine.id === selectedRoutineId);

    if (routine) {
      setSelectedRoutine(selectedRoutineId);
      setTasks(routine.tasks);
    } else {
      setSelectedRoutine('');
      setTasks([]);
    }
  };

  const handleTaskCheck = async (taskIndex) => {
    const updatedTasks = tasks.map((task, index) =>
      index === taskIndex ? { ...task, completed: true } : task
    );

    setTasks(updatedTasks);

    // Update the routine in Firestore
    const routineDocRef = doc(db, "routines", selectedRoutine);
    await updateDoc(routineDocRef, { tasks: updatedTasks });
  };

  return (
    <Card elevation={0} sx={{ borderRadius: 4 }}>
      <CardContent>
        <div style={{ display: 'flex', gap: '8px' }}>
        <Typography variant="h5" gutterBottom>
          Routines
        </Typography>
          <FormControl fullWidth>
            <InputLabel>Family Member</InputLabel>
            <Select sx={{ borderRadius: 2 }}  value={selectedUser?.name || ''} onChange={handleUserChange}>
              {familyMembers.map(member => (
                <MenuItem key={member.id} value={member.name}>
                  {member.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth disabled={!selectedUser || routines.length === 0}>
            <InputLabel>Name of Routine</InputLabel>
            <Select sx={{ borderRadius: 2 }} value={selectedRoutine} onChange={handleRoutineChange}>
              {routines.map(routine => (
                <MenuItem key={routine.id} value={routine.id}>
                  {routine.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {tasks.length > 0 && (
          <div>
            <Typography variant="h6">Tasks:</Typography>
            {tasks.map((task, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={task.completed}
                  onChange={() => handleTaskCheck(index)}
                  color="primary"
                />
                <ListItemText primary={task.name} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RoutinesCard;