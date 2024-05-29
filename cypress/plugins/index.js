const path = require('path');

module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, args) => {
    console.log(config, browser, args);
    if (browser.name === 'chrome') {
      args.push("--disable-features=CrossSiteDocumentBlockingIfIsolating,CrossSiteDocumentBlockingAlways,IsolateOrigins,site-per-process");
    }
    return args;
  });
};