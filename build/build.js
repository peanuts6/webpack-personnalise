const path = require('path');

module.exports = {
    js: {
        polyfill: {
            inline: false,
            src: [
                'public/vendor/console-polyfill.js'
            ]
        },
        avalon: {
            inline: false,
            src: [
                'public/vendor/avalon/avalon.js',
                'public/vendor/avalon/mmDux.js',
                'public/vendor/avalon/mmRouter.js'
            ]
        }
    }
}
