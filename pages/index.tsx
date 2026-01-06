import Layout from "../components/layout/Layout";
import { Container, Typography } from "@mui/material";
import FullStackPopover from "../components/popover/fullstackpop/index";
import dynamic from "next/dynamic";

const LottieWrapper = dynamic(() => import('../components/LottieWrapper'), { ssr: false });

const Hangman = dynamic(() => import("../components/Games/Hangman/App"), { ssr: false });
const TicTacToe = dynamic(() => import("../components/Games/TicTacToe/App"), { ssr: false });
const Snake = dynamic(() => import("../components/Games/Snake/App"), { ssr: false });
const Tetris = dynamic(() => import("../components/Games/Tetris/App"), { ssr: false });

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
          <FullStackPopover />
        </Typography>
        <div>
          <LottieWrapper />
          <br />
          <br />
          <hr />
          <br />
          <br />
          <Hangman />
        </div>
        <br />
        <br />
        <hr />
        <br />
        <br />
        <TicTacToe />
        <br />
        <br />
        <hr />
        <br />
        <br />
        <Snake />
        <br />
        <br />
        <hr />
        <br />
        <br />
        <Tetris />
      </Container>
    </Layout>
  );
};

export default Home;
