import Layout from "../../components/layout/Layout";
import { Container, Grid, Typography } from "@mui/material";

const Portfolio = () => {
  return (
    <Layout title="Portfolio" description="Portfolio">
      <Container maxWidth="md">
        <Grid container direction="column" alignItems="center" spacing={4}>
          <Grid item>
            <Typography>Portfolio</Typography>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Portfolio;
