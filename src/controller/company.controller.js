import Company from '../models/company.model.js';
import Category from '../models/category.model.js';
import exceljs from 'exceljs';

export const createCompany = async (req, res) => {
  try {
    const { name, description, levelImpact, yearsExperience, category } =
      req.body;

    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({ error: 'Company already exists' });
    }

    const existingCategory = await Category.findOne({ name: category });
    if (!existingCategory) {
      return res.status(400).json({
        error: 'Category does not exist',
        categories: await Category.find({}).select('-_id'),
      });
    }

    const newCompany = new Company({
      name,
      description,
      levelImpact,
      yearsExperience,
      category: existingCategory._id,
    });

    await newCompany.save();

    return res.status(201).json(newCompany);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({}).populate({
      path: 'category',
      select: 'name -_id',
    });

    return res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCompaniesByYearsExperience = async (req, res) => {
  try {
    const { years } = req.params;
    const companies = await Company.find({ yearsExperience: years });

    return res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCompaniesByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(400).json({ error: 'Category does not exist' });
    }

    const companies = await Company.find({ category: category._id }).populate({
      path: 'category',
      select: 'name -_id',
    });

    return res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCompaniesSortedAZ = async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCompaniesSortedZA = async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: -1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, levelImpact, yearsExperience, category } =
      req.body;

    const existingCompany = await Company.findById(id);

    if (!existingCompany) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const existingCategory = await Category.findOne({ name: category });
    if (!existingCategory) {
      return res.status(400).json({ error: 'Category does not exist' });
    }

    existingCompany.name = name;
    existingCompany.description = description;
    existingCompany.levelImpact = levelImpact;
    existingCompany.yearsExperience = yearsExperience;
    existingCompany.category = existingCategory._id;

    await existingCompany.save();

    return res.json({
      message: 'Company updated succesfully',
      companyUpdated: existingCompany,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const generateExcelReport = async (req, res) => {
  try {
    const companies = await Company.find({}).populate({
      path: 'category',
      select: 'name -_id',
    });

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Companies');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Level Impact', key: 'levelImpact', width: 30 },
      { header: 'Years Experience', key: 'yearsExperience', width: 30 },
      { header: 'Category', key: 'category', width: 30 },
    ];

    companies.forEach((company) => {
      worksheet.addRow({
        name: company.name,
        description: company.description,
        levelImpact: company.levelImpact,
        yearsExperience: company.yearsExperience,
        category: company.category.name,
      });
    });

    await workbook.xlsx.writeFile('companies.xlsx');

    return res.download('companies.xlsx');
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};