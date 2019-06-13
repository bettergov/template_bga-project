const fs = require('fs-extra');
const path = require('path');
const getMeta = require(path.resolve(process.cwd(), 'meta.js'));
const sizeOf = require('image-size');
const readChunk = require('read-chunk');
const imageType = require('image-type');

module.exports = {
  getContext: () => {
    const contextArchie = fs.readJsonSync(
      path.resolve(process.cwd(), 'src/data/archie.json')
    );
    const contextData = fs.readJsonSync(
      path.resolve(process.cwd(), 'src/data/data.json')
    );

    var shareImageUrl = 'social-card.jpg';
    var shareImagePath = path.resolve(
      process.cwd(),
      'src/static/',
      shareImageUrl
    );
    var dimensions = sizeOf(shareImagePath);
    var buffer = readChunk.sync(shareImagePath, 0, 12);

    const contextMeta = getMeta({
      title: contextData.COPY.seo_headline,
      description: contextData.COPY.subhed,
      updatedProps: {
        share: {
          image: {
            url: shareImageUrl,
            width: dimensions.width,
            height: dimensions.height,
            type: imageType(buffer).mime
          }
        }
      }
    });

    const templateContext = {
      ARCHIE: contextArchie,
      DATA: contextData,
      ENV: process.env.NODE_ENV,
      META: contextMeta
    };

    return templateContext;
  }
};
