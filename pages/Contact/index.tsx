import Layout from "../../components/layout/Layout";
import { Container, Grid, Typography } from "@mui/material";

const Contact = () => {
  return (
    <Layout title="Contact" description="Contact">
      <Container maxWidth="md">
        <Grid container direction="column" alignItems="center" spacing={4}>
          <Grid item>
            <Typography>Contact</Typography>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Contact;
