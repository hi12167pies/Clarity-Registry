import express from "express"
import { exists, existsSync, readdirSync, statSync } from "fs"
import path from "path"

const router = express.Router()

function filterFileType(allFiles: string[], libName: string, extension: string) {
  const filteredFiles = allFiles.filter(file => file.endsWith("." + extension))
  return filteredFiles.map(file => {
    return {
      name: file,
      path: `/lib/${libName}/${file}`
    }
  })
}

router.get("/:name", (req, res) => {
  const { name } = req.params

  try {
    const basePath = path.join(process.cwd(), "libraries", name)

    if (!existsSync(basePath)) {
      res.status(404).json({
        found: false,
        message: "Library does not exist."
      })
      return
    }

    const files = readdirSync(basePath)

    res.json({
      found: true,
      jar: filterFileType(files, name, "jar")[0] || null,
      cclr: filterFileType(files, name, "cclr")
    })

  } catch (e) {
    res.status(500).json({
      found: false,
      messaage: "Internal server error."
    })
  }
})

router.get("/:name/:file", (req, res) => {
  const { name, file } = req.params

  try {
    const basePath = path.join(process.cwd(), "libraries", name)

    if (!existsSync(basePath)) {
      res.status(404).json({
        found: false,
        message: "Library does not exist."
      })
      return
    }

    const filePath = path.join(basePath, file)
    
    if (!existsSync(filePath)) {
      res.status(404).json({
        found: false,
        message: "File does not exist."
      })
      return
    }

    res.download(filePath)
  } catch (e) {
    res.status(500).json({
      found: false,
      messaage: "Internal server error."
    })
  }
})

export { router as LibraryRouter }