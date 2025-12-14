import Header from "./Header";
import Footer from "./Footer";
import Head from "next/head";

type LayoutProps = {
  children: React.ReactNode
  title?: string
  description?: string
  ogImage?: string
  url?: string
}

// export const Layout = function (props: Props) {
  // const { children, className } = props
  // const classes = useStyles(props)
  // const { selectedPage } = usePage()
  // return(<></>)}

  const Layout: React.FunctionComponent<LayoutProps> = ({ children, title, description, ogImage, url }) => {
  // website Url
  // const pageUrl =
  //   "";
  // when you share this page on facebook you'll see this image
  // const ogImg = "";
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
      <Header />
      <main>{children}</main>
      <Footer />
      <style jsx global>
        {`
          html,
          body {
            background: #f9f9f9;
            overflow-x: hidden;
            padding: 0 !important;
          }
          #__next {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          main {
            flex: 1;
          }
        `}
      </style>
    </>
  );
};
//             overflow-x: hidden;
//            

export default Layout;
