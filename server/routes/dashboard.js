const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/dashboard/summary - Get dashboard summary for current user
router.get('/summary', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all projects where user is a member
    const userProjects = await prisma.projectMember.findMany({
      where: { userId },
      select: { projectId: true }
    });

    const projectIds = userProjects.map(p => p.projectId);

    if (projectIds.length === 0) {
      return res.json({
        totalTasks: 0,
        byStatus: {
          TODO: 0,
          IN_PROGRESS: 0,
          DONE: 0
        },
        overdueTasks: 0
      });
    }

    // Get all tasks in these projects
    const tasks = await prisma.task.findMany({
      where: {
        projectId: {
          in: projectIds
        }
      }
    });

    const totalTasks = tasks.length;
    
    const byStatus = {
      TODO: tasks.filter(t => t.status === 'TODO').length,
      IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS').length,
      DONE: tasks.filter(t => t.status === 'DONE').length
    };

    const now = new Date();
    const overdueTasks = tasks.filter(
      t => t.dueDate && t.dueDate < now && t.status !== 'DONE'
    ).length;

    res.json({
      totalTasks,
      byStatus,
      overdueTasks
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
