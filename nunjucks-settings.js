const safe = require('nunjucks').runtime.markSafe;
const marked = require('marked');
const _ = require('lodash');

marked.setOptions({ smartypants: true });

module.exports = {
  markdownFilter: (str, kwargs) => {
    // strip outer <p> tags?
    const strip = typeof kwargs === 'undefined' ? false : kwargs.strip || false;
    return !strip
      ? safe(marked(str))
      : safe(
        marked(str)
          .trim()
          .replace(/^<p>|<\/p>$/g, ''),
      );
  },
  getArtClasses: (row) => {
    const classes = ['art'];
    classes.push(row.type);
    if (_.includes(['small', 'medium', 'large', 'jumbo'], row.width)) {
      classes.push(row.width);
    }
    if (_.includes(['right', 'left'], row.float)) {
      classes.push(`align-${row.float}`);
    }
    return classes.join(' ');
  },
  attrFilter: (element, attr) => {
    const patt = new RegExp('ATTR="([^"]*)'.replace('ATTR', attr));
    return patt.exec(element)[1];
  },
  typeFilter: val => typeof val,
  getArtFromData: (slug, data) => _.find(data, d => d.slug === slug),
};
