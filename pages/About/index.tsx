import Layout from "../../components/layout/Layout";
import { Container, Grid, Typography, Avatar } from "@mui/material";

const About = () => {
  const avatar = "/img/about/placeholder.gif";

  return (
    <Layout
      title="All about Justin ;-)"
      description="My about me page"
    >
      <Container maxWidth="md">
        <Grid container direction="column" spacing={8}>
          <Grid item>
            <Typography variant="h1" align="center" gutterBottom>
              Who is Justin Graham
            </Typography>
            <Typography variant="h2" align="center">
              A little about myself...
            </Typography>
          </Grid>
          <Grid item container spacing={2} alignItems="center">
            <Grid
              item
              container
              md={4}
              direction="column"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <Avatar
                  alt="avatar"
                  src={avatar}
                  sx={{
                    width: "8em",
                    height: "8em",
                    boxShadow: "0px 0px 10px 1px #b2b2b28f",
                  }}
                />
              </Grid>
              <Grid item>
                <Typography variant="h3">Justin Graham</Typography>
              </Grid>
            </Grid>
            <Grid item container md={8}>
              <Typography variant="body1">
                <br />
                <b>Coding: </b><br /> I have been interested in technology my entire life. I
                began coding in 2005. Software developement has been my
                profession since 2015. I have coded applications in C++, C#,
                Visual Basic and various scripting languages including Batch and
                Shell. My specialty is a strong understanding of JavaScript
                backed by an extreme passion for web applications. I have a
                burgeoning aspiration for TypeScript, the language which is
                quickly becoming the backbone of all modern and respectable web
                applications. <br /> <br /> <b>Personality: </b><br /> I tend to wear my heart on my
                shoulders, give honest and immediate feedback and be dependable
                for what needs to be done. Due to the reflection in my mirror
                mixed with being so forward, people tend to become nervous when
                they meet me. Because of this, I have learned to be as likeable
                as possible in order to overcome this invisible reaction I seem
                to insitgate. Because of this and a slight background in sales,
                I can be somewhat of a people person although my true nature is
                quiet and timid. <br /> <br /> <b>General Experience: </b><br /> I have managed and trained
                3 employees within a retail store. I regularly become a top
                choice for training others as my knowledge of subjects tends to
                be vast and thorough. <br /> <br /> <b>Other Thoughts: </b><br /> My interests dissimilar to
                coding include human molecular biology, physics as it pertains
                to space and/or earth mechanisms and human psychology.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default About;
