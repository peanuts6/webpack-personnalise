module.exports = function (templateParams) {
    let partialFile = templateParams.htmlWebpackPlugin.options.entryName;
    let partial = require('../pages/'+partialFile+'.html')
    let html = `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8" />
            <meta name="renderer" content="webkit" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${templateParams.htmlWebpackPlugin.options.title}</title>
            <link type="text/css" href="/vendor/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link type="text/css" href="/styles/main.css" rel="stylesheet" />
        </head>
        <body>
            ${partial}
            <script src="/vendor/jquery/dist/jquery.min.js"></script>
            <script src="/vendor/bootstrap/dist/js/bootstrap.min.js"></script>
            <script src="/${partialFile}.js"></script>
            </body>
            </html>`
            
    return html;
            // <script src="${partialFile}.js"></script>
};