const path = require('path');
const package_json = require('./package.json');

const gulp = require("gulp");
const packager = require('electron-packager');

//打包程序
gulp.task('package_electron', function (done) {
    const options = {
        dir: __dirname,
        out: path.resolve(__dirname, `./release/${package_json.version}`),
        appCopyright: `${package_json.author} - ${package_json.license}`,
        platform: 'win32',
        arch: 'x64',
        asar: false,
        prune: true,    //在有些版本的npm下肯能会失败
        icon: package_json.icon && path.resolve(__dirname, package_json.icon),
        ignore: '/\\.vscode|electron_build|release|gulpfile\\.js($|/)',    //打包时忽略
        download: {
            cache: path.resolve(__dirname, './electron_build'),
            mirror: 'https://npm.taobao.org/mirrors/electron/'
        }
    };

    packager(options, function done_callback(err, appPaths) {
        console.log(err, appPaths);
        done();
    });
});