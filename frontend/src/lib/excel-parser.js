import * as XLSX from "xlsx"

export const parseExcelFile = async (file, expectedColumns) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: "array" })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" })

        // Get actual headers from the first row
        const headers = Object.keys(jsonData[0] || {})

        // Validate headers exist (case-insensitive)
        const expectedHeadersLower = expectedColumns.map((h) => h.label?.replace(" ", "")?.toLowerCase())
        const actualHeadersLower = headers.map((h) => h?.replace(" ", "")?.toLowerCase())

        const missingHeaders = expectedHeadersLower.filter((h) => !actualHeadersLower.includes(h))

        if (missingHeaders.length > 0) {
          reject(new Error(`Missing required columns: ${missingHeaders.join(", ")}`))
          return
        }

        // Filter out empty rows and clean data
        let emptyRowsCount = 0
        const cleanedRows = jsonData
          .map((row) => {
            // Check if row has at least one non-empty cell
            const hasData = Object.values(row).some((val) => val !== null && val !== "" && val !== undefined)

            if (!hasData) {
              emptyRowsCount++
              return null
            }

            // Remove completely empty cells, keep others
            const cleanedRow = {}
            for (const kv of expectedColumns) {
              // console.log(kv)
              const valueType = kv.type
              const value = row[kv.label]
              if (value === null || value === undefined || value === "") {
                cleanedRow[kv.key] = null
              } else {
                if (valueType === "number") {  
                  cleanedRow[kv.key] = Number(value) ?? null;
                } else {
                  cleanedRow[kv.key] = value
                }
              }
            }
            return cleanedRow
          })
          .filter((row) => row !== null)

        resolve({
          headers,
          rows: cleanedRows,
          emptyRowsCount,
        })
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsArrayBuffer(file)
  })
}

export const validateRowsForEmptyCells = ( rows, requiredColumns ) => {
  const validRows = []
  const invalidRows = []
  let invalidRowsCount = 0

  rows.forEach((row) => {
    // Check if any required column is empty
    const hasAllRequiredFields = requiredColumns.every(
      (col) => row[col] !== null && row[col] !== "" && row[col] !== undefined,
    )

    if (hasAllRequiredFields) {
      validRows.push(row)
    } else {
      console.log(row)
      invalidRows.push(row)
      invalidRowsCount++
    }
  })

  return { validRows, invalidRows, invalidRowsCount }
}
