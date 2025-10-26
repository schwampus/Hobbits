import express from 'express' ;
import path from 'path';
import { Client } from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';

dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});

client.connect();

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-temporary-secure-secret-key';



app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://hobbits.onrender.com',
      'http://localhost:3000' 
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())
app.use(express.static(path.join(path.resolve(), 'dist')));

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Received token:', token); // Debug: Log token
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded JWT:', decoded); // Debug: Log decoded payload
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message); // Debug: Log error details
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

app.get('/api', async (_request, response) => {
  const {rows} = await client.query(
    'SELECT username FROM users',
  )
  response.send(rows)
})

app.post('/login', async (req, res) => {
  const {username, userpass} = req.body;
  console.log('Received:', { username, userpass });
    try {
      const {rows} = await client.query(
      'SELECT * FROM users WHERE username = $1 AND userpass= $2',
      [username,userpass] );
    
    console.log('Query result:', rows);

        if (rows.length > 0) {
            res.json({ success: true, message: 'Login successful!' });
        } 
          else {
            res.status(401).json({ success: false, message: 'Wrong name or password' });
          }
    } catch (error) {
      console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });  
      }
});

app.post('/signup', async (req, res) =>   {   
  const {username, userpass} = req.body;
  console.log('Received signup query:', {username,userpass});
    try {
      const {rows} = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      if (rows.length > 0) {
        return res.status(400).json({ success: false, message: 'That Hobbit already exists'})
      };
    
    await client.query(' INSERT INTO users (username, userpass) VALUES ($1, $2)', [username, userpass]);
    res.json({ success: true, message: 'Hobbit created!' });
    } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/user', authenticateToken, async (req, res) => {
     try {
       const { rows: userRows } = await client.query('SELECT username, bits FROM users WHERE user_id = $1', [
         req.user.user_id,
       ]);
       if (userRows.length === 0) {
         return res.status(404).json({ success: false, message: 'User not found' });
       }
       const { rows: hobbyRows } = await client.query('SELECT hobby_id, hobby, times_done FROM hobbies WHERE user_id = $1', [
         req.user.user_id,
       ]);
       res.json({
         success: true,
         username: userRows[0].username,
         bits: userRows[0].bits,
         hobbies: hobbyRows.map(row => ({ hobby_id: row.hobby_id, hobby: row.hobby, times_done: row.times_done })),
       });
     } catch (error) {
       console.error('Error fetching user:', error);
       res.status(500).json({ success: false, message: 'Server error' });
     }
   });

   app.post('/hobbies', authenticateToken, async (req, res) => {
  const { hobby } = req.body;
  if (!hobby || typeof hobby !== 'string' || hobby.length > 60) {
    return res.status(400).json({ success: false, message: 'Invalid hobby' });
  }
  try {
    const { rows } = await client.query(
      'INSERT INTO hobbies (user_id, hobby, times_done) VALUES ($1, $2, $3) RETURNING hobby_id',
      [req.user.user_id, hobby, 0]
    );
    res.json({ success: true, message: 'Hobby added successfully', hobby_id: rows[0].hobby_id });
  } catch (error) {
    console.error('Error adding hobby:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/hobbies/:hobby_id/increment', authenticateToken, async (req, res) => {
  const { hobby_id } = req.params;
  try {
    const { rows } = await client.query(
      'UPDATE hobbies SET times_done = times_done + 1 WHERE hobby_id = $1 AND user_id = $2 RETURNING times_done',
      [hobby_id, req.user.user_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Hobby not found or not owned by user' });
    }
    res.json({ success: true, message: 'Hobby count incremented', times_done: rows[0].times_done });
  } catch (error) {
    console.error('Error incrementing hobby count:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


app.listen(port, () => {
  console.log(`Redo på http://localhost:${port}/`)
})
