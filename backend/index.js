require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./src/routes/auth');
const leadsRoutes = require('./src/routes/leads');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);

app.get('/', (req, res) => res.send('Erino Lead Management Backend'));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
