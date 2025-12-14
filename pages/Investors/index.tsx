import Layout from "../../components/layout/Layout";
import { Container, Grid, Typography } from "@mui/material";

const Investors = () => {
  return (
    <Layout title="Investors" description="Investors">
      <Container maxWidth="md">
        <Grid container direction="column" alignItems="center" spacing={4}>
          <Grid item>
            <Typography>Investors</Typography>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Investors;
