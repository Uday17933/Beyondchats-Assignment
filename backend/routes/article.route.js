import express from "express";
import {
  createArticle,
  deleteArticle,
  getArticleById,
  getOldestArticles,
  updateArticle,
  getAllArticles,
  getUpdatedArticles,
} from "../controllers/article.controller.js";

const router = express.Router();

router.post("/", createArticle);
router.get("/updated", getUpdatedArticles);
router.get("/", getAllArticles);
router.get("/oldest", getOldestArticles);
router.get("/:id", getArticleById);
router.put("/:id", updateArticle);
router.delete("/:id", deleteArticle);

export default router;
