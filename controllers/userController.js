// controllers/userController.js

const { User } = require("../models");
const { Op } = require("sequelize");

// GET all users with pagination, filtering, search, and sorting
exports.getAllUsers = async (req, res) => {
  try {
    const {
      limit = 10,
      offset = 0,
      filter,
      search,
      sortKey = "createdAt",
      sortOrder = "ASC",
    } = req.query;

    const where = {};
    if (filter) {
      where.enabled = filter === "enabled";
    }
    if (search) {
      where.userName = { [Op.like]: `%${search}%` };
    }

    const users = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortKey, sortOrder.toUpperCase()]],
    });

    res.status(200).json({
      totalItems: users.count,
      totalPages: Math.ceil(users.count / limit),
      currentPage: Math.ceil(offset / limit) + 1,
      users: users.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET a specific user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST a new user
exports.createUser = async (req, res) => {
  try {
    const { permalink, userName, email, password, enabled } = req.body;
    const newUser = await User.create({
      permalink,
      userName,
      email,
      password,
      enabled,
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT (update) an existing user
exports.updateUser = async (req, res) => {
  try {
    const { permalink, userName, email, password, enabled, deleted } = req.body;
    const [updated] = await User.update(
      { permalink, userName, email, password, enabled, deleted },
      { where: { id: req.params.id } }
    );
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH (partially update) an existing user
exports.partialUpdateUser = async (req, res) => {
  try {
    const [updated] = await User.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE a user
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
