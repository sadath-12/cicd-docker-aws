import { RecoilRoot } from 'recoil'
import '../styles/globals.css'
import TopBarProgress from 'react-topbar-progress-indicator';
import Router, { useRouter } from 'next/router';
import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { parseCookies } from "nookies";

const progressBarConfig = () => ({
  barColors: {
    0: '#2821eb',
  },
  shadowBlur: 5,
});


const theme = createTheme({
  palette: {
    primary: {
      main: '#362ffa'
    }
  }
});

const redirectUser = (ctx, location) => {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    Router.push({ pathname: location });
  }
};

function MyApp({ Component, pageProps }) {
  const [progress, setProgress] = useState(false);
  const router = useRouter();

  Router.events.on('routeChangeStart', () => setProgress(true));
  Router.events.on('routeChangeComplete', () => setProgress(false));
  TopBarProgress.config(progressBarConfig());
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        {progress && <TopBarProgress />}
        <Component {...pageProps} />
      </ThemeProvider>
    </RecoilRoot>
  )
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const { token, user } = parseCookies(ctx);
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  if (!(token && user)) {
    // if a user not logged in then user can't access those pages
    const isProtectedRoute =
      ctx.pathname === "/profile/dashboard" ||
      ctx.pathname === "/profile/[id]" ||
      ctx.pathname === '/post-service'
    if (isProtectedRoute) {
      redirectUser(ctx, "/login");
    }
  } else {
    // if a user logged in then user can't access those pages
    const ifLoggedIn =
      ctx.pathname === "/login" ||
      ctx.pathname === "/register";
    if (ifLoggedIn) {
      redirectUser(ctx, "/");
    }
    pageProps.user = JSON.parse(user);
  }
  return {
    pageProps,
  };
};

export default MyApp
