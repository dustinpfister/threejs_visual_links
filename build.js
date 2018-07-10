let klaw = require('klaw'),
fs = require('fs-extra'),
through2 = require('through2'),
marked = require('marked'),
cheerio = require('cheerio'),
path = require('path'),

// dir to the posts
dir_posts = '../blog_posts/_posts',
dir_json = './';

let reports = [];

// klaw over folder
klaw(dir_posts)

// for each file
.pipe(through2.obj(function (item, enc, next) {

        let self = this;

        item.internals = []

        // read the file
        fs.readFile(item.path).then(function (data) {

            // parse to html with marked
            let html = marked(data.toString());

            // load html with cheerio
            let $ = cheerio.load(html);

            $('a').each(function (el, b) {

                let match = b.attribs.href.match(/^\//);

                if (match) {

                    item.internals.push(match.input);

                }

            })

            self.push(item);
            next();

        }).catch (function () {

            next();

        });

    }))

.on('data', function (item) {

    let report = {

        path: item.path,
        fn: path.basename(item.path).replace(/\.md$/, ''),
        internals: item.internals

    };

    console.log(report);

    reports.push(report);

});
