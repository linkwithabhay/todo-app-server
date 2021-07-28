import express from "express";

import { revalidate, signin, signup, updateuser } from "../controllers/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/revalidate", auth, revalidate);
router.patch("/updateuser", auth, updateuser);

export default router;
