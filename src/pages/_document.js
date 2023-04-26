/* eslint-disable react/no-danger */
import React from 'react';
import Document, { Html, Main, NextScript, Head } from 'next/document';
import { ServerStyleSheet as StyledComponentSheets } from 'styled-components';
import MaterialUiServerStyleSheets from '@material-ui/styles/ServerStyleSheets';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const styledComponentSheet = new StyledComponentSheets();
    const materialUiSheets = new MaterialUiServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    const host = ctx.req.rawHeaders[ctx.req.rawHeaders.indexOf('Host') + 1];
    const blockRobots = host.includes('heroku');

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            styledComponentSheet.collectStyles(materialUiSheets.collect(<App {...props} />)),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        blockRobots,
        styles: [
          <React.Fragment key="styles">
            {initialProps.styles}
            {materialUiSheets.getStyleElement()}
            {styledComponentSheet.getStyleElement()}
          </React.Fragment>,
        ],
      };
    } finally {
      styledComponentSheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" href="/style/img/logo.ico" />

          <link
            href="//db.onlinewebfonts.com/c/2c8f6c3c149c5a07410e52cfb3b2db2b?family=mfn-icons"
            rel="stylesheet"
            type="text/css"
          />
          <link
            rel="stylesheet"
            id="wisme-front-style-css"
            href="/style/wisme-front-style.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            id="wp-block-library-css"
            href="/style/wp-block-library-css.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            id="simple-sitemap-css-css"
            href="/style/simple-sitemap-css-css.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            id="wcjp-frontend.css-css"
            href="/style/wcjp-frontend.css-css.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            id="mfn-base-css"
            href="/style/mfn-base-css.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            id="mfn-layout-css"
            href="/style/mfn-layout-css.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            id="mfn-shortcodes-css"
            href="/style/mfn-shortcodes-css.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            id="mfn-animations-css"
            href="/style/mfn-animations-css.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            id="mfn-jquery-ui-css"
            href="/style/mfn-jquery-ui-css.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            id="mfn-jplayer-css"
            href="/style/mfn-jplayer-css.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            id="mfn-responsive-css"
            href="/style/mfn-responsive-css.css"
            type="text/css"
            media="all"
          />
          <link
            rel="stylesheet"
            id="cstm-cds-css-css"
            href="/style/cstm-cds-css-css.css"
            type="text/css"
            media="all"
          />
          <link rel="stylesheet" href="/style/style.css" type="text/css" media="all" />
        </Head>
        <body className="home page-template-default page page-id-6  color-custom style-default button-default layout-full-width no-content-padding header-split header-semi header-fw minimalist-header-no sticky-header sticky-tb-color ab-hide subheader-both-center menu-link-color boxed2fw mobile-tb-center mobile-side-slide mobile-menu mobile-mini-ml-lc tablet-sticky mobile-sticky mobile-tr-header tr-header be-reg-2073">
          <Main />
          <NextScript />
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
var onWebChat={ar:[], set: function(a,b){if (typeof onWebChat_==='undefined'){this.ar.
push([a,b]);}else{onWebChat_.set(a,b);}},get:function(a){return(onWebChat_.get(a));},
w:(function(){ var ga=document.createElement('script'); ga.type = 'text/javascript';
ga.async=1;ga.src=('https:'==document.location.protocol?'https:':'http:') + 
'//www.onwebchat.com/clientchat/71a4f9f04d8a29c4c9c375a77ceae19f';var s=
document.getElementsByTagName('script')[0];s.parentNode.insertBefore(ga,s);})()}
          `,
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
