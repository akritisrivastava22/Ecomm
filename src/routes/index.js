import { Router } from "express";
import authRoutes from "./auth"
// import couponRoutes from "."
// import collectionRoutes from "./collection.route.js"

const router = Router()
router.use("/auth", authRoutes)


export default router;