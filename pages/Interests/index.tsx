import Layout from "../../components/layout/Layout";
import { Container, Grid, Typography } from "@mui/material";

const Interests = () => {
  return (
    <Layout title="Interests" description="Interests">
      <Container maxWidth="md">
        <Grid container direction="column" alignItems="center" spacing={4}>
          <Grid item>
            <Typography>Interests</Typography>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Interests;
