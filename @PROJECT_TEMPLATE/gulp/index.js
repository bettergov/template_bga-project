const gulp = require('gulp');
const env = require('gulp-env');
const path = require('path');

module.exports = tasks => {
  tasks.forEach(name => {
    gulp.task(name, function(cb) {
      env({ file: path.resolve(__dirname, '../.env'), type: 'ini' });
      require(`./tasks/${name}`)(cb);
    });
  });
  return gulp;
};
