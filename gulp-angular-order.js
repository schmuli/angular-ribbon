var path = require('path');
var through = require('through2');

module.exports = function () {
    var files = [];

    return through.obj(function (file, enc, cb) {
        files.push(file);

        cb();
    }, function (cb) {
        var orderedFiles = sortFiles(files);
        orderedFiles.forEach(function (file) {
            this.push(file);
        }, this);

        cb();
    });
};

function sortFiles(files) {
    var result = [];

    files.forEach(function (file) {

    });

    return result;
}