let klaw = require('klaw'),
fs = require('fs-extra'),
through2 = require('through2'),
marked = require('marked'),

// dir to the posts
dir_posts = '../blog_posts/_posts';

klaw(dir_posts)

.pipe(through2.obj(function (item, enc, next) {

        let self = this;

        fs.readFile(item.path).then(function (data) {

            let html = marked(data.toString());

            self.push(item);
            next();

        }).catch (function () {

            next();

        });

    }))

.on('data', function (item) {

    //console.log(item.path)

});
