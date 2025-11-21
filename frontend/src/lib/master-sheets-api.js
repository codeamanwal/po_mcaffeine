import { MASTER_SHEETS_CONFIG } from "./master-sheets-config"
import api from "@/hooks/axios"

export const uploadMasterSheetData = async (sheetType, data) => {
  const config = MASTER_SHEETS_CONFIG[sheetType]

  if (!config) {
    throw new Error(`Invalid sheet type: ${sheetType}`)
  }

  try {
    const res = await api.post(`${config.endpoint}/upload`, {
      sheetType,
      data,
      timestamp: new Date().toISOString(),
    })
    return res
  } catch (error) {
    console.error(`Error uploading ${sheetType}:`, error)
    throw error
  }
}

export const getMasterSheetData = async (sheetType) => {
  const config = MASTER_SHEETS_CONFIG[sheetType]

  if (!config) {
    throw new Error(`Invalid sheet type: ${sheetType}`)
  }

  try {
    const res = await api.get(config.endpoint)
    return res
  } catch (error) {
    console.error(`Error fetching ${sheetType}:`, error)
    throw error
  }
}

export const deleteMasterSheetEntry = async (sheetType) => {
  const config = MASTER_SHEETS_CONFIG[sheetType]

  if (!config) {
    throw new Error(`Invalid sheet type: ${sheetType}`)
  }

  try {
    const res = await api.post(`${config.endpoint}/delete`)
    return res
  } catch (error) {
    console.error(`Error deleting ${sheetType}:`, error)
    throw error
  }
}
