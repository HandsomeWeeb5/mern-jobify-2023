import { Router } from "express";
const router = Router();

import {
  getAllJobs,
  getSingleJob,
  createJob,
  updateSingleJob,
  deleteSingleJob,
  showStats
} from "../controllers/job.controller.js";

import {
  validateIdParam,
  validateJobInput,
} from "../middleware/validationMiddleware.js";
import { checkForTestUser } from "../middleware/authMiddleware.js";

router.route("/")
  .get(getAllJobs)
  .post(checkForTestUser, validateJobInput, createJob);
router.route('/stats').get(showStats);
router
  .route("/:id")
  .get(validateIdParam, getSingleJob)
  .patch(checkForTestUser, validateJobInput, validateIdParam, updateSingleJob)
  .delete(checkForTestUser, validateIdParam, deleteSingleJob);

export default router;
