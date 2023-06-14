import { Router } from "express";
import authRoutes from "./auth"
import couponRoutes from "./coupon";
import collectionRoutes from "./collection"


const router = Router()
router.use("/auth", authRoutes)
router.use("/coupon", couponRoutes)
router.use("/collection", collectionRoutes)


export default router;