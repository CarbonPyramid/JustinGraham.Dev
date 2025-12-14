import Layout from "../../components/layout/Layout";
import { Container, Grid, Typography, Link } from "@mui/material";

const LottieInfo = () => {
  return (
    <Layout title="Learn to code" description="Where learning to code begins!">
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ margin: "5em" }}
      >
        Lottie files are at the cutting edge of web animation currently. There
        size means that they can be used more often without concern over load
        times. You can incorporate lots of sublte animations to make a cohesive
        design or focus your efforts on one centerpiece. All you need to get
        started is a lottie file and the plugin. The plugin itself is also small
        and it allows control over the animation at runtime. Lottie files are
        backed by the nations biggest companies, have a large designer base who
        provide lots of free animations or quality paid choices and have tons of
        resources to design lottie files online, for free. Read more about them
        here
      </Typography>
      <Container maxWidth="md">
        <Container maxWidth="md">
          <Grid item>
            <Container maxWidth="sm">
              <Typography variant="h2" align="center">
                <Link
                  href="https://airbnb.design/lottie/"
                  target="_blank"
                  rel="noopener"
                >
                  Lottie and Airbnb, an open source love affair
                </Link>
              </Typography>
              <Typography variant="h2" align="center">
                <Link
                  href="https://lottiefiles.com/"
                  target="_blank"
                  rel="noopener"
                >
                  Lottie Designer Marketplace
                </Link>
              </Typography>
              <Typography variant="h2" align="center">
                <Link
                  href="https://lottiefiles.com/editor"
                  target="_blank"
                  rel="noopener"
                >
                  Lottie Online Editor
                </Link>
              </Typography>
              <Typography variant="h2" align="center">
                <Link
                  href="https://github.com/lottiefiles"
                  target="_blank"
                  rel="noopener"
                >
                  Lottie Developer Resources
                </Link>
              </Typography>
            </Container>
          </Grid>
          <Grid item></Grid>
        </Container>
      </Container>
    </Layout>
  );
};

export default LottieInfo;
