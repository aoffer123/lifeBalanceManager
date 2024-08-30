import React, { useState, useEffect } from 'react';
import { Card, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import Calendar from 'react-calendar';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import 'react-calendar/dist/Calendar.css'; // Import default styles for react-calendar

function Schedule() {
  const [user] = useAuthState(auth);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchTasksAndAppointments = async () => {
      if (user) {
        const selectedDay = selectedDate.toISOString().split('T')[0]; // format as YYYY-MM-DD
        const tasksQuery = query(collection(db, 'tasks'), where('dueDate', '==', selectedDay), where('userId', '==', user.uid));
        const appointmentsQuery = query(collection(db, 'appointments'), where('date', '==', selectedDay), where('userId', '==', user.uid));
        
        const [tasksSnapshot, appointmentsSnapshot] = await Promise.all([getDocs(tasksQuery), getDocs(appointmentsQuery)]);

        const tasksData = tasksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const appointmentsData = appointmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTasks(tasksData);
        setAppointments(appointmentsData);
      }
    };

    fetchTasksAndAppointments();
  }, [selectedDate, user]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <Card sx={{ padding: 2 }}>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
      />
      <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
        List of Appointments
      </Typography>
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Tasks
      </Typography>
      <List>
        {tasks.map(task => (
          <ListItem key={task.id}>
            <ListItemText primary={task.name} secondary={`${task.dueTime}`} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ marginY: 2 }} />
      <Typography variant="h6">
        Appointments
      </Typography>
      <List>
        {appointments.map(appointment => (
          <ListItem key={appointment.id}>
            <ListItemText primary={appointment.appointmentFor} secondary={`${appointment.startTime} - ${appointment.endTime}`} />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

export default Schedule;