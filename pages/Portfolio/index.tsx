import Layout from "../../components/layout/Layout";
import { Container, Grid, Typography, Link, Card, CardContent } from "@mui/material";

const Portfolio = () => {
  const projects = [
    {
      name: "JustinGraham.dev",
      url: "https://justingraham.dev",
      description: "Personal portfolio website"
    },
    {
      name: "Ozark.dev",
      url: "https://ozark.dev",
      description: "Ozark development project"
    },
    {
      name: "GitHub",
      url: "https://github.com/CarbonPyramid",
      description: "View all projects on GitHub"
    }
  ];

  return (
    <Layout title="Portfolio" description="Portfolio">
      <Container maxWidth="md">
        <Grid container direction="column" alignItems="center" spacing={4}>
          <Grid item>
            <Typography variant="h2" gutterBottom>Portfolio</Typography>
          </Grid>
          {projects.map((project) => (
            <Grid item key={project.name} sx={{ width: '100%' }}>
              <Card sx={{ backgroundColor: '#18191f' }}>
                <CardContent>
                  <Link
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: 'none' }}
                  >
                    <Typography variant="h5" sx={{ color: '#9440f3' }}>
                      {project.name}
                    </Typography>
                  </Link>
                  <Typography sx={{ color: '#fff', mt: 1 }}>
                    {project.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export default Portfolio;
