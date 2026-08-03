import 'dotenv/config';

import express from 'express';
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/health', (req, res) => {
  res.send({status: 'ok'});
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});