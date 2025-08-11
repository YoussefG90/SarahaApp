import multer from "multer"

export const fileValidation = {
  image: ["image/jpeg", "image/png", "image/webp"],
  document: ["application/pdf", "application/msword"],
  video: ["video/mp4", "video/x-msvideo", "video/x-ms-wmv"],
  audio: ["audio/mpeg", "audio/mp3", "audio/ogg"]
}

export const cloudFiles = ({validation = []} = {}) => {
  
  const storage = multer.diskStorage({})

  const fileFilter = function (req, file, callback) {
    if (validation.includes(file.mimetype)){
       return callback(null, true)
    }   
        return callback(new Error("In-Valid File Format"), false)
  }
  

 return multer({fileFilter,storage})

}
