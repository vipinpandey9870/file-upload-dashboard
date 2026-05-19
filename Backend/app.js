const express = require("express")
const app = express()
const dotenv = require("dotenv")
const cors = require("cors")
const multer = require("multer")
const XLSX = require("xlsx")

dotenv.config()
const PORT = process.env.PORT || 3000

app.use(cors())

const upload = multer({ storage: multer.memoryStorage() })

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." })
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]

    if (!sheetName) {
      return res.status(400).json({ error: "Uploaded Excel file has no sheets." })
    }

    const sheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(sheet, { defval: "" })

    return res.status(200).json(data)
  } catch (error) {
    console.error("Error processing uploaded file:", error)
    return res
      .status(500)
      .json({ error: "Failed to parse the uploaded Excel file." })
  }
})





app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})


 