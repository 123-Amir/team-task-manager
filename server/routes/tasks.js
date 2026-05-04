const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');
const { requireProjectMember, requireProjectAdmin } = require('../middleware/role');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/projects/:projectId/tasks - Create a new task
router.post('/projects/:projectId/tasks', requireAuth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, dueDate, assigneeId } = req.body;
    const userId = req.user.userId;

    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    // Check if user is a member of the project
    const member = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId
        }
      }
    });

    if (!member) {
      return res.status(403).json({ error: 'Access denied: Not a member of this project' });
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId: assigneeId || null,
        projectId
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } }
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/projects/:projectId/tasks - Get all tasks for a project
router.get('/projects/:projectId/tasks', requireAuth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    // Check if user is a member of the project
    const member = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId
        }
      }
    });

    if (!member) {
      return res.status(403).json({ error: 'Access denied: Not a member of this project' });
    }

    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/tasks/:id - Update a task
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate, assigneeId } = req.body;
    const userId = req.user.userId;

    // Get the task and its project
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check authorization: user must be ADMIN of project or assignee of task
    const member = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId: task.projectId
        }
      }
    });

    if (!member) {
      return res.status(403).json({ error: 'Access denied: Not a member of this project' });
    }

    const isAdmin = member.role === 'ADMIN';
    const isAssignee = task.assigneeId === userId;

    if (!isAdmin && !isAssignee) {
      return res.status(403).json({ error: 'Access denied: Not authorized to update this task' });
    }

    // Validate status
    if (status && !['TODO', 'IN_PROGRESS', 'DONE'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description: description || null }),
        ...(status && { status }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(isAdmin && assigneeId !== undefined && { assigneeId: assigneeId || null })
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } }
      }
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
