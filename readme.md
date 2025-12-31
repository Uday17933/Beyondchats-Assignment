# BeyondChats – Full Stack Web Developer Intern Assignment

## Overview

This project is a full-stack application built for the BeyondChats internship assignment.

The application scrapes the oldest blog articles from BeyondChats, stores them in a database, updates the content using AI based on reference articles, and displays both original and updated articles in a React frontend.

---

## Tech Stack

- Frontend: React (Vite), Axios
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Web Scraping: Axios, Cheerio, Puppeteer
- AI Integration: OpenAI API
- Deployment:
  - Frontend: Vercel
  - Backend: Render

---

## Architecture / Data Flow

1. Scraper script fetches oldest articles from BeyondChats blog.
2. Articles are stored in MongoDB via backend APIs.
3. Phase 2 script:
   - Fetches articles from backend API
   - Searches reference articles on the web
   - Scrapes reference content
   - Uses OpenAI API to rewrite the article
   - Stores updated article using backend API
4. Frontend fetches articles from backend and displays:
   - Original articles
   - Updated (AI-generated) articles

---

## How to Run

## Local Setup Instructions

### Backend Setup

1. Navigate to backend folder:
   
cd backend
npm install
MONGO_URI=your_mongodb_uri
OPENAI_API_KEY=your_openai_api_key
npm start

### Frontend Setup

1. Navigate to frontend folder:

cd frontend
npm install
npm run dev

## Live Links

- Frontend (Vercel): https://beyondchats-assignment-black.vercel.app/
- Backend (Render): https://beyondchats-assignment-iyj4.onrender.com

## Deployment

- Frontend deployed on Vercel
- Backend deployed on Render
- MongoDB hosted on MongoDB Atlas

## Architecture / Data Flow Diagram

User (Browser)
|
v
Frontend (React - Vercel)
|
| HTTP Requests (Axios)
v
Backend API (Node.js + Express - Render)
|
| Mongoose ODM
v
MongoDB Atlas
^
|
Phase 1 Script (Web Scraper - Cheerio/Axios)
|
v
BeyondChats Blog Website

Phase 2 Script (AI Rewrite Pipeline)
|
| Fetch Articles from Backend
| Search & Scrape Reference Articles
| Call OpenAI API
| Save Updated Articles via Backend API
v
MongoDB Atlas
