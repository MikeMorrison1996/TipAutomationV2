# TipAutomationV2

TipAutomationV2 is a lightweight web application that calculates restaurant tip distribution based on employee hours worked.

The application allows managers to quickly enter employee names, track their hours, input the total tip pool, and automatically calculate how much each employee should receive.

## Features

- Simple and clean iOS-style user interface
- Automatic tip distribution based on hours worked
- Live calculation of tip amounts
- Save and review past tip sessions
- SQLite database for lightweight storage
- Built with Spring Boot

## Tech Stack

- Java
- Spring Boot
- SQLite
- HTML
- CSS
- JavaScript

## How It Works

1. Enter employee names and hours worked.
2. Input the total tips to distribute.
3. The application calculates each employee’s share using:
tipShare = (employeeHours / totalHours) × totalTips

4. Sessions can be saved and reviewed later.

## Author

Michael Morrison
