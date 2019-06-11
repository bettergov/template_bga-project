module.exports = ({ title, description, updatedProps = {} } = {}) => {
  const pageTitle = title ? title : '<%=projectTitle%>';
  const pageDescription = description ? description : '';
  const publishPath = '<%=projectUrlPath%>/';

  const defaultProps = {
    pageTitle,
    pageDescription,
    publishPath,
    url: `https://projects.bettergov.org/${publishPath}`,
    stagingUrl: `http://stage-projects.bettergov.org/${publishPath}`,
    site_name: 'Better Government Association',
    host: 'www.bettergov.org',
    page_name: pageTitle,
    share: {
      fbook: {
        card_title: pageTitle,
        card_description: pageDescription,
        author: 'bettergov',
        appid: '1750445648593168'
      },
      twitter: {
        card_title: pageTitle,
        share_tweet: pageDescription,
        card_description: pageDescription,
        author: '@bettergov'
      },
      image: {
        url: `https://projects.bettergov.org/${publishPath}images/share.jpg`,
        alt: '<Text>',
        type: 'image/jpeg',
        width: '1000',
        height: '502'
      }
    }
  };

  return Object.assign(defaultProps, updatedProps);
};
