import React from "react";
import { connect } from "react-redux";
import Spotify from "spotify-web-api-js";
import FollowTable from "../FollowTable";

import MaterialTable from "material-table";
import { Paper, Tab, Tabs } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    padding: 10,
    borderRadius: 16,
    // margin: 5,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
});

const spotifyWebApi = new Spotify();

class ProfileTable extends React.Component {
  state = {
    tabIndex: false,
    playlists: [],
    followers: [],
    following: [],
  };
  componentDidMount = () => {
    spotifyWebApi
      .getUserPlaylists(this.props.user.id)
      .then((result) => {
        const playlists = this.transformPlaylistData(result);
        this.setState({
          playlists: playlists,
        });
      })
      .catch((err) => {
        console.log("Error getting top tracks: ", err);
      });
  };

  transformPlaylistData = (data) => {
    const playlists = data.items.map((pl) => {
      const playlist = {
        title: pl.name,
        playlistArt: pl.images[0].url,
        owner: pl.owner.display_name,
        numTracks: pl.tracks.total,
      };
      return playlist;
    });
    return playlists;
  };

  handleChange = (event, index) => {
    if (index === this.state.tabIndex) {
      this.setState({ tabIndex: false });
    } else {
      this.setState({ tabIndex: index });
    }
  };

  getPanel = (index) => {
    if (this.state.tabIndex === false) return null;
    if (index === 0) {
      return (
        <MaterialTable
          components={{
            Container: (props) => (
              <Paper {...props} elevation={0} style={{ boxShadow: 0 }} />
            ),
          }}
          columns={[
            {
              title: "Playlist",
              field: "playlistArt",
              render: (rowData) => (
                <img
                  src={rowData.playlistArt}
                  alt={"Playlist Art"}
                  style={{ width: 40, height: 40, borderRadius: 16 }}
                />
              ),
              headerStyle: { width: "50px" },
              cellStyle: { width: "50px" },
              width: null,
            },
            { title: "", field: "title" },
            { title: "# of Tracks", field: "numTracks" },
            { title: "Owner", field: "owner" },
          ]}
          data={this.state.playlists}
          options={{
            showTitle: false,
            search: false,
            paging: false,
            toolbar: false,
            sorting: false,
            // headerStyle: { color: "#03DAC6" },
          }}
        />
      );
    } else {
      return (
        <FollowTable
          key={this.state.tabIndex}
          type={this.state.tabIndex === 1 ? "followers" : "following"}
        />
      );
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Tabs
          value={this.state.tabIndex}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Playlists" />
          <Tab label="Followers" />
          <Tab label="Following" />
        </Tabs>
        {this.getPanel(this.state.tabIndex)}
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  spotifyWebApi: state.spotifyWebApi,
  spotifyApiUserMe: state.spotifyApiUserMe,
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(styles)(ProfileTable));
