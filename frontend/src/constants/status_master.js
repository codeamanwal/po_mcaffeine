const statusMapping = [
  { planning: "Confirmed", warehouse: "Confirmed", logistics: "Confirmed", final: "Confirmed" },
  { planning: "Not Confirmed", warehouse: "Confirmed", logistics: "Confirmed", final: "Not Confirmed" },
  { planning: "Confirmed", warehouse: "Picking", logistics: "Confirmed", final: "Picking" },
  { planning: "Confirmed", warehouse: "Packed", logistics: "Confirmed", final: "Packed" },
  { planning: "Confirmed", warehouse: "Label Pending", logistics: "Confirmed", final: "Label Pending" },
  { planning: "Confirmed", warehouse: "RTS", logistics: "Confirmed", final: "RTS" },
  { planning: "Confirmed", warehouse: "Dispatched", logistics: "Dispatched", final: "Dispatched" },
  { planning: "Confirmed", warehouse: "Cancelled Shipment - Low Value", logistics: "Cancelled Shipment - Low Value", final: "Cancelled Shipment - Low Value" },
  { planning: "Confirmed", warehouse: "Cancelled Shipment - Channel", logistics: "Cancelled Shipment - Channel", final: "Cancelled Shipment - Channel" },
  { planning: "Confirmed", warehouse: "RTO Received", logistics: "RTO Initiated", final: "RTO Initiated" },
  { planning: "Confirmed", warehouse: "Internal Transfer", logistics: "Internal Transfer", final: "Internal Transfer" }
];

export function getFinalStatus(statusPlanning, statusWarehouse, statusLogistics) {
  const match = statusMapping.find(
    row =>
      row.planning === statusPlanning &&
      row.warehouse === statusWarehouse &&
      row.logistics === statusLogistics
  );
  return match ? match.final : null;
}
