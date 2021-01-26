import React from "react";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import MainPage from "./pages/Main";

const useStyles = makeStyles({
  mainDiv: {
    backgroundColor: "#F0F0FF",
    minHeight: "100vh",
    height: "100%",
    width: "100%",
  },
});

function App() {
  const classes = useStyles();

  return (
    <div className={classes.mainDiv}>
      <MainPage />
    </div>
  );
}

export default App;
