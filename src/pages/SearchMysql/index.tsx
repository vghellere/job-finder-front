import React, { useEffect } from "react";
import {
  Grid,
  Paper,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Slider,
  Typography,
  Card,
  CardContent,
  Chip,
} from "@material-ui/core";
import { Done, Autorenew } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { api } from "../../utils/api";

const useStyles = makeStyles({
  paper: {
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: "100px",
  },
  paperResults: {
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    align: "center",
    minHeight: "100px",
  },
  select: {
    width: "150px",
  },
  chipTech: {
    margin: "3px",
  },
  resultGrid: {
    justifyContent: "center",
  },
  fullHeightCard: {
    height: "100%",
  },
  secondaryResultGrid: {
    marginTop: "15px",
  },
  loadingIcon: {
    animation: "$spin 3s linear infinite",
    fontSize: 48,
  },
  "@keyframes spin": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
  },
});

const SearchMysql = () => {
  const [seletedCity, setSeletedCity] = React.useState("");
  const [tech, setTech] = React.useState("");
  const [searchResult, setSearchResult] = React.useState<any | undefined>({});
  const [experience, setExperience] = React.useState<number[]>([0, 40]);
  const [searchOptions, setSearchOptions] = React.useState<any | undefined>({});
  const [isLoadingSearchOptions, setIsLoadingSearchOptions] = React.useState(
    false
  );
  const [isLoadingSearch, setIsLoadingSearch] = React.useState(false);
  const classes = useStyles();

  const makeSearch = () => {
    const fetchSearchData = async () => {
      try {
        setIsLoadingSearch(true);
        const params = {
          city_id: seletedCity ? parseInt(seletedCity, 10) : null,
          techs: tech || null,
          experience_min: experience[0],
          experience_max: experience[1],
        };
        const searchRequest = await api.get("/candidates", { params });

        setSearchResult(searchRequest.data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("Error fetch search data.");
      }
      setIsLoadingSearch(false);
    };
    fetchSearchData();
  };

  const getSearchOptions = () => {
    const fetchSearchOptions = async () => {
      try {
        setIsLoadingSearchOptions(true);
        const searchRequest = await api.get("/candidates/search-options");
        setSearchOptions(searchRequest.data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("Error fetch search options data.");
      }
      setIsLoadingSearchOptions(false);
    };
    fetchSearchOptions();
  };

  useEffect(() => {
    getSearchOptions();
  }, []);

  useEffect(() => {
    makeSearch();
  }, [seletedCity, tech, experience]);

  const handleChangeCity = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSeletedCity(event.target.value as string);
  };

  const handleChangeTech = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTech(event.target.value as string);
  };

  const handleChangeExperience = (event: any, newValue: number | number[]) => {
    setExperience(newValue as number[]);
  };

  const renderCardCandidate = (candidate: any) => {
    return (
      <Card variant="outlined" className={classes.fullHeightCard}>
        <CardContent>
          <Typography variant="h5" component="h2">
            Candidate ID: {candidate.id}
          </Typography>
          <br />
          <Typography variant="body2" component="p">
            Candidate is from <strong>{candidate.city.name}</strong>
            <br />
            and has<span> </span>
            {candidate.experience_max === 99 ? (
              <span>
                <strong>{candidate.experience_min}+</strong> years
              </span>
            ) : (
              <span>
                <strong>{candidate.experience_min}</strong> to<span> </span>
                <strong>{candidate.experience_max}</strong> years
              </span>
            )}
            <span> </span>of experience.
          </Typography>
          <br />
          {candidate.technologies.map((technology: any) => {
            return (
              <Chip
                key={technology.id}
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

  const renderLoading = () => {
    return <Autorenew className={classes.loadingIcon} />;
  };

  const renderResults = () => {
    return (
      <div>
        <Grid item xs={12}>
          <Paper className={classes.paperResults}>
            <Typography variant="h6">Main results</Typography>
            <Grid container spacing={3} className={classes.resultGrid}>
              {(() => {
                if (isLoadingSearch) {
                  return renderLoading();
                }
                if (
                  "main_candidates" in searchResult &&
                  searchResult.main_candidates.length > 0
                ) {
                  return searchResult.main_candidates.map((candidate: any) => {
                    return (
                      <Grid item xs={4} key={candidate.id}>
                        {renderCardCandidate(candidate)}
                      </Grid>
                    );
                  });
                }
                return <Typography gutterBottom>No results found!</Typography>;
              })()}
            </Grid>
          </Paper>
        </Grid>
        {"secondary_candidates" in searchResult &&
          searchResult.secondary_candidates.length > 0 && (
            <Grid item xs={12} className={classes.secondaryResultGrid}>
              <Paper className={classes.paperResults}>
                <Typography variant="h6">Secondary results</Typography>
                <Grid container spacing={3} className={classes.resultGrid}>
                  {(() => {
                    if (isLoadingSearch) {
                      return renderLoading();
                    }
                    if (
                      "secondary_candidates" in searchResult &&
                      searchResult.secondary_candidates.length > 0
                    ) {
                      return searchResult.secondary_candidates.map(
                        (candidate: any) => {
                          return (
                            <Grid item xs={4} key={candidate.id}>
                              {renderCardCandidate(candidate)}
                            </Grid>
                          );
                        }
                      );
                    }
                    return <div />;
                  })()}
                </Grid>
              </Paper>
            </Grid>
          )}
      </div>
    );
  };

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Paper className={classes.paper}>
                {isLoadingSearchOptions ? (
                  renderLoading()
                ) : (
                  <FormControl>
                    <InputLabel id="city-select-label">City</InputLabel>
                    <Select
                      labelId="city-select-label"
                      id="city-select"
                      value={seletedCity}
                      onChange={handleChangeCity}
                      className={classes.select}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {"cities" in searchOptions &&
                        searchOptions.cities.map((city: any) => {
                          return (
                            <MenuItem value={city.id} key={city.id}>
                              {city.name}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                )}
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className={classes.paper}>
                {isLoadingSearchOptions ? (
                  renderLoading()
                ) : (
                  <FormControl>
                    <InputLabel id="tech-select-label">Technology</InputLabel>
                    <Select
                      labelId="tech-select-label"
                      id="tech-select"
                      value={tech}
                      onChange={handleChangeTech}
                      className={classes.select}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {"technologies" in searchOptions &&
                        searchOptions.technologies.map((technology: any) => {
                          return (
                            <MenuItem value={technology.id} key={technology.id}>
                              {technology.name}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                )}
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className={classes.paper}>
                {isLoadingSearchOptions ? (
                  renderLoading()
                ) : (
                  <div>
                    <Typography id="range-slider" gutterBottom>
                      Mininum Years of Experience
                    </Typography>
                    <br />
                    <br />
                    <Slider
                      max={30}
                      min={0}
                      value={experience}
                      onChange={handleChangeExperience}
                      valueLabelDisplay="on"
                      aria-labelledby="range-slider"
                    />
                  </div>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        {renderResults()}
      </Grid>
    </Grid>
  );
};

export default SearchMysql;
