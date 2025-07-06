require("dotenv").config();


const express = require("express")
// 2 new import
const connectBOOTS_BUY_BACKENed=require("./config/boots_buy_backened")
const userRoutes = require("./routes/userRoutes")
const adminUserRoutes = require("./routes/admin/userRouteAdmin")
const adminBrandRoutes = require("./routes/admin/brandRouteAdmin")
const adminProductRoutes = require("./routes/admin/productRouteAdmin")






const path = require("path") // 
const cors = require("cors")
const connectBOOTS_BUY_BACKENED = require("./config/boots_buy_backened")
const app = express()

let corsOptions = {
    origin: "*" 
}
app.use(cors(corsOptions))

app.use(express.json()) // accept json in request
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
// path.join concats 2 path string,
// __dirname -> current directory path

// 2 new implementation
connectBOOTS_BUY_BACKENED()
app.use("/api/auth", userRoutes)
app.use("/api/admin/users", adminUserRoutes)
app.use("/api/admin/brand", adminBrandRoutes)
app.use("/api/admin/product", adminProductRoutes)


const PORT = process.env.PORT
app.listen(
    PORT,
    () => {
        console.log("Server running")
    }
)