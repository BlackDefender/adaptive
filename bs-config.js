module.exports = {
    proxy: 'http://domain.sample/',
    injectChanges: true,
    browser: 'chrome',
    files: [
        '**/*.php',
    ],
};
