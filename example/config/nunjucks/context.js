const fs = require('fs-extra');
const path = require('path');

module.exports = {
  getContext: () => {
    const contextArchie = fs.readJsonSync(
      path.resolve(process.cwd(), 'src/data/archie.json')
    );
    const contextData = fs.readJsonSync(
      path.resolve(process.cwd(), 'src/data/data.json')
    );

    const templateContext = {
      ARCHIE: contextArchie,
      DATA: contextData,
      ENV: process.env.NODE_ENV
    };

    return templateContext;
  }
};
