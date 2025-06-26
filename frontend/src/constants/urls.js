const base_url = process.env.NEXT_PUBLIC_API_BASE_URL

// auth urls =>
export const loginUrl = `${base_url}/api/v1/auth/login`

// user urls =>
export const createAdminUrl = `${base_url}/api/v1/admin/create-admin`

// order urls =>

export const createSingleOrderUrl = `${base_url}/api/v1/order/create-single-order` 
export const createBulkOrderUrl = `${base_url}/api/v1/order/create-bulk-orders`

export const getAllOrdersUrl = `${base_url}/api/v1/order/get-all-orders`
export const getShipmentStatusListUrl = `${base_url}/api/v1/order/get-shipment-status-list`
