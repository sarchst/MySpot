import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spotify from "spotify-web-api-js";

import {
  Avatar,
  Container,
  CssBaseline,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Snackbar,
  Tooltip,
  Typography,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { withStyles } from "@material-ui/core/styles";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const styles = (theme) => ({
  listItemText: {
    fontSize: "1.5em",
  },
  avatar: {
    width: 200,
    height: 100,
    margin: "auto",
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    padding: theme.spacing(0, 0, 0),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(0),
  },
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
});

const spotifyWebApi = new Spotify();

class SongList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      name: this.props.location ? this.props.location.state.playlistName : "",
      description: this.props.location
        ? this.props.location.state.playlistDescription
        : "",
      songlistType: "",
      albumImage: "",
      successSnackOpen: false,
      errorSnackOpen: false,
    };
    spotifyWebApi.setAccessToken(this.props.spotifyApi.accessToken);
  }

  componentDidMount() {
    if ("playlistid" in this.props.match.params) {
      spotifyWebApi.getPlaylistTracks(this.props.match.params.playlistid).then(
        (data) => {
          this.setState({
            songlistType: "playlist",
          });
          const tracks = this.organizeTrackData(data.items);
          this.setState({
            tracks: tracks,
          });
        },
        function (err) {
          console.error(err);
        }
      );
      if (!this.state.name) {
        spotifyWebApi.getPlaylist(this.props.match.params.playlistid).then(
          (data) => {
            this.setState({
              name: data.name,
              description: data.description,
            });
          },
          function (err) {
            console.error(err);
          }
        );
      }
    } else if ("albumid" in this.props.match.params) {
      spotifyWebApi.getAlbumTracks(this.props.match.params.albumid).then(
        (data) => {
          this.setState({
            songlistType: "album",
          });
          const tracks = this.organizeTrackData(data.items);
          this.setState({
            tracks: tracks,
          });
        },
        function (err) {
          console.error(err);
        }
      );
      spotifyWebApi.getAlbum(this.props.match.params.albumid).then(
        (data) => {
          this.setState({
            name: data.name,
            description: data.artists.map(
              (artist, index) =>
                artist.name + (index < data.artists.length - 1 ? " | " : "")
            ),
            albumImage: data.images.length
              ? data.images[data.images.length - 1].url
              : null,
          });
        },
        function (err) {
          console.error(err);
        }
      );
    }
  }

  organizeTrackData = (data) => {
    const tracks = [];
    if (this.state.songlistType === "playlist") {
      data.map((track, index) =>
        tracks.push({
          id: track.track.id,
          image: track.track.album.images.length
            ? track.track.album.images[track.track.album.images.length - 1].url
            : null,
          name: track.track.name,
          artists: track.track.artists.map(
            (artist, index) =>
              artist.name +
              (index < track.track.artists.length - 1 ? " | " : "")
          ),
        })
      );
    } else if (this.state.songlistType === "album") {
      data.map((track, index) =>
        tracks.push({
          id: track.id,
          name: track.name,
          artists: track.artists.map(
            (artist, index) =>
              artist.name + (index < track.artists.length - 1 ? " | " : "")
          ),
        })
      );
    }
    return tracks;
  };

  addSongToMySpotPlayList = (id) => {
    spotifyWebApi
      .removeTracksFromPlaylist(this.props.mySpotPlaylists.MySpotPlaylistID, [
        "spotify:track:" + id,
      ])
      .then(() => {
        return spotifyWebApi.addTracksToPlaylist(
          this.props.mySpotPlaylists.MySpotPlaylistID,
          ["spotify:track:" + id]
        );
      })
      .then((res) => {
        this.setState({
          successSnackOpen: true,
        });
      })
      .catch((err) => {
        this.setState({
          errorSnackOpen: true,
        });
        console.log("error adding song to MySpot playlist: ", err);
      });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({
      successSnackOpen: false,
      errorSnackOpen: false,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.state.songlistType === "playlist" ? (
          <Link to={"/" + this.props.match.params.user + "/playlists"}>
            Go Back
          </Link>
        ) : (
          <Link to={"/" + this.props.match.params.user + "/albums"}>
            Go Back
          </Link>
        )}
        <CssBaseline>
          <div className={classes.heroContent}>
            <Container maxWidth="md">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                {this.state.name}
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="textSecondary"
                paragraph
              >
                {this.state.description}
              </Typography>
            </Container>
          </div>
        </CssBaseline>
        <Container maxWidth="lg">
          <List className={classes.listRoot} dense={true}>
            {this.state.tracks.map((track, index) => {
              return (
                <ListItem key={index}>
                  <Tooltip title="Add to MySpot playlist">
                    <IconButton
                      aria-label="delete"
                      onClick={() => this.addSongToMySpotPlayList(track.id)}
                    >
                      <FavoriteIcon className="favorite" />
                    </IconButton>
                  </Tooltip>
                  <ListItemAvatar>
                    <Avatar
                      variant="square"
                      src={
                        this.state.songlistType === "playlist"
                          ? track.image
                          : this.state.albumImage
                      }
                    ></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary={track.name}
                    secondary={track.artists}
                  />
                </ListItem>
              );
            })}
          </List>
        </Container>
        <div className={classes.root}>
          <Snackbar
            open={this.state.successSnackOpen}
            autoHideDuration={6000}
            onClose={() => this.handleClose()}
          >
            <Alert onClose={() => this.handleClose()} severity="success">
              Song added to MySpot playlist!
            </Alert>
          </Snackbar>
          <Snackbar
            open={this.state.errorSnackOpen}
            autoHideDuration={6000}
            onClose={() => this.handleClose()}
          >
            <Alert onClose={() => this.handleClose()} severity="error">
              Error adding song to MySpot playlist.
            </Alert>
          </Snackbar>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    mySpotPlaylists: state.mySpotPlaylists,
    spotifyApi: state.spotifyApi,
  };
};

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(SongList)
);
