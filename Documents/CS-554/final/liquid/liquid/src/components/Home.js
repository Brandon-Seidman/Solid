import React, { useState, useEffect } from "react";
import "../App.css";
import { Link } from "react-router-dom";

import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  FormGroup,
  makeStyles,
  Checkbox,
  FormControlLabel,
  TableBody,
} from "@material-ui/core";

const useStyles = makeStyles({
  card: {
    maxWidth: 500,
    height: "auto",
    marginTop: 10,
    borderRadius: 6,
  },
  filters: {
    maxWidth: 200,
    height: "auto",
    marginLeft: 20,

    borderRadius: 6,
  },
  grid: {
    flexGrow: 1,
    flexDirection: "row",
  },
});
const Home = (props) => {
  const classes = useStyles();
  let examplePost = {
    title: "Shannon's Protein Shake",
    ingredients: ["milk", "frozen fruit", "protein powder"],
    description:
      "A simple and easy meal replacement shake that tastes great! 1 Part milk, 1 part frozen fruit (I like to use strawberries and pineapple), and 1 scoop of your favorite protein shake!",
    difficulty: 1,
  };

  const buildCard = (post) => {
    return (
      <Grid item>
        <Card className={classes.card} variant="outlined">
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h3" component="h2">
                {post.title}
              </Typography>
              <Typography gutterBottom variant="h6" component="h3">
                {post.description}
              </Typography>
              <Typography>
                Ingredients Needed:
                {post.ingredients.map((ingredients) => {
                  return <li>{ingredients}</li>;
                })}
              </Typography>
              <Typography>Difficulty: {post.difficulty}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  return (
    <div className="postsBody">
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        flexGrow="1"
        flexDirection="row"
        spacing={2}
      >
        <Grid className={classes.filters} item>
          <Card variant="outlined">
            <CardContent>
              <Typography gutterBottom variant="h6" component="h3">
                Filter By:
              </Typography>
              <FormGroup>
                <FormControlLabel
                  label="Alcoholic"
                  control={<Checkbox color="primary" />}
                  labelPlacement="end"
                />
                <FormControlLabel
                  label="Non-Alcoholic"
                  control={<Checkbox color="primary" />}
                  labelPlacement="end"
                />
                <FormControlLabel
                  label="Smoothies"
                  control={<Checkbox color="primary" />}
                  labelPlacement="end"
                />
                <FormControlLabel
                  label="Dairy Free"
                  control={<Checkbox color="primary" />}
                  labelPlacement="end"
                />
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>
        <Grid item className={classes.grid} spacing={1}>
          {examplePost && buildCard(examplePost)}
        </Grid>
      </Grid>
    </div>
  );
};
export default Home;
