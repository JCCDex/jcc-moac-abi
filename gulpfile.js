const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('watch', function() {
  gulp.watch(['src/**/*.ts'], shell.task('npm run lint'));
});

gulp.task('lint', shell.task('npm run lint'));
gulp.task('test', shell.task('npm run test:node'));
gulp.task('default', gulp.series(['test']));
gulp.task('dev', gulp.parallel(['lint', 'watch']));
