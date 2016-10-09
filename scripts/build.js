var inlineResources = require("./inline-resources.js");
var copy = require("copy");

copy("src/**/*.html", "dist", function () {
    inlineResources("./dist");
});

copy(["package.json", ".npmignore"], "dist", function () {
});



