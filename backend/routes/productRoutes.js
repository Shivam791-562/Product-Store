import expres from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  getAllProductsForAnalytics,
} from "../controllers/productController.js";

const router = expres.Router();

router.get("/analytics/all", getAllProductsForAnalytics);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
