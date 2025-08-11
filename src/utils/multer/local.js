import multer from "multer"
import path from "path"
import fs from "fs"

export const fileValidation = {
  image: ["image/jpeg", "image/png", "image/webp"],
  document: ["application/pdf", "application/msword"],
  video: ["video/mp4", "video/x-msvideo", "video/x-ms-wmv"],
  audio: ["audio/mpeg", "audio/mp3", "audio/ogg"]
}

const maxSizePerType = {
  image: 10 * 1024 * 1024,
  video: 100 * 1024 * 1024,
  document: 5 * 1024 * 1024,
  audio: 20 * 1024 * 1024
}

export const localFiles = ({customPath = "general",validation = [],fieldName = "file",multiple = false} = {}) => {
  
  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      let basePath = `uploads/${customPath}`
      if (req.user?._id) {
        basePath = `${basePath}/${req.user._id}`
      }
      const fullPath = path.resolve(`./src/${basePath}`)
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true })
      }
      req.basePath = basePath
      return callback(null, fullPath)
    },
    filename: function (req, file, callback) {
      const uniqueFileName = `${Date.now()}__${Math.random()}__${file.originalname}`
      file.finalPath = `req.basePath/${uniqueFileName}`
      callback(null, uniqueFileName)
    }
  })
  const fileFilter = function (req, file, callback) {
    const type = Object.keys(fileValidation).find(key => fileValidation[key].includes(file.mimetype))
    if (!type || !validation.includes(type)) return callback(new Error("In-Valid File Format"), false)
    const maxSizeSymbol = Symbol("maxSize")
    file[maxSizeSymbol] = maxSizePerType[type]
    callback(null, true)
  }
  const trackSizeMiddleware = (req, res, next) => {
    let uploaded = 0
    req.on("data", (chunk) => {
      uploaded += chunk.length
      const files = req.file ? [req.file] : req.files ? req.files : []
      for (const file of files) {
        const maxSize = file[maxSizeSymbol] || Infinity 
        if (uploaded > maxSize) req.destroy()
      }
    })
    next()
  }

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 200 * 1024 * 1024 }
  })

  const uploader = multiple ? upload.array(fieldName) : upload.single(fieldName)
  return [trackSizeMiddleware, uploader]
}
