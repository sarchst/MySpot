// modified from Siriwatknp at https://mui-treasury.com/components/card/

import React from "react";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import * as palette from "@material-ui/core/colors";
import Spotify from "spotify-web-api-js";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import MusicOffOutlinedIcon from "@material-ui/icons/MusicOffOutlined";

const styles = (theme) => ({
  card: {
    borderRadius: 12,
    minWidth: 256,
    textAlign: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    margin: "auto",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: "0.5px",
    marginTop: 8,
    marginBottom: 0,
  },
  subheader: {
    fontSize: 14,
    color: palette.grey[500],
    marginBottom: "0.875em",
  },
  statLabel: {
    fontSize: 12,
    color: palette.grey[500],
    fontWeight: 500,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    margin: 0,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    letterSpacing: "1px",
  },
  profileCardBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  listRoot: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  audioPlayer: {
    width: "50%",
  },
});

const spotifyWebApi = new Spotify();

class ProfileCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topTracks: [],
      recentTracks: [],
      songUri: "",
    };
    spotifyWebApi.setAccessToken(this.props.spotifyWebApi);
  }
  componentDidMount = () => {
    // get top tracks for arbitrary user

    spotifyWebApi
      .getMyTopTracks()
      .then((result) => {
        // console.log(result);
        this.setState({
          topTracks: result.items.slice(0, Math.min(result.items.length, 3)),
        });
      })
      .catch((err) => {
        console.log("error getting top tracks");
        console.log(err);
      });
    spotifyWebApi
      .getMyRecentlyPlayedTracks()
      .then((result) => {
        this.setState({
          recentTracks: result.items.slice(0, Math.min(result.items.length, 3)),
        });
      })
      .catch((err) => {
        console.log("error getting recent tracks");
        console.log(err);
      });
  };

  setPlayerSong = (songUri) => {
    this.setState({
      songUri: songUri,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Card
      // className={cx(styles.card, shadowStyles.root)}
      >
        <CardContent className={classes.profileCardBox}>
          <Avatar
            className={classes.avatar}
            src={
              this.props.user.profilePic
                ? this.props.user.profilePic
                : "./generic-user-headphone-icon.png"
            }
            // src={"https://i.pravatar.cc/300"}
          />
          <h3 className={classes.heading}>
            {this.props.spotifyApiUserMe.display_name}
          </h3>
          <span className={classes.subheader}>
            {this.props.spotifyApiUserMe.country}
          </span>
        </CardContent>
        <Divider light />
        <Box display={"flex"}>
          <Box
            className={classes.profileCardBox}
            p={2}
            flex={"auto"}
            // className={borderedGridStyles.item}
          >
            <p className={classes.statLabel}>Followers on Spotify</p>
            <p className={classes.statValue}>
              {this.props.spotifyApiUserMe.followers.total}
            </p>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box
            className={classes.profileCardBox}
            p={2}
            flex={"auto"}
            // className={borderedGridStyles.item}
          >
            <p className={classes.statLabel}>Following</p>
            <p className={classes.statValue}>12</p>
          </Box>
        </Box>
        <Divider light />
        <Box display={"flex"}>
          <Box
            className={classes.profileCardBox}
            p={2}
            flex={"auto"}
            // className={borderedGridStyles.item}
          >
            <List
              className={classes.listRoot}
              dense={true}
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  My Top Tracks
                </ListSubheader>
              }
            >
              {this.state.topTracks.map((track, idx) => {
                const isPlaybackAvailable = track.preview_url ? true : false;
                return (
                  <ListItem
                    key={idx}
                    button={isPlaybackAvailable}
                    onClick={
                      isPlaybackAvailable
                        ? () => this.setPlayerSong(track.preview_url)
                        : null
                    }
                  >
                    <Box pr={1} pt={1}>
                      {isPlaybackAvailable ? (
                        <PlayCircleOutlineIcon />
                      ) : (
                        <MusicOffOutlinedIcon color={"#757ce8"} />
                      )}
                    </Box>
                    <ListItemAvatar>
                      <Avatar
                        variant="square"
                        src={
                          track.album.images.length
                            ? track.album.images[0].url
                            : null
                        }
                      ></Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={track.name}
                      secondary={track.album.artists.map(
                        (artist, idx) =>
                          artist.name +
                          (idx < track.album.artists.length - 1 ? " | " : "")
                      )}
                    />
                    {/*<ListItemSecondaryAction>*/}
                    {/*  <IconButton edge="start" aria-label="delete">*/}

                    {/*  </IconButton>*/}
                    {/*</ListItemSecondaryAction>*/}
                  </ListItem>
                );
              })}
            </List>
          </Box>
          <Box
            className={classes.profileCardBox}
            p={2}
            flex={"auto"}
            // className={borderedGridStyles.item}
          >
            <List
              className={classes.listRoot}
              dense={true}
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Recently Played Songs
                </ListSubheader>
              }
            >
              {this.state.recentTracks.map((item, idx) => (
                <ListItem
                  key={idx}
                  alignItems={"center"}
                  button={true}
                  onClick={() => this.setPlayerSong(item.track.preview_url)}
                >
                  <Box pr={1} pt={1}>
                    <PlayCircleOutlineIcon />
                  </Box>
                  <ListItemAvatar>
                    <Avatar src={item.track.album.images[0].url}></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.track.name}
                    secondary={
                      "Played: " + new Date(item.played_at).toLocaleString()
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
        {this.state.songUri ? (
          <Box className={classes.profileCardBox} pb={1}>
            <audio
              className={classes.audioPlayer}
              autoPlay
              controls="controls"
              src={this.state.songUri}
            ></audio>
          </Box>
        ) : null}
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  spotifyWebApi: state.spotifyWebApi,
  spotifyApiUserMe: state.spotifyApiUserMe,
  posts: state.posts,
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(ProfileCard));
