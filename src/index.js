import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import connection from './database/mongo.js';
import User from './models/user.model.js';
import 'dotenv/config';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

// Routes

// Start server
connection()
  .then(async () => {
    const users = await User.find({});

    if (users.length === 0) {
      const user = new User({
        name: 'admin',
        lastName: 'admin',
        username: 'admin',
        password: 'admin',
      });

      await user.save();
    }
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server on port ${process.env.PORT}`);
    });
  });
