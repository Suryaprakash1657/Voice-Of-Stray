import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] Voice of Stray API listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
