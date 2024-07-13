require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const userRoutes = require('./routes/users');
const emailRoutes = require('./routes/email');

const app = express();
const port = process.env.PORT || 3005;

app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: true }));

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/users', userRoutes);
app.use('/email', emailRoutes);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
