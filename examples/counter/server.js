import express from 'express';


const app = express();


if (process.env.NODE_ENV !== 'production') {
  const configuration = require('./webpack.config');

  const webpack = require('webpack');
  const compile = webpack(configuration);
  const options = {
    noInfo: true, publicPath: configuration.output.publicPath
  };

  app.use(require('webpack-dev-middleware')(compile, options));
  app.use(require('webpack-hot-middleware')(compile));
}


app.get('/*', (req, res) => {
  const output = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Counter</title>
      </head>
      <body>
        <span id="root-mount"></span>
        <script src="/static/bundle.js"></script>
      </body>
    </html>`;

  return res.send(output);
});


const port = process.env.PORT || 5000;
app.listen(port, (error) => {
  if (error) {
    throw error;
  } else {
    console.log(`Server listening on port: ${port}`);
  }
});
