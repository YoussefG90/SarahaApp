import path from "path"
import  * as dotenv from "dotenv"
dotenv.config({path:path.join('./src/config/.env') , quiet:true});
import express from "express"
import connectDB from "./DB/connection.db.js"
import authControler from "./modules/auth/auth.controller.js"
import userControler from "./modules/user/user.controller.js"
import messageControler from "./modules/message/message.controller.js"
import { globelErrorHandling } from "./utils/response.js"
import cors from "cors"
import rateLimit from "express-rate-limit"
import morgan from "morgan";
import helmet from "helmet";

const app = express()
const port = process.env.PORT || 3001
async function bootstarp() {
    app.set('trust proxy', 1)
    app.use(express.json()) 
    app.use(cors())
    app.use(helmet())
    app.use(morgan('common'))
    app.use("./uploads",express.static(path.resolve("./src/uploads")))


    // var whitelist = ['http://example1.com', 'http://example2.com']
    // app.use(async (req, res, next) => {
    //     if (!whitelist.includes(req.header('origin'))) {
    //         return next(new Error('Not Allowed By CORS', { status: 403 }))
    //     }
    //     for (const origin of whitelist) {
    //         if (req.header('origin') == origin) {
    //             await res.header('Access-Control-Allow-Origin', origin);
    //             break;
    //         }
    //     }
    //     await res.header('Access-Control-Allow-Headers', '*')
    //     await res.header("Access-Control-Allow-Private-Network", 'true')
    //     await res.header('Access-Control-Allow-Methods', '*')
    //     console.log("Origin Work");
    //     next();
    // });
  
    
    const limiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	limit: 5, 
	standardHeaders: 'draft-8',
    })

    app.use("/auth",limiter)

    await connectDB()
    
    app.use("/auth" , authControler)
    app.use("/user" , userControler)
    app.use("/message" , messageControler)
    
     app.use(globelErrorHandling)
     app.listen(port, () =>{console.log(`Server is Running ✔`)})
     app.all("{/*dummy}" , (req,res,next) => { res.status(404).json({message:"Error 404 Page Not Found"})})

}





export default bootstarp