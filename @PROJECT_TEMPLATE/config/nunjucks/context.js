const fs = require('fs-extra');
const path = require('path');
const getMeta = require(path.resolve(process.cwd(), 'meta.js'));

module.exports = {
  getContext: () => {
    const contextArchie = fs.readJsonSync(
      path.resolve(process.cwd(), 'src/data/archie.json')
    );
    const contextData = fs.readJsonSync(
      path.resolve(process.cwd(), 'src/data/data.json')
    );
    const contextMeta = getMeta({
      title: contextData.COPY.headline,
      description: contextData.COPY.subhed,
      updatedProps: {}
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
