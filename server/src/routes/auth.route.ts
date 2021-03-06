import { Router } from "express";
import {
  signup,
  login,
  verifyGoogle,
  authGoogle,
  succeedAuthGoogle,
} from "../controllers";
import { validateSignup } from "../validations";

const router = Router();

router.route("/auth/signup").post(validateSignup, signup);
router.route("/auth/login").post(login);
router.route("/auth/google").get(verifyGoogle);
router.route("/auth/google/callback").get(authGoogle, succeedAuthGoogle);

export default router;
