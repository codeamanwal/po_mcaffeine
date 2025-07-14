// Example: src/models/associations.js
import ShipmentOrder from './shipment-order.model.js';
import SkuOrder from './sku-order.model.js';

// Call associate functions and pass all models as an object
ShipmentOrder.associate({ SkuOrder });
SkuOrder.associate({ ShipmentOrder });

export { ShipmentOrder, SkuOrder };
