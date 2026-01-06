import Layout from "../../components/layout/Layout";
import { Container, Grid, Typography, Link, Card, CardContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Portfolio = () => {
  const theme = useTheme();

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
          {projects.map((project) => (
            <Grid item key={project.name} sx={{ width: '100%' }}>
              <Card sx={{ backgroundColor: theme.palette.background.paper }}>
                <CardContent>
                  <Link
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: 'none' }}
                  >
                    <Typography variant="h5" sx={{ color: theme.palette.info.main }}>
                      {project.name}
                    </Typography>
                  </Link>
                  <Typography sx={{ color: theme.palette.text.primary, mt: 1 }}>
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
