# API Reference

This document outlines the API endpoints that are actively used by the frontend application.

## Authentication
**Base URL**: `{{base_url}}/api/v1`

### Login
- **Endpoint**: `POST /auth/login`
- **Body**:
  ```json
  {
      "email": "user@example.com",
      "password": "password"
  }
  ```
- **Response**: Returns a JWT token and user details.

### Forgot Password
- **Endpoint**: `POST /forgot-password`
- **Body**:
  ```json
  {
      "email": "user@example.com"
  }
  ```

---

## User Management
**Prefix**: `/user`

| Method | Endpoint | Description | Body Params |
| :--- | :--- | :--- | :--- |
| `POST` | `/create-user` | Create a new user (Admin only) | `name`, `email`, `password`, `role`, `allotedFacilities` |
| `GET` | `/get-all-users` | List all users | - |
| `POST` | `/update-user` | Update user details | `id`, `name`, `email`, `role`, `allotedFacilities` |
| `POST` | `/delete-user` | Delete a user | `id` |
| `POST` | `/change-user-password` | Change own password | `currentPassword`, `newPassword` |

---

## Shipment & Orders
**Prefix**: `/shipment`

### Create Shipments
- **Bulk Create**: `POST /create-bulk-shipments`
  - **Body**: `{ "data": [ { ...order_details } ] }`
  - Creates multiple shipment orders grouped by PO Number.

### Retrieve Data (Filtered)
The application uses a filter-based approach for fetching data.

#### Get Shipments
- **Endpoint**: `POST /get-shipment`
- **Query Params**: `page`, `limit`
- **Body**:
  ```json
  {
      "filters": {
          "poDateFrom": "YYYY-MM-DD",
          "poDateTo": "YYYY-MM-DD",
          "statusPlanning": ["Confirmed", ...],
          // ...other filters
      }
  }
  ```

#### Get SKUs
- **Endpoint**: `POST /get-sku`
- **Query Params**: `page`, `limit`
- **Body**:
    ```json
    {
        "filters": {
            "skuCode": "...",
            "brand": ["..."],
            // ...other filters
        }
    }
    ```

### Shipment Operations
| Method | Endpoint | Description | Body Params |
| :--- | :--- | :--- | :--- |
| `POST` | `/update-shipment` | Update single shipment | `uid`, `...fields_to_update` |
| `POST` | `/get-skus-by-shipment` | Get SKUs for a shipment | `uid` |
| `POST` | `/delete-shipment` | Delete a shipment | `uid` |
| `POST` | `/delete-sku` | Delete a specific SKU | `id` |
| `GET` | `/get-filter-options` | Get available filter values | - |
| `GET` | `/get-upload-url` | Get S3 signed URL for upload | `fileName`, `fileType` |

---

## Master Data
**Prefix**: `/master/:type`
**Supported Types**: `channel`, `facility`, `courier-partner`, `status`, `courier-rates`, `appointment-remarks`, `sku`

| Method | Endpoint | Description | Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/:type` | Get all entries for a type | - |
| `GET` | `/:type/search` | Search/Filter master data | Query params (e.g. `?skuCode=...` or `?channel=...`) |
| `POST` | `/:type/upload` | Bulk upload/replace data | Body: `{ "data": [...] }` |
| `POST` | `/:type/delete` | Clear all data for a type | - |
