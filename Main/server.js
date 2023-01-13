require('dotenv').config()
const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: PROCESS.ENV.DB_USER,
      // TODO: Add MySQL password here
      password: process.env.DB_PASSWORD,
      database: PROCESS.ENV.DB_NAME,
    },
    console.log(`Connected to the employe_db database.`)
  );