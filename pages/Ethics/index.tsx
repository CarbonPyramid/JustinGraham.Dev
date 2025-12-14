import Layout from "../../components/layout/Layout";
import { Container, Grid, Typography } from "@mui/material";

const Ethics = () => {
  return (
    <Layout title="Ethics" description="Ethics">
      <Container maxWidth="md">
        <Grid container direction="column" alignItems="center" spacing={4}>
          <Grid item>
            <Typography>Ethics</Typography>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Ethics;
