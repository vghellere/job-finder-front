import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  ReactiveBase,
  ReactiveList,
  MultiDropdownList,
  RangeSlider,
} from "@appbaseio/reactivesearch";
import { Done } from "@material-ui/icons";

const useStyles = makeStyles({
  paper: {
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    minHeight: "100px",
  },
  chipTech: {
    margin: "3px",
  },
  resultGrid: {
    justifyContent: "center",
    alignItems: "center",
    align: "center",
  },
  experienceFilter: {
    marginTop: "50px",
  },
});

const sortOptions = [
  {
    label: "Experience ▴",
    dataField: "years_experience",
    sortBy: "asc",
  },
  {
    label: "Experience ▾",
    dataField: "years_experience",
    sortBy: "desc",
  },
  {
    label: "City ▴",
    dataField: "city",
    sortBy: "asc",
  },
  {
    label: "City ▾",
    dataField: "city",
    sortBy: "desc",
  },
];

const SearchElastic = () => {
  const classes = useStyles();
  const elasticProxyUrl = `${process.env.REACT_APP_API_URL}/candidates/elastic-proxy`;

  const renderCandidateExperience = (candidate: any) => {
    if (candidate.years_experience.lte !== 99) {
      return (
        <strong>
          {candidate.years_experience.gte}-{candidate.years_experience.lte}
        </strong>
      );
    }
    return <strong>{candidate.years_experience.gte}+</strong>;
  };

  const renderCardCandidate = (candidate: any) => {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="h2">
            Candidate ID: {candidate.candidate_id}
          </Typography>
          <br />
          <Typography variant="body2" component="p">
            Candidate is from <strong>{candidate.city}</strong>
            <br />
            and has {renderCandidateExperience(candidate)} years of experience.
          </Typography>
          <br />
          {candidate.techs_nested.map((technology: any) => {
            return (
              <Chip
                key={technology.name}
                label={technology.name}
                icon={technology.is_main_tech ? <Done /> : undefined}
                className={classes.chipTech}
              />
            );
          })}
        </CardContent>
      </Card>
    );
  };

  const renderResults = (results: any) => {
    // console.log(results);
    return (
      <Grid container spacing={3} className={classes.resultGrid}>
        {results.map((candidate: any) => {
          return (
            <Grid item xs={4} key={candidate.candidate_id}>
              {renderCardCandidate(candidate)}
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <ReactiveBase
              app="candidates"
              url={elasticProxyUrl}
              theme={{
                typography: {
                  fontFamily: "Raleway, Helvetica, sans-serif",
                },
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <MultiDropdownList
                    title="City:"
                    componentId="cityFilter"
                    dataField="city"
                    size={1000}
                    sortBy="asc"
                    showMissing
                    renderNoResults={() => <p>No Cities Found!</p>}
                    queryFormat="or"
                    selectAllLabel="All Cities"
                    showCount
                    showSearch
                    placeholder="Select one or more"
                    showFilter
                    filterLabel="City"
                    react={{
                      and: ["techsFilter", "experienceFilter"],
                    }}
                    URLParams={false}
                    loader="Loading"
                  />
                </Grid>
                <Grid item xs={4}>
                  <MultiDropdownList
                    title="Technologies:"
                    componentId="techsFilter"
                    dataField="techs"
                    size={1000}
                    sortBy="asc"
                    queryFormat="and"
                    renderNoResults={() => <p>No Technologies Found!</p>}
                    selectAllLabel="All Techs"
                    showCount
                    showSearch
                    placeholder="Select one or more"
                    showFilter
                    filterLabel="Techs"
                    react={{
                      and: ["cityFilter", "experienceFilter"],
                    }}
                    URLParams={false}
                    loader="Loading"
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography>
                    <strong>Years of Experience:</strong>
                  </Typography>
                  <RangeSlider
                    className={classes.experienceFilter}
                    componentId="experienceFilter"
                    dataField="years_experience"
                    stepValue={1}
                    showHistogram={false}
                    range={{
                      start: 0,
                      end: 30,
                    }}
                    tooltipTrigger="always"
                    rangeLabels={{
                      start: "0",
                      end: "30",
                    }}
                    react={{
                      and: ["cityFilter", "techsFilter"],
                    }}
                    URLParams={false}
                  />
                </Grid>
              </Grid>
              <br />
              <ReactiveList
                componentId="ReactiveListResult"
                dataField="*"
                size={5}
                stream={false}
                sortOptions={sortOptions}
                defaultSortOption="Experience ▾"
                infiniteScroll={false}
                showLoader={false}
                showResultStats={false}
                react={{
                  and: ["cityFilter", "techsFilter", "experienceFilter"],
                }}
                style={{ margin: 5 }}
                renderNoResults={() => (
                  <Grid container spacing={3} className={classes.resultGrid}>
                    <Grid item xs={3} className={classes.resultGrid}>
                      <Typography variant="h6">No results found</Typography>
                    </Grid>
                  </Grid>
                )}
                render={({ loading, error, data }) => {
                  if (loading) {
                    return (
                      <Grid
                        container
                        spacing={3}
                        className={classes.resultGrid}
                      >
                        <Grid item xs={3} className={classes.resultGrid}>
                          <Typography variant="h6">Searching</Typography>
                        </Grid>
                      </Grid>
                    );
                  }
                  if (error) {
                    return (
                      <Grid
                        container
                        spacing={3}
                        className={classes.resultGrid}
                      >
                        <Grid item xs={3} className={classes.resultGrid}>
                          <Typography variant="h6">
                            Error loading data
                          </Typography>
                        </Grid>
                      </Grid>
                    );
                  }
                  return renderResults(data);
                }}
              />
            </ReactiveBase>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SearchElastic;
