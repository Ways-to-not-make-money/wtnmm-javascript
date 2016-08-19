var gulp = require("gulp");
var coffee = require("gulp-coffee");

gulp.task('coffee', function () {
  gulp.src('./app/coffee/*.coffee')
    .pipe(coffee({bare: true}))
    .pipe(gulp.dest('app/js'));
});

gulp.task('watch-coffee', function () {
  gulp.watch(['./app/coffee/*.coffee'], ['coffee']);
});
