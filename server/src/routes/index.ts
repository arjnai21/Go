import { Router } from 'express';
// import UserRouter from './Users';
import testAPI from './testApi'

// Init router and path
const router = Router();

// router = testAPI;
// Add sub-routes
// router.use('/users', UserRouter);
router.use("/testAPI", testAPI);

// router.use("/", (req, res) => {
//     res.json({"we": "here now"});
// })


router.use("/test", (req, res) => {
    res.json({
        "this": "is a test"
    });
})

// Export the base-router
export default router;
