import CryptoJS from 'crypto-js'
import dotenv from 'dotenv'
dotenv.config({quiet:true})
 


export const generateEncryption = async ({plaintext = "" , secretKey = process.env.SECRET_KEY} = {}) => {
    return CryptoJS.AES.encrypt(plaintext , secretKey).toString()
}

export const decryptEncryption = async ({ciphertext = "" , secretKey = process.env.SECRET_KEY} = {}) => {
    return CryptoJS.AES.decrypt(ciphertext , secretKey).toString(CryptoJS.enc.Utf8)
}