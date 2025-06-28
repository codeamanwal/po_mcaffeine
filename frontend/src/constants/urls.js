const base_url = process.env.NEXT_PUBLIC_API_BASE_URL

// auth urls =>
export const loginUrl = `${base_url}/api/v1/auth/login`

// user urls =>
export const createUserUrl = `${base_url}/api/v1/user/create-user`
export const deleteUserUrl = `${base_url}/api/v1/user/delete-user`

export const getAllUsersUrl = `${base_url}/api/v1/user/get-all-users`
export const changeUserPasswordUrl = `${base_url}/api/v1/user/change-user-password`


// order urls =>

export const createSingleOrderUrl = `${base_url}/api/v1/order/create-single-order` 
export const createBulkOrderUrl = `${base_url}/api/v1/order/create-bulk-orders`

export const getAllOrdersUrl = `${base_url}/api/v1/order/get-all-orders`
export const getShipmentStatusListUrl = `${base_url}/api/v1/order/get-shipment-status-list`
