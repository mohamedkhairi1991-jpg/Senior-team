# Overview

Senior Team is a hospital coordination system designed to manage medical care within hospitals. The system provides a comprehensive platform for healthcare professionals to manage patients, record medical entries, share recommendations, and upload medical images. The application follows a multi-platform architecture with a Node.js/Express backend using Supabase as the database, complemented by React web and React Native mobile frontends.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture
The backend is built with Node.js and Express, using TypeScript for type safety. The server implements a RESTful API architecture with modular route handlers organized by functionality (auth, patients, entries, recommendations, images). The application uses JWT tokens for authentication and authorization, with role-based access control distinguishing between "resident" and "senior" medical staff roles.

Key architectural decisions:
- **Express.js Framework**: Chosen for its simplicity and extensive middleware ecosystem
- **TypeScript**: Provides type safety and better development experience
- **Modular Route Structure**: Separates concerns with dedicated route files for each entity type
- **JWT Authentication**: Stateless authentication suitable for distributed systems
- **Role-Based Authorization**: Implements hierarchical access control for medical staff

## Frontend Architecture
The system provides multiple client interfaces:

**Web Application (React + Vite)**:
- Single Page Application using React Router for navigation
- TypeScript for type safety
- Axios for HTTP client communication
- Protected routes requiring authentication
- Responsive design for desktop and tablet use

**Mobile Application (React Native + Expo)**:
- Cross-platform mobile app for iOS and Android
- Simple API integration for basic patient management
- Designed for point-of-care access by medical staff

## Data Architecture
The system uses Supabase (PostgreSQL) as the primary database with the following core entities:
- **Users**: Medical staff with role-based permissions
- **Patients**: Patient records with basic demographic information
- **Patient Entries**: Medical records categorized by type (history, examination, investigations, treatments)
- **Recommendations**: Senior staff recommendations for patient care
- **Images**: Medical images with file storage integration

## Security Architecture
- **Password Hashing**: Uses bcrypt for secure password storage
- **JWT Tokens**: Stateless authentication with configurable expiration
- **Role-Based Access**: Differentiates between resident and senior staff permissions
- **CORS Configuration**: Restricts cross-origin requests to authorized domains
- **Helmet Integration**: Applies security headers for web protection

## File Storage
Implements Supabase Storage for medical image management with:
- Patient-specific folder organization
- UUID-based file naming for uniqueness
- Public URL generation for image access
- Support for multiple image formats

# External Dependencies

## Primary Database
- **Supabase**: PostgreSQL database-as-a-service providing real-time capabilities, built-in authentication, and file storage
- **Supabase Storage**: Object storage service for medical images and documents

## Authentication & Security
- **bcrypt**: Password hashing library for secure credential storage
- **jsonwebtoken**: JWT implementation for stateless authentication
- **helmet**: Security middleware for Express applications
- **cors**: Cross-Origin Resource Sharing configuration

## Backend Dependencies
- **Express.js**: Web application framework for Node.js
- **multer**: Middleware for handling multipart/form-data (file uploads)
- **pino-http**: HTTP logging middleware for request/response tracking
- **uuid**: UUID generation for unique identifiers

## Frontend Dependencies
- **React**: User interface library for component-based architecture
- **React Router**: Client-side routing for single-page application navigation
- **Axios**: Promise-based HTTP client for API communication
- **Vite**: Build tool and development server for modern web applications

## Mobile Dependencies
- **Expo**: Development platform for React Native applications
- **React Native**: Framework for building native mobile applications using React

## Development Tools
- **TypeScript**: Static type checking for JavaScript
- **nodemon**: Development tool for automatic server restarts
- **ts-node**: TypeScript execution environment for Node.js