const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router
  .route('/')
  .get(getTasks)
  .post(
    [
      body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title cannot exceed 100 characters'),
      body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),
      body('status')
        .optional()
        .isIn(['To Do', 'In Progress', 'Done'])
        .withMessage('Status must be To Do, In Progress, or Done'),
      body('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High'])
        .withMessage('Priority must be Low, Medium, or High'),
      body('dueDate')
        .optional({ nullable: true })
        .isISO8601()
        .withMessage('Due date must be a valid date'),
    ],
    createTask
  );

router
  .route('/:id')
  .get(getTask)
  .put(
    [
      body('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Title cannot be empty')
        .isLength({ max: 100 })
        .withMessage('Title cannot exceed 100 characters'),
      body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),
      body('status')
        .optional()
        .isIn(['To Do', 'In Progress', 'Done'])
        .withMessage('Status must be To Do, In Progress, or Done'),
      body('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High'])
        .withMessage('Priority must be Low, Medium, or High'),
      body('dueDate')
        .optional({ nullable: true })
        .isISO8601()
        .withMessage('Due date must be a valid date'),
    ],
    updateTask
  )
  .delete(deleteTask);

module.exports = router;
