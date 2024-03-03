import { hashPassword, comparePassword } from '../helpers/bcrypt.js';
import { createToken } from '../helpers/jwt.js';
import User from '../models/user.model.js';

export const registerController = async (req, res) => {
  try {
    const { username, password, name, lastName } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      lastName,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    
    const isPasswordCorrect = await comparePassword(password, user.password);
    
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const loggedUser = {
      uid: user._id,
      name: user.name,
      lastName: user.lastName,
      username: user.username,
    };
    
    const token = await createToken(loggedUser);

    return res.json({ message: 'Login successful', token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateController = async (req, res) => {
  try {
    const { name, lastName, username } = req.body;

    const existingUser = await User.findOne({ username });

    if (
      existingUser &&
      existingUser._id.toString() !== req.user._id.toString()
    ) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = req.user;
    user.name = name;
    user.lastName = lastName;

    if (username) {
      user.username = username;
    }

    await user.save();

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const updatePasswordController = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;

    const isPasswordCorrect = await comparePassword(oldPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    res.json({ message: 'Password updated' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

