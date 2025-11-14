import { MASTER_SHEETS_CONFIG } from "./master-sheets-config"

export const uploadMasterSheetData = async ( sheetType, data ) => {
  const config = MASTER_SHEETS_CONFIG[sheetType]

  if (!config) {
    throw new Error(`Invalid sheet type: ${sheetType}`)
  }

  try {
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sheetType,
        data,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Upload failed with status ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`[v0] Error uploading ${sheetType}:`, error)
    throw error
  }
}

export const getMasterSheetData = async (sheetType) => {
  const config = MASTER_SHEETS_CONFIG[sheetType]

  if (!config) {
    throw new Error(`Invalid sheet type: ${sheetType}`)
  }

  try {
    const response = await fetch(`${config.endpoint}?type=${sheetType}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch ${sheetType} data`)
    }

    const result = await response.json()
    return result.data || []
  } catch (error) {
    console.error(`[v0] Error fetching ${sheetType}:`, error)
    throw error
  }
}

export const deleteMasterSheetEntry = async (sheetType, entryId) => {
  const config = MASTER_SHEETS_CONFIG[sheetType]

  if (!config) {
    throw new Error(`Invalid sheet type: ${sheetType}`)
  }

  try {
    const response = await fetch(`${config.endpoint}/${entryId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Failed to delete entry`)
    }

    return await response.json()
  } catch (error) {
    console.error(`[v0] Error deleting ${sheetType} entry:`, error)
    throw error
  }
}
