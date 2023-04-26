import App from 'next/app';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withRouter } from 'next/router';
import withRedux from 'next-redux-wrapper';

import '../utils/i18n';

// import '../assets/css/markdown.css';
// import '../assets/css/main.css';

import initStore from '../utils/redux';
import { routing } from '../routes';
import { RouteHandler, Onload } from '../containers';
import { getQuery } from '../utils/navigation';
import { i18n } from '../utils/i18n';

class MyApp extends App {
  // Fetching serialized(JSON) store state
  static async getInitialProps({ Component, ctx }) {
    await routing({ ...ctx });
    const pageProps = Component.getInitialProps ? await Component.getInitialProps({ ...ctx }) : {};

    return { pageProps };
  }

  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) jssStyles.parentNode.removeChild(jssStyles);

    if (typeof window !== 'undefined') {
      const ref = getQuery('ref');
      const price = getQuery('price');
      const service = getQuery('service');
      const lang = getQuery('lang');

      if (ref) {
        localStorage.setItem('ref', ref);
      }

      if (price) {
        localStorage.setItem('price', price);
      }

      if (service) {
        localStorage.setItem('service', service);
      }

      if (lang) {
        i18n.changeLanguage(lang);
        localStorage.setItem('lang', lang);
      } else {
        const localLang = localStorage.getItem('lang');

        if (localLang) {
          i18n.changeLanguage(localLang);
        }
      }
    }
  }

  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <ReduxProvider store={store}>
        <RouteHandler />
        <Onload />
        <CssBaseline />
        <Component {...pageProps} />
      </ReduxProvider>
    );
  }
}

export default withRouter(withRedux(initStore, { debug: false })(MyApp));
