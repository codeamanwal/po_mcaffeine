'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Eye, History, AlertCircle, Calendar, Package, User, MapPin, Pen } from 'lucide-react'
import { get } from 'react-hook-form'
import api from '@/hooks/axios'
import { getLogsOfShipment } from '@/lib/order'

// Mock API functions
const fetchShipmentData = async (shipment) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  const obj = { ...shipment };
  return obj;
}

const fetchShipmentLogs = async (shipmentId) => {
  // await new Promise(resolve => setTimeout(resolve, 800))
  const logs = await getLogsOfShipment(shipmentId)
  console.log(logs?.data?.logs.messages);
  const logContent = logs?.data?.logs.messages;
  return logContent;
  
  // return [
  //   {
  //     id: 1,
  //     timestamp: "2024-01-22 10:30:00",
  //     field: "currentAppointmentDate",
  //     oldValue: "2024-01-21",
  //     newValue: "2024-01-22",
  //     changedBy: "logistics@mcaffeine.com",
  //     action: "Updated"
  //   },
  //   {
  //     id: 2,
  //     timestamp: "2024-01-20 14:15:00",
  //     field: "poNumber",
  //     oldValue: "PO-2024-TEMP",
  //     newValue: "PO-2024-001",
  //     changedBy: "admin@mcaffeine.com",
  //     action: "Updated"
  //   },
  //   {
  //     id: 3,
  //     timestamp: "2024-01-19 09:45:00",
  //     field: "statusWarehouse",
  //     oldValue: "Pending",
  //     newValue: "In Progress",
  //     changedBy: "warehouse@mcaffeine.com",
  //     action: "Updated"
  //   },
  //   {
  //     id: 4,
  //     timestamp: "2024-01-18 16:20:00",
  //     field: "dispatchDate",
  //     oldValue: "2024-01-19",
  //     newValue: "2024-01-20",
  //     changedBy: "planner@mcaffeine.com",
  //     action: "Updated"
  //   },
  //   {
  //     id: 5,
  //     timestamp: "2024-01-17 11:00:00",
  //     field: "firstAppointmentDateCOPT",
  //     oldValue: "2024-01-20",
  //     newValue: "2024-01-22",
  //     changedBy: "copt@mcaffeine.com",
  //     action: "Updated"
  //   }
  // ]
}

export default function ShipmentViewModal({
  isOpen, 
  onClose, 
  shipment,
  shipmentId, 
  poNumber 
}) {
  const [shipmentData, setShipmentData] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [logsLoading, setLogsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('data')

  useEffect(() => {
    if (isOpen && shipmentId) {
      fetchData()
    }
  }, [isOpen, shipmentId])

  const fetchData = async () => {
    if (!shipmentId) return
    
    setLoading(true)
    setError(null)
    
    try {
    //   setShipmentData(shipment)
      const [data, logsData] = await Promise.all([
        fetchShipmentData(shipment),
        fetchShipmentLogs(shipmentId)
      ])
      setShipmentData(data)
      setLogs(logsData)
    } catch (err) {
      setError('Failed to fetch shipment data')
      console.error('Error fetching shipment data:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatValue = (key, value) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-muted-foreground italic">Not set</span>
    }
    
    if (typeof value === 'boolean') {
      return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Yes' : 'No'}</Badge>
    }
    
    if (typeof value === 'number') {
      if (key.includes('Weight') || key.includes('weight')) {
        return `${value} kg`
      }
      if (key.includes('Value') || key.includes('value') || key.includes('Gmv') || key.includes('gmv')) {
        return `₹${value.toLocaleString()}`
      }
      return value.toString()
    }
    
    if (key.includes('Date') || key.includes('date')) {
      // format as value is in "dd-mm-yyyy" format
      const [day, month, year] = value.split('-');
      const dateObj = new Date(`${year}-${month}-${day}`); // ISO format

      // Format it nicely using toLocaleDateString
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    if (key.includes('Link') || key.includes('link')) {
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          View Link
        </a>
      )
    }
    
    if (key.includes('Status') || key.includes('status')) {
      const variant = value === 'Completed' ? 'default' : 
                    value === 'Active' ? 'default' :
                    value === 'In Progress' ? 'secondary' : 'outline'
      return <Badge variant={variant}>{value}</Badge>
    }
    
    return value.toString()
  }

  const getFieldLabel = (key) => {
    if(!key) return "";
    const labelMap = {
      uid: 'UID',
      entryDate: 'Entry Date',
      poDate: 'PO Date',
      facility: 'Facility',
      channel: 'Channel',
      location: 'Location',
      poNumber: 'PO Number',
      brandName: 'Brand Name',
      remarksPlanning: 'Planning Remarks',
      specialRemarksCOPT: 'Special Remarks (COPT)',
      newShipmentReference: 'Shipment Reference',
      statusActive: 'Active Status',
      statusPlanning: 'Planning Status',
      statusWarehouse: 'Warehouse Status',
      statusLogistics: 'Logistics Status',
      channelInwardingRemarks: 'Channel Inwarding Remarks',
      dispatchRemarksLogistics: 'Dispatch Remarks (Logistics)',
      dispatchRemarksWarehouse: 'Dispatch Remarks (Warehouse)',
      dispatchDateTentative: 'Tentative Dispatch Date',
      workingDatePlanner: 'Working Date (Planner)',
      rtsDate: 'RTS Date',
      dispatchDate: 'Dispatch Date',
      currentAppointmentDate: 'Current Appointment Date',
      // firstAppointmentDateCOPT: 'First Appointment Date (COPT)',
      noOfBoxes: 'Number of Boxes',
      orderNo1: 'Order No 1',
      orderNo2: 'Order No 2',
      orderNo3: 'Order No 3',
      pickListNo: 'Pick List No',
      workingTypeWarehouse: 'Working Type (Warehouse)',
      inventoryRemarksWarehouse: 'Inventory Remarks (Warehouse)',
      b2bWorkingTeamRemarks: 'B2B Working Team Remarks',
      volumetricWeight: 'Volumetric Weight',
      channelType: 'Channel Type',
      firstTransporter: 'First Transporter',
      firstDocketNo: 'First Docket No',
      secondTransporter: 'Second Transporter',
      secondDocketNo: 'Second Docket No',
      thirdTransporter: 'Third Transporter',
      thirdDocketNo: 'Third Docket No',
      appointmentLetter: 'Appointment Letter/STN',
      labelsLink: 'Labels Link',
      invoiceDate: 'Invoice Date',
      invoiceLink: 'Invoice Link',
      cnLink: 'CN Link',
      ewayLink: 'E-Way Link',
      invoiceValue: 'Invoice Value',
      remarksAccountsTeam: 'Accounts Team Remarks',
      invoiceChallanNumber: 'Invoice/Challan Number',
      invoiceCheckedBy: 'Invoice Checked By',
      tallyCustomerName: 'Tally Customer Name',
      customerCode: 'Customer Code',
      poEntryCount: 'PO Entry Count',
      temp: 'Temporary',
      deliveryDate: 'Delivery Date',
      rescheduleLag: 'Reschedule Lag',
      finalRemarks: 'Final Remarks',
      updatedGmv: 'Updated GMV',
      physicalWeight: 'Physical Weight'
    }
    return labelMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
  }

  const groupFields = (data) => {
    const groups = {
      'Basic Information': ['uid', 'poNumber', 'entryDate', 'poDate', 'brandName', 'facility', 'channel', 'location'],
      'Status Information': ['statusActive', 'statusPlanning', 'statusWarehouse', 'statusLogistics'],
      'Dates & Timeline': ['workingDatePlanner', 'dispatchDateTentative', 'dispatchDate', 'rtsDate', 'currentAppointmentDate', 'firstAppointmentDateCOPT', 'deliveryDate'],
      'Order Details': ['orderNo1', 'orderNo2', 'orderNo3', 'pickListNo', 'noOfBoxes', 'poEntryCount'],
      'Logistics & Transport': ['firstTransporter', 'firstDocketNo', 'secondTransporter', 'secondDocketNo', 'thirdTransporter', 'thirdDocketNo'],
      'Weight & Measurements': ['volumetricWeight', 'physicalWeight'],
      'Financial Information': ['invoiceValue', 'updatedGmv', 'invoiceDate', 'invoiceChallanNumber', 'invoiceCheckedBy'],
      'Remarks & Comments': ['remarksPlanning', 'specialRemarksCOPT', 'channelInwardingRemarks', 'dispatchRemarksLogistics', 'dispatchRemarksWarehouse', 'inventoryRemarksWarehouse', 'b2bWorkingTeamRemarks', 'remarksAccountsTeam', 'finalRemarks'],
      'Links & Documents': ['labelsLink', 'invoiceLink', 'cnLink', 'ewayLink', 'appointmentLetter'],
      'Other Information': ['newShipmentReference', 'channelType', 'workingTypeWarehouse', 'tallyCustomerName', 'customerCode', 'temp', 'rescheduleLag']
    }

    return groups
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:w-[70vw] w-full max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Shipment Details - PO: {poNumber}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Data View
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Change Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="flex-1 overflow-hidden mt-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading shipment data...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2 text-center">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                  <Button onClick={fetchData} variant="outline" size="sm">
                    Retry
                  </Button>
                </div>
              </div>
            ) : shipmentData ? (
              <ScrollArea className="h-[60vh]">
                <div className="space-y-6">
                  {Object.entries(groupFields(shipmentData)).map(([groupName, fields]) => (
                    <Card key={groupName}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {groupName === 'Basic Information' && <Package className="h-5 w-5" />}
                          {groupName === 'Status Information' && <AlertCircle className="h-5 w-5" />}
                          {groupName === 'Dates & Timeline' && <Calendar className="h-5 w-5" />}
                          {groupName === 'Logistics & Transport' && <MapPin className="h-5 w-5" />}
                          {groupName === 'Financial Information' && <User className="h-5 w-5" />}
                          {groupName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          {fields.map((field) => (
                            <div key={field} className="space-y-1">
                              <label className="text-sm font-medium text-muted-foreground">
                                {getFieldLabel(field)}
                              </label>
                              <div className="text-sm">
                                {formatValue(field, shipmentData[field])}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : null}
          </TabsContent>

          <TabsContent value="logs" className="flex-1 overflow-hidden mt-4">
            {logsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading change logs...</p>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4">
                  {logs?.length === 0 ? (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No change logs available</p>
                    </div>
                  ) : (
                    logs?.map((log, idx) => (
                      <Card key={idx}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{log.action || "Updated"}</Badge>
                                <span className="text-sm font-medium">{getFieldLabel(log?.fieldName) || ""}</span>
                              </div>
                              <div className="text-sm">
                                <span>{log?.change}</span>
                              </div>
                              <span className="flex items-center gap-1 text-xs text-black/90">
                                  <Pen className="h-3 w-3 text-blue-500" />
                                  <span className='text-blue-500'>Remark: </span>{log?.remark}
                                </span>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {log?.createdBy?.email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(log?.timestamp)?.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
