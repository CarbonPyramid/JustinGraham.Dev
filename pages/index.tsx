import Layout from "../components/layout/Layout";
import { Container, Typography } from "@mui/material";
import FullStackPopover from "../components/popover/fullstackpop/index";
import dynamic from "next/dynamic";

const Hangman = dynamic(() => import("../components/Games/Hangman/App"), { ssr: false });
const TicTacToe = dynamic(() => import("../components/Games/TicTacToe/App"), { ssr: false });
const LottiePopover = dynamic(() => import("../components/popover/lottiepop/index"), { ssr: false });

const Home = () => {
  return (
    <Layout
      title="Justin Graham Web Developer"
      description="Resume page for Justin Graham, full stack web developer"
    >
      <Container maxWidth="md">
        <Typography
          variant="h1"
          align="center"
          gutterBottom
          sx={{ marginBottom: "1em" }}
        >
          Welcome to the magical creations of <br />
          <br />
          <FullStackPopover />
        </Typography>
        <LottiePopover />
        <div>
          <hr />
          <br />
          <br />
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{ marginBottom: "1em" }}
          >
            Hang Man
          </Typography>
          <Hangman />
        </div>
        <br />
        <br />
        <hr />
        <br />
        <br />
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{ marginBottom: "1em" }}
        >
          Tic Tac Toe
        </Typography>
        <TicTacToe />
      </Container>
    </Layout>
  );
};

export default Home;
