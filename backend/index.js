import express from 'express' ;
import path from 'path';

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(path.resolve(), 'dist')));

app.get('/api', (_request, response) => {
  response.send({ hello: 'World' })
})

app.listen(port, () => {
  console.log(`Redo på http://localhost:${port}/`)
})