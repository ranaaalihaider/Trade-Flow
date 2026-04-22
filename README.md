# TradeFlow API Documentation & Examples

## Overview
TradeFlow is a complete REST API built with Node.js, Express, and MongoDB. It manages multi-business operations, inventory, stakeholders, accounting, and reporting.

## Setup Instructions
1. Navigate to `/backend`.
2. Ensure you have MongoDB running locally or update `MONGO_URI` in `.env`.
3. Run `npm install`.
4. Run `npm run dev` to start the server on `localhost:5000`.

5. Navigate to `/frontend`.
6. Run `npm install`.
7. Run `npm run dev` to start the React app.

---

## Example API Workflows (Postman Usage)

### 1. Authentication
**POST `/api/users/register`**
```json
{
  "name": "Super Admin",
  "email": "admin@tradeflow.com",
  "password": "password123",
  "role": "SuperAdmin"
}
```
*Response includes a JWT Token. Put this token in the `Authorization: Bearer <token>` header for all subsequent requests.*

### 2. Business Management
**POST `/api/businesses`** (Requires SuperAdmin Token)
```json
{
  "name": "Tech Corp",
  "address": "123 Tech Lane",
  "contactPhone": "555-1234"
}
```
*Note the returned Business ID.*

### 3. Setup Employees
**POST `/api/users/register`**
```json
{
  "name": "John Manager",
  "email": "john@techcorp.com",
  "password": "password123",
  "role": "Manager",
  "businessId": "<Business_ID_From_Step_2>"
}
```
*Now login as John using `/api/users/login` to get his token.*

### 4. Setup Inventory
**POST `/api/companies`**
```json
{
  "name": "Samsung",
  "description": "Electronics"
}
```
**POST `/api/categories`**
```json
{
  "name": "Smartphones",
  "companyId": "<Samsung_ID>"
}
```
**POST `/api/items`**
```json
{
  "name": "Galaxy S24",
  "companyId": "<Samsung_ID>",
  "categoryId": "<Smartphones_ID>",
  "units": {
    "carton": { "name": "Carton", "quantity": 1 },
    "box": { "name": "Box", "quantityPerCarton": 10 },
    "piece": { "name": "Piece", "quantityPerBox": 5 }
  },
  "prices": {
    "purchasePrice": 800,
    "sellingPriceCarton": 45000,
    "sellingPriceBox": 4500,
    "sellingPricePiece": 900
  }
}
```

### 5. Add Stakeholders
**POST `/api/suppliers`**
```json
{
  "name": "Global Tech Distributors",
  "contactPhone": "555-9999",
  "openingBalance": 0
}
```

**POST `/api/customers`**
```json
{
  "name": "Local Retailer",
  "contactPhone": "555-8888",
  "openingBalance": 0
}
```

### 6. Execute a Purchase
**POST `/api/purchases`**
```json
{
  "supplierId": "<Supplier_ID>",
  "invoiceNumber": "INV-P-001",
  "items": [
    {
      "itemId": "<Item_ID>",
      "unit": "Piece",
      "quantity": 100,
      "baseQuantity": 100,
      "price": 800,
      "total": 80000
    }
  ],
  "totalAmount": 80000
}
```
*Behind the scenes: Stock for Galaxy S24 increases by 100. Supplier Ledger is credited 80000.*

### 7. Execute a Sale
**POST `/api/sales`**
```json
{
  "customerId": "<Customer_ID>",
  "invoiceNumber": "INV-S-001",
  "items": [
    {
      "itemId": "<Item_ID>",
      "unit": "Piece",
      "quantity": 10,
      "baseQuantity": 10,
      "price": 900,
      "total": 9000
    }
  ],
  "totalAmount": 9000
}
```
*Behind the scenes: Stock for Galaxy S24 decreases by 10. Customer Ledger is debited 9000.*

### 8. View Reports
**GET `/api/reports/dashboard`** -> Shows total sales and purchases.
**GET `/api/reports/stock`** -> Shows all current stock quantities.
**GET `/api/reports/ledger/<Supplier_ID>`** -> Shows the purchase transaction credit.

## Postman API Screenshots

### All Categories
![All Categories](Post%20Man%20Api%20Screenshots/all%20categories.png)

### All Companies
![All Companies](Post%20Man%20Api%20Screenshots/all%20companies.png)

### All Customers
![All Customers](Post%20Man%20Api%20Screenshots/all%20customers.png)

### All Items
![All Items](Post%20Man%20Api%20Screenshots/all%20items.png)

### All Routes
![All Routes](Post%20Man%20Api%20Screenshots/all%20routes.png)

### All Sales
![All Sales](Post%20Man%20Api%20Screenshots/all%20sales.png)

### All Salesmans
![All Salesmans](Post%20Man%20Api%20Screenshots/all%20salesmans.png)

### All Sectors
![All Sectors](Post%20Man%20Api%20Screenshots/all%20sectors.png)

### Business
![Business](Post%20Man%20Api%20Screenshots/business.png)

### Super Admin Login
![Super Admin Login](Post%20Man%20Api%20Screenshots/super%20admin%20login.png)

### User Log In
![User Log In](Post%20Man%20Api%20Screenshots/user%20log%20in.png)

