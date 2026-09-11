import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createProjectSchema, updateProjectSchema, addMemberSchema } from '../validators/project.validator';

const router = Router();

router.use(authenticate); // all project routes require login

router.post('/', validate(createProjectSchema), projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);
router.patch('/:id', validate(updateProjectSchema), projectController.updateProject);
router.patch('/:id/archive', projectController.archiveProject);
router.post('/:id/members', validate(addMemberSchema), projectController.addMember);

export default router;