import Layout from "../../components/layout/Layout";
import { Container, Grid, Typography } from "@mui/material";

const Legal = () => {
  return (
    <Layout title="Legal" description="Legal">
      <Container maxWidth="md">
        <Grid container direction="column" alignItems="center" spacing={4}>
          <Grid item>
            <Typography>Legal</Typography>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Legal;
