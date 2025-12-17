import Layout from "../../components/layout/Layout";
import { Container, Grid, Typography, Link, Card, CardContent } from "@mui/material";
import CoffeeIcon from "@mui/icons-material/Coffee";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Investors = () => {
  const supportLinks = [
    {
      name: "Buy Me a Coffee",
      url: "https://buymeacoffee.com/justingoldx",
      description: "Support my work with a coffee",
      icon: <CoffeeIcon sx={{ fontSize: 40, color: '#FFDD00' }} />
    },
    {
      name: "GoFundMe",
      url: "https://gofund.me/798681bf2",
      description: "Help fund my projects",
      icon: <FavoriteIcon sx={{ fontSize: 40, color: '#00b964' }} />
    }
  ];

  return (
    <Layout title="Investors" description="Support my work">
      <Container maxWidth="md">
        <Grid container direction="column" alignItems="center" spacing={4}>
          <Grid item>
            <Typography variant="h2" gutterBottom>Support My Work</Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', mb: 4 }}>
              If you find my work valuable, consider supporting me through one of these platforms.
            </Typography>
          </Grid>
          {supportLinks.map((link) => (
            <Grid item key={link.name} sx={{ width: '100%' }}>
              <Card sx={{ backgroundColor: '#18191f' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  {link.icon}
                  <div>
                    <Link
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textDecoration: 'none' }}
                    >
                      <Typography variant="h5" sx={{ color: '#9440f3' }}>
                        {link.name}
                      </Typography>
                    </Link>
                    <Typography sx={{ color: '#fff', mt: 1 }}>
                      {link.description}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export default Investors;
