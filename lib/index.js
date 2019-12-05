const fs = require("fs");
const path = require("path");
const colors = require("colors");
const express = require("express");
const router = express.Router();

var autoRouter;

autoRouter = (options) => {

    this.options = {
        routes: "",
        logging: "",
        baseRoute: ""
    }

    if (typeof options === "string") this.options.routes = options;
    if (typeof options === "object") this.options = { ...this.options, ...options };

    this.totalRoutes = 0;
    this.loadedRoutes = [];
    this.failedRoutes = [];

    this.log = (str, isVerbose) => {
        var log = (str, isVerbose) => {
            if (this.options.logging === "silent") return;
            if (isVerbose && this.options.logging !== "verbose") return;
            let args = [`[autoRouter]:`.gray];
            console.log(...args, str)
        }

        var methods = {
            success: () => {
                log(colors.green(str), isVerbose);
                return methods;
            }, error: () => {
                log(colors.red(str), isVerbose);
                return methods;
            },
            loading: () => {
                log(colors.yellow(str), isVerbose);
                return methods;
            }
        };

        return methods;
    }

    this.searchDir = (subDir, currentDir) => {
        const basedir = path.dirname(require.main.filename);
        const routesDir = path.join(basedir, this.options.routes)
        currentDir = currentDir ? currentDir : routesDir;
        const dirToSearch = subDir ? path.join(currentDir, subDir) : currentDir;
        fs.readdirSync(dirToSearch, { withFileTypes: true }).forEach(x => {
            if (x.isFile()) {
                const file = path.join(dirToSearch, x.name);
                const extname = path.extname(file)
                var route = file.replace(routesDir, "").replace(/\\/g, "/").replace(new RegExp(`${extname}|/index`, "g"), "");
                if (file === path.join(routesDir, "index.js")) route = "/";
                if (extname !== ".js") return;
                this.totalRoutes++;

                try {
                    route = this.options.baseRoute + (route === "/" ? "" : route);
                    router.use(route, require(file));
                } catch (err) {
                    this.failedRoutes.push(route);
                    this.log(`Failed to load: ${file.replace(basedir, "")}`).error();
                    this.log(err, true).error();
                    return;
                }

                this.loadedRoutes.push(route);
                this.log(`Added route: ${route} => .${file.replace(basedir, "")}`).success();

            } else if (x.isDirectory()) {
                this.searchDir(x.name, dirToSearch)
            }
        })
    }

    this.log("Loading routes...").loading();
    this.searchDir();
    if (this.loadedRoutes.length !== 0) {
        this.log(`Successfully loaded ${this.loadedRoutes.length}/${this.totalRoutes} routes!`).success();
    }
    if (this.failedRoutes.length !== 0) {
        this.log(`Failed to load ${this.failedRoutes.length}/${this.totalRoutes} routes!`).error();
        this.failedRoutes.forEach(x => {
            this.log(`\t${x}`, true).error();
        })
    }

    return router;
}

module.exports = autoRouter;