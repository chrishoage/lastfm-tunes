var gulp          = require('gulp');
var browserify    = require('browserify');
var watchify      = require('watchify');
var babelify      = require('babelify');
var sassify       = require('sassify');
var uglifyify     = require('uglifyify');
var envify        = require('envify');
var connect       = require('gulp-connect');
var vinylPaths    = require('vinyl-paths');
var source        = require('vinyl-source-stream');
var del           = require('del');
var gulpif        = require('gulp-if');
var gutil         = require('gulp-util');
var runSequence   = require('run-sequence');

var conf = {
  src: ['**', '!js{,/**}', '!assets/scss{,/**}'],
  js:     ['./src/js/*.js', './src/js/**/*.js'],
  scss: ['./src/scss/**/*.scss'],
  entry: './src/js/app.js',
  dist:   './target/',
  sassify: {
    'auto-inject': true,
    includePaths: [require('node-bourbon').includePaths]
  }
};

var isProd = true;
process.env.NODE_ENV = 'production';

gulp.task('deploy', function () {
    return gulp.src(conf.dist + '**/*')
        .pipe(deploy());
});

gulp.task('clean', function () {
  return gulp.src(conf.dist)
    .pipe(vinylPaths(del))
    .on('error', gutil.log);
});

gulp.task('copy', function () {
  gulp.src(conf.src, {cwd: './src'})
    .pipe(gulp.dest(conf.dist))
    .pipe(connect.reload())
    .on('error', gutil.log);
});

gulp.task('scripts', function () {
  var bundler = browserify({
    cache: {}, packageCache: {}, fullPaths: false,
    paths: ['./src/js/'],
    entries: [conf.entry],
    debug: !isProd
  })
  .transform(babelify)
  .transform({
    global: true
  }, 'envify')
  .transform({
    global: true
  }, 'uglifyify')
  .transform(sassify, conf.sassify);

  var bundlee = function() {
    return bundler
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest(conf.dist + 'js'))
      .pipe(connect.reload())
      .on('error', gutil.log);
  };

  if (!isProd) {
    bundler = watchify(bundler);
    bundler.on('update', function (files) {
      gutil.log('Watchify Update', gutil.colors.magenta(files.map(function (file) {
        return file.replace(__dirname, '')
      }).join(', ')))
      bundlee(files);

    })
  }

  return bundlee();
});

gulp.task('connect', function () {
  connect.server({
    root: [conf.dist],
    port: 9000,
    livereload: true,
    middleware: function (connect, opt) {
      var proxy = function (localRequest, localResponse, next) {
        var t = /(\.js|html|css|ico)|^\/$/gi
        if (!t.test(localRequest.url)) {
          var parts = require('url').parse('http://' + localRequest.url.slice(1));
          var options = {
            host: parts.host,
            path: parts.path
          };
          require('http').request(options, function (remoteRequest) {
            if (remoteRequest.statusCode === 200) {
              localResponse.writeHead(200, {
                  'Content-Type': remoteRequest.headers['content-type']
              });
              remoteRequest.pipe(localResponse);
            } else {
              localResponse.writeHead(remoteRequest.statusCode);
              localResponse.end();
            }
          }).end();
        } else {
          next();
        }
      };
      return [proxy];
    }
  });
});

gulp.task('watch', function () {
  gulp.watch('./src/**/*.{html,png,jpeg,jpg,json}', ['copy']);
});

gulp.task('setdev', function () {
  isProd = false;
  process.env.NODE_ENV = 'development';
});


gulp.task('build', function(callback) {
  runSequence('clean', ['copy', 'scripts'], callback);
});

gulp.task('dev', ['setdev', 'connect', 'watch', 'build'])
gulp.task('default', ['build']);
