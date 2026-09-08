import argon2 from 'argon2';
import prisma from '../config/db.js';
import { sendInstructorWelcomeEmail } from '../services/emailService.js';
import { validateInstructorCreationInput } from '../validators/authValidators.js';

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4,
};

/**
 * Admin: Create an Instructor account (Cannot be created publicly)
 */
export const createInstructor = async (req, res) => {
  try {
    const { isValid, errors, data } = validateInstructorCreationInput(req.body);
    if (!isValid) {
      return res.status(400).json({ success: false, error: errors[0], errors });
    }

    const { name, email, password } = data;

    // Check if email is in use
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.',
      });
    }

    // Default or provided password
    const instructorPassword = password || `QuantumInst@${Math.floor(1000 + Math.random() * 9000)}!`;
    const passwordHash = await argon2.hash(instructorPassword, ARGON2_OPTIONS);

    const instructor = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'INSTRUCTOR',
        isEmailVerified: true, // Pre-verified by Admin
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    // Send credentials notification email via Resend
    await sendInstructorWelcomeEmail(instructor.email, instructor.name, instructorPassword);

    return res.status(201).json({
      success: true,
      message: `Instructor account created for ${instructor.name}. Welcome credentials dispatched via email.`,
      data: {
        instructor,
        initialPassword: instructorPassword, // Returned to admin in response for immediate sharing if desired
      },
    });
  } catch (error) {
    console.error('Error creating instructor:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to create instructor account.',
    });
  }
};

/**
 * Admin: List all platform users with role filter
 */
export const listUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const where = {};
    if (role && ['LEARNER', 'RESEARCHER', 'INSTRUCTOR', 'ADMIN'].includes(role.toUpperCase())) {
      where.role = role.toUpperCase();
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({
      success: true,
      data: {
        users,
        total: users.length,
      },
    });
  } catch (error) {
    console.error('Error listing users:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve user directory.',
    });
  }
};

/**
 * Admin: Update User Role (e.g. promote researcher, update status)
 */
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ['LEARNER', 'RESEARCHER', 'INSTRUCTOR', 'ADMIN'];
    if (!role || !validRoles.includes(role.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid role. Allowed roles: ${validRoles.join(', ')}`,
      });
    }

    // Protect against self-demotion if the admin is modifying their own account
    if (req.user.id === userId && role.toUpperCase() !== 'ADMIN') {
      return res.status(400).json({
        success: false,
        error: 'Administrators cannot demote their own account.',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: role.toUpperCase() },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isEmailVerified: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: `User ${updatedUser.name} role updated to ${updatedUser.role}.`,
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to update user role.',
    });
  }
};
