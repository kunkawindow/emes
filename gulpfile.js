var gulp = require("gulp");
var concat = require("gulp-concat");

gulp.task("default", () =>
    gulp.src([
            "./src/header.txt",
            "./dist/emes.js"
        ])
        .pipe(concat("emes.user.js"))
        .pipe(gulp.dest("./dist/"))
);