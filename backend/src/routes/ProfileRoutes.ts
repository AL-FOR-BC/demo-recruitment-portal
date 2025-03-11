import { Router } from "express";
import { CreateProfile, GetUserProfile, UpdateProfile } from "../controllers";
import { Authenticate } from "../middlewares/CommonAuth";

const router = Router();

router.use(Authenticate);
router.post("/createprofile", CreateProfile);
router.patch("/updateprofile", UpdateProfile);
router.get("/profile", GetUserProfile);


export { router as ProfileRoutes };