import express from 'express' ;
import path from 'path';
import { Client } from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const client = new Client({
  connectionString: process.env.PGURI,
});

client.connect();

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.static(path.join(path.resolve(), 'dist')));


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






app.listen(port, () => {
  console.log(`Redo på http://localhost:${port}/`)
})
