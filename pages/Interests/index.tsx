import Layout from "../../components/layout/Layout";
import { Container, Grid, Typography, Link, Card, CardContent } from "@mui/material";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import SatelliteAltIcon from "@mui/icons-material/SatelliteAlt";

const Interests = () => {
  const interests = [
    {
      name: "Hacker News",
      url: "https://news.ycombinator.com/",
      description: "Social news website focusing on computer science and entrepreneurship",
      icon: <NewspaperIcon sx={{ fontSize: 40, color: '#ff6600' }} />
    },
    {
      name: "Space Weather Dashboard",
      url: "https://www.swpc.noaa.gov/communities/space-weather-enthusiasts-dashboard",
      description: "NOAA Space Weather Prediction Center - Real-time solar and geomagnetic data",
      icon: <WbSunnyIcon sx={{ fontSize: 40, color: '#ffcc00' }} />
    },
    {
      name: "SSEC Real-Time Weather",
      url: "https://re.ssec.wisc.edu",
      description: "Space Science and Engineering Center - Real-time satellite imagery",
      icon: <SatelliteAltIcon sx={{ fontSize: 40, color: '#00bcd4' }} />
    }
  ];

  return (
    <Layout title="Interests" description="Things I find interesting">
      <Container maxWidth="md">
        <Grid container direction="column" alignItems="center" spacing={4}>
          <Grid item>
            <Typography variant="h2" gutterBottom>Interests</Typography>
            <Typography variant="body1" sx={{ textAlign: 'center', mb: 4 }}>
              Some things I find fascinating and worth sharing.
            </Typography>
          </Grid>
          {interests.map((interest) => (
            <Grid item key={interest.name} sx={{ width: '100%' }}>
              <Card sx={{ backgroundColor: '#18191f' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  {interest.icon}
                  <div>
                    <Link
                      href={interest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textDecoration: 'none' }}
                    >
                      <Typography variant="h5" sx={{ color: '#9440f3' }}>
                        {interest.name}
                      </Typography>
                    </Link>
                    <Typography sx={{ color: '#fff', mt: 1 }}>
                      {interest.description}
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

export default Interests;
