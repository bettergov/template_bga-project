const { argv } = require('yargs');
const prompt = require('gulp-prompt');
const rename = require('gulp-rename');
const awspublish = require('gulp-awspublish');
const invalidate = require('gulp-cloudfront-invalidate-aws-publish');
const gulp = require('gulp');
const fail = require('gulp-fail');
const gulpIf = require('gulp-if');
const gutil = require('gulp-util');
const fs = require('fs-extra');
const path = require('path');
const open = require('open');
const revAll = require('gulp-rev-all');
const querystring = require('querystring');

const target = argv.production
  ? process.env.S3_PROD_BUCKET
  : process.env.S3_STAGE_BUCKET;

const region = process.env.S3_REGION;

const publishParams = {
  Bucket: target
};

if (argv.production) {
  publishParams.Cloudfront = process.env.CLOUDFRONT_DISTRIBUTION_ID;
}

const meta = fs.readJsonSync(path.resolve(process.cwd(), 'meta.json'));
const publisher = awspublish.create({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region,
  params: publishParams
});
const awsDirectory = meta.publishPath;

const cacheControl = 'max-age=300, no-transform, public';

let acl = 'private';

if (argv.production) {
  acl = 'public-read';
}

const headers = {
  'Cache-Control': cacheControl,
  'x-amz-acl': acl
};

// Ignore these files during versioning
const versionIgnore = [
  '.html', // html files (not regex)
  /.*images.*$/, // images
  /.*\.json$/, // application data
  /.*\.csv$/ // application data
];

const cloudFrontConfig = {
  distribution: process.env.CLOUDFRONT_DISTRIBUTION_ID,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  indexRootPath: true
};

function checkFileExtension(file) {
  const videoExtensions = ['.mp4', '.ogv', '.webm'];
  if (videoExtensions.indexOf(path.extname(file.path)) < 0) {
    return true;
  } else {
    console.log(`skipping gzip: ${file.path}`);
    return false;
  }
}

async function main() {
  gulp
    .src('./public/**/*')
    .pipe(
      gulpIf(() => {
        // As a dumb check against syncing the entire bucket
        // we check to make sure you're putting your project at
        // least 2 directories deep.
        const depth = awsDirectory.replace(/\/$/, '').split('/').length;
        return depth < 2;
      }, fail(`Can't publish to ${awsDirectory}. Check meta.json and your publishPath setting.`))
    )
    .on('end', () => {
      gutil.log(
        gutil.colors.cyan(
          `You're about to publish this project to AWS bucket ${gutil.colors.bold.black.bgYellow(
            target
          )} under directory ${gutil.colors.bold.black.bgYellow(
            awsDirectory
          )}. This will sync this directory with your local dist folder and may cause files to be deleted.`
        )
      );
    })
    .pipe(prompt.confirm('Are you sure?'))
    .pipe(
      rename(pubPath => {
        // eslint-disable-next-line no-param-reassign
        pubPath.dirname = path.join(
          awsDirectory,
          pubPath.dirname.replace('.\\', '')
        );
      })
    )
    .pipe(
      revAll.revision({
        dontRenameFile: versionIgnore,
        dontUpdateReference: versionIgnore
      })
    )
    .pipe(gulpIf(checkFileExtension, awspublish.gzip()))
    .pipe(publisher.publish(headers, { force: false }))
    .pipe(publisher.sync(awsDirectory))
    // eslint-disable-next-line no-extra-boolean-cast
    .pipe(!!argv.invalidate ? invalidate(cloudFrontConfig) : gutil.noop())
    .pipe(publisher.cache())
    .pipe(awspublish.reporter())
    .on('end', () => {
      setTimeout(() => {
        const metaUrl = argv.production ? meta.url : meta.stagingUrl;

        const q = querystring.stringify({ q: metaUrl });
        if (argv.production) {
          open(`https://developers.facebook.com/tools/debug/sharing/?${q}`);
        }
        open(metaUrl);
      }, 1000);
    });
}

module.exports = cb => {
  main().catch(console.error);
  cb();
};
