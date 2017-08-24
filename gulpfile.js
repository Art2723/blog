var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');


gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "localhost:3000",  // local node app address
        port: 5000,  // use *different* port than above
        notify: true
    });
});

gulp.task('default', ['browser-sync'], function () {
    gulp.watch(["./public/stylesheets/*.css"], reload);
    gulp.watch(["./views/*.pug"], reload);
});

gulp.task('nodemon', function (cb) {
    var callbackCalled = false;
    return nodemon({script: './bin/www'}).on('start', function () {
        if (!callbackCalled) {
            callbackCalled = true;
            cb();
        }
    });
});