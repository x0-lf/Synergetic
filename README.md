# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# How2Run:

## 1. run xampp

``xampp-control``

## 2. backend server:

#### in /backend folder run:

``nodemon server.js``


## 3. frontend server:

#### in root folder of project run:

``vite`` or ``npm run dev:frontend``

## 4. Servers info for accessing data:

#### mysql runs on Port: ``3306``
#### nodemon runs on Port: ``5000``
#### vite(react) runs on Port: ``5173``

## 5. How to regenerate project files? (in case of vite cache of frontend webpages)

##  Vite regenerate ``npm run dev:frontend``
##  nodemon restart (manual) ``rs``


## 6. dependencies/requirements

#### ``npm install bcrypt jsonwebtoken express-validator``
#### ``npm install dotenv``

[//]: # (## running both servers &#40;frontend + backend&#41;:)

[//]: # ()
[//]: # (``add how2 and fix package.json``)