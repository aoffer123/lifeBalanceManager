import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, List, ListItem, ListItemText, Button } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/calendar.css';

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [user] = useAuthState(auth);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (user) {
        const tasksQuery = query(collection(db, 'tasks'), where('userId', '==', user.uid));
        const appointmentsQuery = query(collection(db, 'appointments'), where('userId', '==', user.uid));
        
        const [tasksSnapshot, appointmentsSnapshot] = await Promise.all([getDocs(tasksQuery), getDocs(appointmentsQuery)]);

        const tasksData = tasksSnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().name,
          start: new Date(doc.data().dueDate + 'T' + doc.data().dueTime),
          end: new Date(doc.data().dueDate + 'T' + doc.data().dueTime), // Adjust end time as needed
          type: 'task'
        }));

        const appointmentsData = appointmentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().appointmentFor,
          start: new Date(doc.data().date + 'T' + doc.data().startTime),
          end: new Date(doc.data().date + 'T' + doc.data().endTime),
          type: 'appointment'
        }));

        setEvents([...tasksData, ...appointmentsData]);
      }
    };

    fetchEvents();
  }, [user]);

  // Function to customize event styles
  const eventStyleGetter = (event) => {
  let backgroundColor = event.type === 'task' ? 'blue' : 'green';
  return {
    style: {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      padding: '5px',
      textAlign: 'left',
    },
  };
};

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Calendar</Typography>
        <Button variant="contained" color="primary">
          Add Event
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Categories</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Tasks" sx={{ color: 'blue' }} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Appointments" sx={{ color: 'green' }} />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={9}>
          <Paper sx={{ height: '70vh' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              views={['month', 'week', 'day']}
              defaultView="week"
              selectable
              eventPropGetter={eventStyleGetter} // Apply custom event style
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CalendarPage;