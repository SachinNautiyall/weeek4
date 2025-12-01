    const express = require("express");
    const path = require("path");
    const router = require("./dist/index").default;


    const app = express();
    const port = 3000;
    app.use(express.json());
    app.listen(port, () => {
    console.log(`Server on port ${port}`);
    });

    app.use("/", router);
    app.use(express.static(path.join(__dirname, "public")));