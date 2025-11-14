import * as XLSX from 'xlsx'

export async function generateExcelTemplate(sheetType, sheetName, columns) {

    // Create sample data based on sheet type
    const sampleData = getSampleData(sheetType, columns)

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(sampleData)

    // Set column widths
    const colWidths = columns.map(() => ({ wch: 20 }))
    worksheet['!cols'] = colWidths

    // Style header row
    const headerStyle = {
        fill: { fgColor: { rgb: 'FFD966' } },
        font: { bold: true },
        alignment: { horizontal: 'center', vertical: 'center' }
    }

    // Apply header styling
    for (let i = 0; i < columns.length; i++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i })
        if (!worksheet[cellAddress]) continue
        worksheet[cellAddress].s = headerStyle
    }

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template')

    // Generate filename
    const filename = `${sheetName.replace(/\s+/g, '_')}_Template.xlsx`

    // Download file
    XLSX.writeFile(workbook, filename)
}

export async function generateExcelWithData(sheetName, columns, data){
    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(data)

    // Set column widths
    const colWidths = columns.map(() => ({ wch: 20 }))
    worksheet['!cols'] = colWidths

    // Style header row
    const headerStyle = {
        fill: { fgColor: { rgb: 'FFD966' } },
        font: { bold: true },
        alignment: { horizontal: 'center', vertical: 'center' }
    }

    // Apply header styling
    for (let i = 0; i < columns.length; i++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i })
        if (!worksheet[cellAddress]) continue
        worksheet[cellAddress].s = headerStyle
    }

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template')

    // Generate filename
    const filename = `${sheetName.replace(/\s+/g, '_')}_Data.xlsx`

    // Download file
    XLSX.writeFile(workbook, filename)
}

function getSampleData(sheetType, columns) {
    
    const samples = {
        facility: [
            { Facility: 'HYP_SRGWHT', 'Pickup Location': 'Guwahati' },
            { Facility: 'HYP_SRPUN', 'Pickup Location': 'Pune' }
        ],
        courierPartner: [
            {
                'Courier Partner - Mode': 'Rivigo - PTL',
                'Courier Partner': 'Rivigo',
                'Courier Mode': 'PTL',
                'Appointment Charge (Appointment Channel Yes)': '700',
                'Appointment Charge (Appointment Channel No)': '0',
                'Docket Charges': '80',
                'Courier Type': 'Type A'
            }
        ],
        status: [
            {
                'Status (Planning)': 'Confirmed',
                'Status (Warehouse)': 'Confirmed',
                'Status (Logistics)': 'Confirmed',
                'Status (Final Status)': 'Confirmed'
            }
        ],
        courierRates: [
            {
                'Courier Partner': 'Airtrans - Air',
                'Pickup Location': 'Mumbai',
                'Drop Location': 'Ahmedabad',
                'Rates Per KG': '65',
                'TAT': '1'
            }
        ],
        channel: [
            {
                'Channel Category': 'Amazon',
                'Channel': 'Amazon',
                'Channel Location': 'AMD2',
                'Drop Location': 'Ahmedabad',
                'Appt Channel': 'Yes',
                'Appt Channel': 'B2C'
            }
        ],
        appointmentRemarks: [
            {
                'Appointment Change Remarks': 'Appointment Miss - Inventory Issue',
                'Appointment Change Category': 'Appointment Miss'
            }
        ],
        sku: [
            {
                'Channel': 'A2B GIFTING SOLUTIONS',
                'SKU Code': 'MGKIT3_C',
                'SKU Name': 'mCaffeine Coffee Mood Skin Care Gift',
                'channel SKU Code': '8906129570269',
                'Brand': 'mCaffeine',
                'MRP': '2020'
            }
        ]
    }

    return samples[sheetType] || []
}
