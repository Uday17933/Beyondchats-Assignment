# BeyondChats – Full Stack Web Developer Intern Assignment

## Overview

This project is a full-stack application built for the BeyondChats internship assignment.

The application scrapes the oldest blog articles from BeyondChats, stores them in a database, updates the content using AI based on reference articles, and displays both original and updated articles in a React frontend.

---

## Tech Stack

- Backend: Node.js, Express, MongoDB
- Frontend: React (Vite)
- Scraping: Axios, Cheerio
- AI: OpenAI API
- Search: SerpAPI

---

## Features

- Scrape 5 oldest BeyondChats blog articles
- Store articles in MongoDB
- CRUD APIs for articles
- Fetch reference articles from the web
- Rewrite articles using AI (with fallback handling)
- Publish updated articles
- Display original and updated articles in a responsive UI

---

## How to Run

### Backend

```bash
cd backend
npm install
npm start
```
