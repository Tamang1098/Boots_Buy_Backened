require("dotenv").config();
const app = require("./index");
const PORT = process.env.PORT 
app.listen(
    PORT,'0.0.0.0',
    () => {
        console.log("Server running")
    }
)