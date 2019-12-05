const express = require("express");
const autoRouter = require("../lib");
const app = express();

console.clear();

app.use(autoRouter("api"))

app.listen(3000, () => {
    console.log("ok")
    process.exit();
})