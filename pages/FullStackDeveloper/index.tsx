import Layout from "../../components/layout/Layout";
import { Container, Grid, Typography } from "@mui/material";
import styles from './styles.module.scss';

const FullStack = () => {
  return (
    <Layout
      title="Full Stack Developer"
      description="Explanation of full stack developement"
    >
      <Container maxWidth="md">
        <Grid container direction="column" spacing={8}>
          <Grid item>
            <Typography variant="h3" align="center" gutterBottom component="div">
              <h1>Full Stack Web Developer</h1>

              <p>
                A full stack web developer is a person who can develop both
                client and server software. In addition to mastering HTML and
                CSS, he/she also knows how to:
              </p>

              <li>
                Program a browser (like using JavaScript, jQuery, Angular, or
                Vue)
              </li>
              <li>Program a server (like using PHP, ASP, Python, or Node)</li>
              <li>
                Program a database (like using SQL, SQLite, or MongoDB)
              </li>

              <br />
              <br />
              <div className={styles.row}>
                <div className={styles.column}>
                  <b>Client Software(Front End)</b>
                  <br />
                  HTML CSS Bootstrap JavaScript ES5
                  <br />
                  HTML DOM JSON XML jQuery Angular
                  <br />
                  React Backbone.js Ember.js Redux Storybook
                  <br />
                  GraphQL Meteor.js Grunt Gulp
                </div>
                <div className={styles.column}>
                  <b>Server Software (Back End)</b>
                  <br />
                  PHP ASP C++ C# Java
                  <br />
                  Python Node.js Express.js Ruby REST
                  <br />
                  GO SQL MongoDB Firebase.com Sass
                  <br />
                  Less Parse.com PaaS (Azure and Heroku)
                </div>
              </div>
              <br />
              <br />

              <h3>Popular Stacks</h3>
              LAMP stack: JavaScript - Linux - Apache - MySQL - PHP
              <br />
              LEMP stack: JavaScript - Linux - Nginx - MySQL - PHP
              <br />
              MEAN stack: JavaScript - MongoDB - Express - AngularJS - Node.js
              <br />
              Django stack: JavaScript - Python - Django - MySQL
              <br />
              Ruby on Rails: JavaScript - Ruby - SQLite - Rails
              <br />
              <br />

              <h3>Advantages</h3>
              The advantage of being a full stack web developer is: You can
              master all the techniques involved in a development project You can
              make a prototype very rapidly You can provide help to all the team
              members You can reduce the cost of the project You can reduce the
              time used for team communication You can switch between front and
              back end development based on requirements You can better understand
              all aspects of new and upcoming technologies

              <h3>Disadvantages</h3>
              The solution chosen can be wrong for the project The solution
              chosen can be dependent on developer skills The solution can
              generate a key person risk Being a full stack developer is
              increasingly complex
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default FullStack;
