const {src, dest, parallel, series, watch} = require("gulp");
const scss = require('gulp-sass')(require('sass'));
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
const fileinclude = require("gulp-file-include");
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fs = require('fs');
const del = require('del');
const webpack = require('webpack');
const imagemin = require('gulp-imagemin');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;


const clean = () => {
    return del(['app/*'])
}

function images() {
    return src("src/img/**/*.*")
      .pipe(
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ quality: 75, progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 }),
          imagemin.svgo({
            plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
          }),
        ])
      )
      .pipe(dest("app/img/"));
  }

const scriptsBuild = () => {
    return src('./src/js/main.js')
    .pipe(webpackStream({
        output:{
            filename: 'main.js',
    
        },
        module: {
            rules: [
              {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                      ['@babel/preset-env', { targets: "defaults" }]
                    ]
                  }
                }
              }
            ]
          }
    }))
    .pipe(uglify().on('error', notify.onError()))
}

const fonts = () =>{
    src('./src/fonts/**.ttf')
    .pipe(ttf2woff())
    .pipe(dest("./app/fonts/"))
    return src('./src/fonts/**.ttf')
    .pipe(ttf2woff2())
    .pipe(dest("./app/fonts/"))
}

const cb = () => {}

let srcFonts = './src/scss/_fonts.scss';
let appFonts = './app/fonts/';

const fontsStyle = (done) => {
	let file_content = fs.readFileSync(srcFonts);

	fs.writeFile(srcFonts, '', cb);
	fs.readdir(appFonts, function (err, items) {
		if (items) {
			let c_fontname;
			for (var i = 0; i < items.length; i++) {
				let fontname = items[i].split('.');
				fontname = fontname[0];
				if (c_fontname != fontname) {
					fs.appendFile(srcFonts, '@include font-face("' + fontname + '", "' + fontname + '", 400);\r\n', cb);
				}
				c_fontname = fontname;
			}
		}
	})

	done();
}


const imgToApp  = () =>{
    return src(['./src/img/**.jpg', './src/img/**/*.png', './src/img/**/*.jpeg, ./src/img/**/*.svg'])
    .pipe(dest('./app/img'))
};
const svgSprite = require("gulp-svg-sprite");
const { stopCoverage } = require("v8");

const svgSprites = () =>{
    return src("./src/img/**.svg")
    .pipe(svgSprite({
        mode:{
            stack:{
                sprite:"../sprite.svg"
            }
        }
    }))
    .pipe(dest('./app/img'))
}

const resources = () => {
    return src('./src/resources/**')
    .pipe(dest('./app'))
}

const stylesBuild = () => {
    return src('./src/scss/**/*.scss')
    
    .pipe(scss({
        outputStyle: 'expanded'
    }).on('error', notify.onError()))
    .pipe(rename({
        suffix:".min"
    }))
    .pipe(autoprefixer({
        cascade:false,
    }))
    .pipe(cleanCSS({
        level:2
    }))
    .pipe(dest('app/css/'))
}

const htmlInclude = () =>{
    return src(['./src/index.html'])
    .pipe(fileinclude({
        prefix:'@',
        basepath:'@file'
    }))
    .pipe(dest('./app'))
    .pipe(browserSync.stream())
}

const watchFiles = () =>{
    browserSync.init({
        server: {
            baseDir: "./app"
        },
        notify:false
    });
    watch('./src/scss/**/*.scss', styles);
    watch('./src/index.html', htmlInclude);
    watch('./src/img/**/*.jpg', imgToApp);
    watch('./src/img/**/*.png', imgToApp);
    watch('./src/img/**/*.jpeg', imgToApp);
    watch('./src/img/**/*.svg', imgToApp);
    // watch('./src/img/**.svg', svgSprites);
    watch('./src/resources/**', resources);
    watch('./src/fonts/**.ttf', fonts);
    watch('./src/fonts/**.ttf', fontsStyle);
    watch('./src/js/**/*.js', scripts);




}
exports.stylesBuild = stylesBuild;
exports.watchFiles = watchFiles;
exports.fileinclude = htmlInclude;
exports.images = images;
exports.build = series(clean, images, parallel(htmlInclude, scriptsBuild, fonts, imgToApp, svgSprites, resources), fontsStyle, stylesBuild, watchFiles);



const scripts = () => {
    return src('./src/js/main.js')
    .pipe(webpackStream({
        output:{
            filename: 'main.js',
    
        },
        module: {
            rules: [
              {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                      ['@babel/preset-env', { targets: "defaults" }]
                    ]
                  }
                }
              }
            ]
          }
    }))
    .pipe(sourcemaps.init())
    .pipe(uglify().on('error', notify.onError()))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./app/js'))
    .pipe(browserSync.stream());
}

const styles = () => {
    return src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(scss({
        outputStyle: 'expanded'
    }).on('error', notify.onError()))
    .pipe(rename({
        suffix:".min"
    }))
    .pipe(autoprefixer({
        cascade:false,
    }))
    .pipe(cleanCSS({
        level:2
    }))
    .pipe(sourcemaps.write("."))
    .pipe(dest('app/css/'))
    .pipe(browserSync.stream());
}
exports.styles = styles;
exports.default = series(clean, images, parallel(htmlInclude, scripts, fonts, imgToApp, resources),  fontsStyle, styles, watchFiles);
