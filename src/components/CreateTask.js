import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function CreateTask() {
  const [user] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [category, setCategory] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateTask = async () => {
    if (user) {
      await addDoc(collection(db, "tasks"), {
        name: taskName,
        dueDate,
        description,
        dueTime,
        category,
        status: false,
        userId: user.uid,
      });
      handleClose(); // Close dialog after task creation
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        Create Task
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a New Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Task Name"
            fullWidth
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Due Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Due Time"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="Work">Work</MenuItem>
              <MenuItem value="Personal">Personal</MenuItem>
              <MenuItem value="Family">Family</MenuItem>
              <MenuItem value="Health">Health</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Chores">Chores</MenuItem>
              <MenuItem value="Errands">Errands</MenuItem>
              <MenuItem value="Hobbies">Hobbies</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateTask}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CreateTask;