var inlineResources = require("./inline-resources.js");
var copy = require("copy");

copy("src/**/*.html", "dist", function () {
    inlineResources("./dist");
});

copy(["package.json", ".npmignore", "README.md"], "dist", function () {
});

copy(["src/styles.css", "example/res/css/example.css"], "dist/css", {flatten: true}, function () {
});
