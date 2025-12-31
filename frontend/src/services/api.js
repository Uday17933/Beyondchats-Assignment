import axios from "axios";

const API = axios.create({
  baseURL: "https://beyondchats-assignment-iyj4.onrender.com/api",
});

export const fetchUpdatedArticles = () => API.get("/articles/updated");
