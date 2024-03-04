import Category from '../models/category.model.js';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});

    return res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const newCategory = new Category({ name });

    await newCategory.save();

    return res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const existingCategory = await Category.findOne({ name });
    
    if (existingCategory && existingCategory._id.toString() !== req.params.id) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    category.name = name;

    await category.save();

    return res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await Category.findByIdAndDelete(req.params.id);
    
    return res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
