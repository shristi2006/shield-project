import { Router } from "express";
import { googleSignup, googleLogin } from "../controllers/googleAuth.controller";
import { localSignup, localLogin } from "../controllers/localAuth.controller";

const router = Router();

router.post("/google/signup", googleSignup);
router.post("/google/login", googleLogin);

router.post("/local/signup", localSignup);
router.post("/local/login", localLogin);

export default router;
