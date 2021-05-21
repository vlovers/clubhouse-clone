import Cookies from 'nookies';
import { Axios } from '../core/axios';

import '../styles/globals.scss';

function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export const getServerSideProps = (ctx) => {
  const cookies = Cookies.get(ctx);
  if (cookies.token) {
    Axios.defaults.headers.Authorization = `Bearer ${cookies.token}`;
  }
};

export default App;
