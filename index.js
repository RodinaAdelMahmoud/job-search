
import dotenv from "dotenv"
import path from "path";
dotenv.config({path: path.resolve("./config/.env") });
import express from 'express'
import { initApp } from './src/initApp.js'
import connectionDB from './db/connectionDB.js'
const app = express()

connectionDB()
initApp(app,express)