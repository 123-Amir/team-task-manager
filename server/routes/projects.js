const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');
const { requireProjectMember, requireProjectAdmin } = require('../middleware/role');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/projects - Create a new project
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.userId;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Create project with user as creator
    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        createdBy: userId
      }
    });

    // Add user as ADMIN member
    await prisma.projectMember.create({
      data: {
        role: 'ADMIN',
        userId,
        projectId: project.id
      }
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/projects - Get all projects where user is a member
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId
          }
        }
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        },
        tasks: {
          select: { id: true, status: true }
        }
      }
    });

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/projects/:id - Get single project with members and tasks
router.get('/:id', requireAuth, requireProjectMember, async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Add current user's role
    const userMember = project.members.find(m => m.userId === req.user.userId);
    const currentUserRole = userMember ? userMember.role : null;

    res.json({ ...project, currentUserRole });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/projects/:id/members - Add member to project
router.post('/:id/members', requireAuth, requireProjectAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ error: 'userId and role are required' });
    }

    if (!['ADMIN', 'MEMBER'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Check if user already exists in project
    const existing = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId: id
        }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'User already a member of this project' });
    }

    // Add member
    const member = await prisma.projectMember.create({
      data: {
        role,
        userId,
        projectId: id
      }
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true }
    });

    res.status(201).json({ ...member, user });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/projects/:id/members - Get all members of a project
router.get('/:id/members', requireAuth, requireProjectMember, async (req, res) => {
  try {
    const { id } = req.params;

    const members = await prisma.projectMember.findMany({
      where: { projectId: id },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    res.json(members);
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
