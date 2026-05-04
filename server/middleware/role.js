const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Check if user is a member of the project
const requireProjectMember = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.userId;

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

    req.projectMember = member;
    next();
  } catch (error) {
    console.error('Project member check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Check if user is an ADMIN of the project
const requireProjectAdmin = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.userId;

    const member = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId
        }
      }
    });

    if (!member || member.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied: Admin role required' });
    }

    req.projectMember = member;
    next();
  } catch (error) {
    console.error('Project admin check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { requireProjectMember, requireProjectAdmin };
