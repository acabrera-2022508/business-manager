import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import connection from './database/mongo.js';
import 'dotenv/config';

// Helpers
import { hashPassword } from './helpers/bcrypt.js';

// Routes
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';

// Models
import User from './models/user.model.js';
import Category from './models/category.model.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

// Routes
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);

// Start server
connection()
  .then(async () => {
    const users = await User.find({});
    const categories = await Category.find({});

    if (users.length === 0) {
      const user = new User({
        name: 'admin',
        lastName: 'admin',
        username: 'admin',
        password: await hashPassword('admin'),
      });

      await user.save();
    }

    if (categories.length === 0) {
      const category = new Category({
        name: 'Default',
      });

      await category.save();
    }
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server on port ${process.env.PORT}`);
    });
  });
