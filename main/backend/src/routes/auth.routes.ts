import { Router } from 'express';
import { googleSignup, googleLogin } from '../controllers/auth.controller';

const router = Router();

router.post('/signup', googleSignup);
router.post('/login', googleLogin);

export default router;
