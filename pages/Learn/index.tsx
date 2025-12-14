import Layout from "../../components/layout/Layout";
import { Container, Grid, Typography } from "@mui/material";

const Learn = () => {
  return (
    <Layout title="Learn to code" description="Where learning to code begins!">
      <Container maxWidth="md">
        <Grid container direction="column" spacing={8}>
          <Grid item>
            <Typography variant="h3" align="center" gutterBottom>
              <p>Html</p>
              <br />
              <p>Css</p>
              <br />
              <p>JavaScript</p>
              <br />
              <p>TypeScript</p>
              <br />
              <p>SQL</p>
              <br />
              <p>MongoDB</p>
              <br />
              <p>GraphQL</p>
              <br />
              <p>NodeJS</p>
              <br />
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Learn;
