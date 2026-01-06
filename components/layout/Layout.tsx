import Header from "./Header";
import Head from "next/head";
import { useTheme } from "@mui/material/styles";
import { GlobalStyles } from "@mui/material";

type LayoutProps = {
  children: React.ReactNode
  title?: string
  description?: string
  ogImage?: string
  url?: string
}

const Layout: React.FunctionComponent<LayoutProps> = ({ children, title, description, ogImage, url }) => {
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>
          {title
            ? title
            : "JustinGraham.dev"}
        </title>
        <meta
          name="Justin Graham web developer"
          key="The magical creations of Justin Graham"
          content={
            description
              ? description
              : ""
          }
        />
        <meta
          property="og:title"
          content={
            title
              ? title
              : ""
          }
          key="og:title"
        />
        <meta property="og:url" content={url ? url : "justingraham.dev"} key="og:url" />
        <meta
          property="og:image"
          content={ogImage ? ogImage : "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png"}
          key="og:image"
        />
        <meta
          property="og:description"
          content={
            description
              ? description
              : "Justin Graham, full stack web developer"
          }
          key="og:description"
        />
      </Head>
      <GlobalStyles
        styles={{
          'html, body': {
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            overflowX: 'hidden',
            padding: '0 !important',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
          '#__next': {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
          main: {
            flex: 1,
          },
        }}
      />
      <Header />
      <main>{children}</main>
    </>
  );
};

export default Layout;
