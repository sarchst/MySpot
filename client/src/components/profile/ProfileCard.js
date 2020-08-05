// modified from Siriwatknp at https://mui-treasury.com/components/card/

import React from "react";
import { connect } from "react-redux";
import Spotify from "spotify-web-api-js";
import Emoji from "react-emoji-render";
import { getName } from "country-list";

import FollowButton from "../follow/FollowButton";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Typography,
} from "@material-ui/core";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import MusicOffOutlinedIcon from "@material-ui/icons/MusicOffOutlined";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  card: {
    borderRadius: 16,
    minWidth: 256,
    textAlign: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    margin: "auto",
  },
  heading: {
    fontSize: "large",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    marginTop: 8,
    marginBottom: 0,
  },
  subheader: {
    fontSize: "small",
    color: theme.palette.secondary.main,
    marginBottom: "0.875em",
    fontWeight: "bold",
  },
  statLabel: {
    color: theme.palette.primary.main,
    margin: 0,
  },
  statValue: {
    fontSize: "large",
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
  trackheader: {
    fontSize: "medium",
    fontWeight: "bold",
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
    spotifyWebApi.setAccessToken(this.props.spotifyApi.accessToken);
  }

  setPlayerSong = (songUri) => {
    this.setState({
      songUri: songUri,
    });
  };

  updateCard = () => {
    this.setState({});
  };

  render() {
    const { classes, selectedUser } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent className={classes.profileCardBox}>
          <Avatar
            className={classes.avatar}
            src={selectedUser.profilePic || ""}
          />
          <h3 className={classes.heading}>{selectedUser.username || ""}</h3>
          <span className={classes.subheader}>
            <Emoji text=":globe_showing_americas:" />
            {/* unfortunately it seems like emoji flags aren't supported for windows10 so can only see it on mac */}
            <Emoji
              text={
                ":flag_" +
                getName(selectedUser.country).toLocaleLowerCase() +
                ":"
              }
            />
            <Emoji text=":globe_showing_americas:" />
          </span>
          <FollowButton
            selectedUserId={selectedUser._id}
            selectedUserFollowers={selectedUser.followers}
            selectedUsername={selectedUser.username}
            isFollowing={selectedUser.followers.includes(this.props.user.id)}
            isProfileCall={true}
          />
        </CardContent>
        <Divider light />
        <Box display={"flex"}>
          <Box className={classes.profileCardBox} p={2} flex={"auto"}>
            <Typography className={classes.statLabel}>Followers</Typography>
            <p className={classes.statValue}>
              {selectedUser.followers ? selectedUser.followers.length : 0}
            </p>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box className={classes.profileCardBox} p={2} flex={"auto"}>
            <Typography className={classes.statLabel}>Following</Typography>
            <p className={classes.statValue}>
              {selectedUser.following ? selectedUser.following.length : 0}
            </p>
          </Box>
        </Box>
        <Divider light />
        <Box display={"flex"}>
          <Box className={classes.profileCardBox} p={2} flex={"auto"}>
            <List
              className={classes.listRoot}
              dense={true}
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  color="primary"
                  className={classes.trackheader}
                >
                  <Typography>My Top Tracks</Typography>
                </ListSubheader>
              }
            >
              {selectedUser.topTracks
                ? selectedUser.topTracks.map((track, idx) => {
                    const isPlaybackAvailable = track.preview_url
                      ? true
                      : false;
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
                            <PlayCircleOutlineIcon color={"secondary"} />
                          ) : (
                            <MusicOffOutlinedIcon color={"secondary"} />
                          )}
                        </Box>
                        <ListItemAvatar>
                          <Avatar
                            variant="square"
                            src={
                              track.album.images.length
                                ? track.album.images[
                                    track.album.images.length - 1
                                  ].url
                                : null
                            }
                          ></Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={track.name}
                          secondary={track.album.artists.map(
                            (artist, idx) =>
                              artist.name +
                              (idx < track.album.artists.length - 1
                                ? " | "
                                : "")
                          )}
                        />
                      </ListItem>
                    );
                  })
                : null}
            </List>
          </Box>
          <Box className={classes.profileCardBox} p={2} flex={"auto"}>
            <List
              className={classes.listRoot}
              dense={true}
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                  color="primary"
                  className={classes.trackheader}
                >
                  <Typography>Recently Played Songs</Typography>
                </ListSubheader>
              }
            >
              {selectedUser.recentTracks
                ? selectedUser.recentTracks.map((item, idx) => {
                    const isPlaybackAvailable = item.track.preview_url
                      ? true
                      : false;
                    return (
                      <ListItem
                        key={idx}
                        button={isPlaybackAvailable}
                        onClick={
                          isPlaybackAvailable
                            ? () => this.setPlayerSong(item.track.preview_url)
                            : null
                        }
                      >
                        <Box pr={1} pt={1}>
                          {isPlaybackAvailable ? (
                            <PlayCircleOutlineIcon color={"secondary"} />
                          ) : (
                            <MusicOffOutlinedIcon color={"secondary"} />
                          )}
                        </Box>
                        <ListItemAvatar>
                          <Avatar
                            variant="square"
                            src={
                              item.track.album.images.length
                                ? item.track.album.images[0].url
                                : null
                            }
                          ></Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.track.name}
                          secondary={
                            "Played: " +
                            new Date(item.played_at).toLocaleString()
                          }
                        />
                      </ListItem>
                    );
                  })
                : null}
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
  spotifyApi: state.spotifyApi,
  user: state.user,
  selectedUser: state.selectedUser,
});

export default connect(mapStateToProps)(withStyles(styles)(ProfileCard));
