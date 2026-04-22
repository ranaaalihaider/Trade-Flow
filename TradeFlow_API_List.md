# TradeFlow API Documentation

This document lists all the backend APIs available in the TradeFlow System, formatted with full URLs for direct use in Postman.

> **Note:** The URLs below use `http://localhost:5000` assuming you are running the backend directly. If you are testing through the Vite frontend proxy, you can replace `5000` with `5173` (e.g., `http://localhost:5173/api/...`).
> 
> Most endpoints (except user login/register) require an Authentication token (Bearer Token) passed in the headers. You can obtain this token by logging in.

---

## 1. Authentication & Users
- **POST** `http://localhost:5000/api/users/register` - Register a new user (SuperAdmin, Admin, etc.)
- **POST** `http://localhost:5000/api/users/login` - Login to get the auth token
- **GET** `http://localhost:5000/api/users/profile` - Get logged-in user's profile
- **GET** `http://localhost:5000/api/users/` - Get all users (Requires Admin/SuperAdmin privileges)

## 2. Businesses
- **GET** `http://localhost:5000/api/businesses` - Get all businesses (SuperAdmin)
- **POST** `http://localhost:5000/api/businesses` - Create a new business (SuperAdmin)
- **GET** `http://localhost:5000/api/businesses/:id` - Get a specific business by ID
- **PUT** `http://localhost:5000/api/businesses/:id` - Update a specific business (Admin/SuperAdmin)
- **DELETE** `http://localhost:5000/api/businesses/:id` - Delete a specific business (SuperAdmin)

## 3. Companies
- **GET** `http://localhost:5000/api/companies` - Get all companies
- **POST** `http://localhost:5000/api/companies` - Create a new company
- **GET** `http://localhost:5000/api/companies/:id` - Get a specific company by ID
- **PUT** `http://localhost:5000/api/companies/:id` - Update a company
- **DELETE** `http://localhost:5000/api/companies/:id` - Delete a company

## 4. Categories
- **GET** `http://localhost:5000/api/categories` - Get all categories
- **POST** `http://localhost:5000/api/categories` - Create a new category
- **GET** `http://localhost:5000/api/categories/:id` - Get a specific category by ID
- **PUT** `http://localhost:5000/api/categories/:id` - Update a category
- **DELETE** `http://localhost:5000/api/categories/:id` - Delete a category

## 5. Items
- **GET** `http://localhost:5000/api/items` - Get all items
- **POST** `http://localhost:5000/api/items` - Create a new item
- **GET** `http://localhost:5000/api/items/:id` - Get a specific item by ID
- **PUT** `http://localhost:5000/api/items/:id` - Update an item
- **DELETE** `http://localhost:5000/api/items/:id` - Delete an item

## 6. Sectors
- **GET** `http://localhost:5000/api/sectors` - Get all sectors
- **POST** `http://localhost:5000/api/sectors` - Create a new sector
- **GET** `http://localhost:5000/api/sectors/:id` - Get a specific sector by ID
- **PUT** `http://localhost:5000/api/sectors/:id` - Update a sector
- **DELETE** `http://localhost:5000/api/sectors/:id` - Delete a sector

## 7. Routes / Areas
- **GET** `http://localhost:5000/api/routes` - Get all routes
- **POST** `http://localhost:5000/api/routes` - Create a new route
- **GET** `http://localhost:5000/api/routes/:id` - Get a specific route by ID
- **PUT** `http://localhost:5000/api/routes/:id` - Update a route
- **DELETE** `http://localhost:5000/api/routes/:id` - Delete a route

## 8. Salesmen
- **GET** `http://localhost:5000/api/salesmen` - Get all salesmen
- **POST** `http://localhost:5000/api/salesmen` - Create a new salesman
- **GET** `http://localhost:5000/api/salesmen/:id` - Get a specific salesman by ID
- **PUT** `http://localhost:5000/api/salesmen/:id` - Update a salesman
- **DELETE** `http://localhost:5000/api/salesmen/:id` - Delete a salesman

## 9. Suppliers
- **GET** `http://localhost:5000/api/suppliers` - Get all suppliers
- **POST** `http://localhost:5000/api/suppliers` - Create a new supplier
- **GET** `http://localhost:5000/api/suppliers/:id` - Get a specific supplier by ID
- **PUT** `http://localhost:5000/api/suppliers/:id` - Update a supplier
- **DELETE** `http://localhost:5000/api/suppliers/:id` - Delete a supplier

## 10. Customers
- **GET** `http://localhost:5000/api/customers` - Get all customers
- **POST** `http://localhost:5000/api/customers` - Create a new customer
- **GET** `http://localhost:5000/api/customers/:id` - Get a specific customer by ID
- **PUT** `http://localhost:5000/api/customers/:id` - Update a customer
- **DELETE** `http://localhost:5000/api/customers/:id` - Delete a customer

## 11. Accounts
- **GET** `http://localhost:5000/api/accounts` - Get all accounts
- **POST** `http://localhost:5000/api/accounts` - Create a new account
- **GET** `http://localhost:5000/api/accounts/:id` - Get a specific account by ID

## 12. Purchases
- **GET** `http://localhost:5000/api/purchases` - Get all purchases
- **POST** `http://localhost:5000/api/purchases` - Create a new purchase

## 13. Sales
- **GET** `http://localhost:5000/api/sales` - Get all sales
- **POST** `http://localhost:5000/api/sales` - Create a new sale

## 14. Stocks
- **GET** `http://localhost:5000/api/stocks` - Get all stock items

## 15. Reports & Dashboard
- **GET** `http://localhost:5000/api/reports/dashboard` - Get dashboard statistics
- **GET** `http://localhost:5000/api/reports/stock` - Get the comprehensive stock report
- **GET** `http://localhost:5000/api/reports/ledger/:accountId` - Get the ledger report for a specific account ID

---
**Tips for Postman Testing:**
1. Call `POST http://localhost:5000/api/users/login` with your credentials.
2. From the response, copy the `token`.
3. For subsequent requests, go to the **Authorization** tab in Postman, select **Bearer Token**, and paste your token.
4. Keep an eye on required `Business ID` context if your system architecture enforces it through headers or body.
