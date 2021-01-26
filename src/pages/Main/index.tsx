import React from "react";
// import { Container } from "./styles";
import { Container, Grid, Paper, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  header: {
    marginTop: "20px",
    padding: "30 30px",
  },
  title: {
    color: "#9412DC",
  },
  paper: {
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  button: {
    backgroundColor: "#9412DC",
    color: "#FFFFFF",
    marginTop: "20px",
  },
});

const MainPage = () => {
  const classes = useStyles();

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.header}>
            <Typography
              variant="h1"
              component="h2"
              align="center"
              className={classes.title}
            >
              Job Finder
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Typography variant="subtitle2" component="h2" align="center">
              In this demo the search for candidates is based on MySQL
              technology
            </Typography>
            <Button variant="contained" className={classes.button}>
              Start Now!
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Typography variant="subtitle2" component="h2" align="center">
              In this demo the search for candidates is based on ElasticSearch
              technology
            </Typography>
            <Button variant="contained" className={classes.button}>
              Start Now!
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MainPage;
