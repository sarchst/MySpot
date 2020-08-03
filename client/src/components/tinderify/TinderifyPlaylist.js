import React from "react";
import { connect } from "react-redux";
import Spotify from "spotify-web-api-js";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";

const styles = (theme) => ({
  link: {
    color: theme.palette.secondary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

const spotifyWebApi = new Spotify();

class TinderifyPlaylist extends React.Component {
  state = {
    followList: [],
    tracks: [],
  };
  componentDidMount = () => {
    spotifyWebApi
      .getPlaylistTracks(this.props.mySpotPlaylists.TinderifyPlaylistID)
      .then(
        (data) => {
          console.log("Songs in playlist", data);
          this.setState({
            tracks: data.items,
          });
        },
        function (err) {
          console.error(err);
        }
      );
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <h1>{this.state.name}</h1>
        <h4>{this.state.description}</h4>
        <Container maxWidth="lg">
          <List className={classes.listRoot} dense={true}>
            {this.state.tracks.map((track, index) => {
              return (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar
                      variant="square"
                      src={
                        track.track.album.images.length
                          ? track.track.album.images[
                              track.track.album.images.length - 1
                            ].url
                          : null
                      }
                    ></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    classes={{ primary: classes.listItemText }}
                    primary={track.track.name}
                    secondary={track.track.album.artists.map(
                      (artist, index) =>
                        artist.name +
                        (index < track.track.album.artists.length - 1
                          ? " | "
                          : "")
                    )}
                  />
                </ListItem>
              );
            })}
          </List>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  mySpotPlaylists: state.mySpotPlaylists,
  spotifyApi: state.spotifyApi,
});

export default connect(mapStateToProps)(withStyles(styles)(TinderifyPlaylist));