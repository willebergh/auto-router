# auto-router
Simple express.js middleware that automatically loads all .js files in a directory recursively to the express router

## Install
```bash
npm install @willebergh/auto-router
```

## Usage:
### autoRouter(routesDir|options)
- routesDir `string`: Path to the directory with all routes
- options `object`: An object with multiple options

## Options:
```js
const options = {
    routes: "./src/routes",             // Path to the directory with all routes
    logging: "silent" || "verbose",     // How much to log to the console
    baseRoute: "/api"                   // The base route of the autoRouter
}
```

## Example:
Initalize the middleware with `app.use()` in the root of your app.
```js
const express = require("express");
const autoRouter = require("@willebergh/auto-router");
const app = express();

// Without any options
app.use(autoRouter("./src/routes"));

// With options
app.use(autoRouter({
    routes: "./src/routes",             // Path to the directory with all routes
    logging: "silent" || "verbose",     // How much to log to the console
    baseRoute: "/api"                   // The base route of the autoRouter
}));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
```
In your route files, just export the express router like normal.
If the express router is not exported the route will fail to load.
```js
const express = require("express");
const router = express.Router();

// Use the router...

module.exports = router;
```