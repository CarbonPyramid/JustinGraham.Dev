import Layout from "../../components/layout/Layout";
import { Container, Grid, Typography } from "@mui/material";

const About = () => {
  return (
    <Layout
      title="About"
      description="My about me page"
    >
      <Container maxWidth="md">
        <Grid container direction="column" spacing={4}>
          <Grid item>
            <Typography variant="h2" align="center" gutterBottom>
              A little about myself...
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              With technology being a hobby of mine since I was a small child of the 80's, technology means a lot of different things to me. I've been interested in software development since being exposed to it via MySpace. Thanks Tom, you were never in my top 8 but will always be in my top 8. I've got a wide array technology software and technology hardware build, deployment, and support experience that spans small, medium, and large scale techonology infrastructure. The languages necessary to cross these platforms is my focus, automation for basic function, training AI models for enhanced capabilities, focusing on a user driven experience.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default About;
