# Workflows & Data Flow

## High-Level Data Flow

```mermaid
graph LR
    User[User / Client] -- HTTPS / JSON --> FE[Next.js Frontend]
    FE -- Axios API Calls --> BE[Node.js Backend]
    BE -- Sequelize ORM --> DB[(MySQL Database)]
    BE -- Signed URL --> S3[AWS S3]
    User -- File Upload --> S3
```

## Shipment Lifecycle
The core of the CMS is managing Shipments through various stages.

```mermaid
stateDiagram-v2
    [*] --> Planning: Order Created / Ingested
    Planning --> Warehouse: Confirmed by Planning Team
    Warehouse --> Logistics: Processed & Packed
    Logistics --> Delivered: Dispatched & Tracking
    Delivered --> [*]

    state Planning {
        [*] --> Draft
        Draft --> Confirmed
    }
    
    state Warehouse {
        [*] --> Pending
        Pending --> Packed
    }
```

## Role-Based Access Control (RBAC) Workflow
The backend enforces access control via Middleware.

```mermaid
sequenceDiagram
    participant Client
    participant Middleware
    participant Controller
    
    Client->>Middleware: Request + Bearer Token
    Middleware->>Middleware: Verify JWT
    alt Valid Token
        Middleware->>Middleware: Check Role (e.g. Admin, Warehouse)
        alt Authorized
            Middleware->>Controller: Pass Request
            Controller->>Client: Response
        else Unauthorized
            Middleware->>Client: 403 Forbidden
        end
    else Invalid Token
        Middleware->>Client: 401 Unauthorized
    end
```

## CSV Import/Export Process
1. **Import**: User uploads a file. The frontend requests a pre-signed S3 URL. User uploads directly to S3. Backend is notified to process the file from S3 (or direct payload if small).
2. **Export**: User requests download. Backend generates a CSV (often using streams or temporary files), uploads to S3, and returns a signed URL for the frontend to download.
