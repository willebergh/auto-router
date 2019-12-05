const express = require("express");
const autoRouter = require("../lib");
const app = express();

console.clear();

app.use(autoRouter({
    routes: "api",
    baseRoute: "/api"
}))

app.use("/", (req, res, next) => {
    console.log(next)
})

app.listen(3001, () => {
    console.log("ok")
    //process.exit();
})