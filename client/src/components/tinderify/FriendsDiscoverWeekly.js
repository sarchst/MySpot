import React from "react";
import { connect } from "react-redux";
import MaterialTable from "material-table";

import MusicBrowser from "./MusicBrowser";

import { Box, Button, Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  link: {
    color: theme.palette.secondary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
    button: {
      textTransform: "none",
    },
    submit: {
      float: "right",
    },
  },
});

class FriendsDiscoverWeekly extends React.Component {
  state = {
    followList: [],
    selectedUser: "",
  };
  componentDidMount = () => {
    const type = "following";
    fetch(`http://localhost:9000/user/${type}/${this.props.user.id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          throw res.error;
        }
        const following = this.transformFollowData(res.data[0][type]);
        this.setState({ followList: following });
      })
      .catch((error) => {
        console.log("Fetch Follow Error: ", error);
      });
  };

  transformFollowData = (data) => {
    const follData = data.map((f) => {
      const foll = {
        pic: f.profilePic,
        username: f.username,
        numFollowers: f.followers.length,
        userId: f._id,
      };
      return foll;
    });
    return follData;
  };

  goToFriendsTinderify = (id) => {
    this.setState({
      selectedUser: id,
    });
  };

  goBackToFriendsList = () => {
    this.setState({
      selectedUser: "",
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.state.selectedUser === "" ? (
          <MaterialTable
            components={{
              Container: (props) => (
                <Paper
                  {...props}
                  elevation={0}
                  style={{ boxShadow: 0, borderRadius: 16, padding: 10 }}
                />
              ),
            }}
            columns={[
              {
                field: "pic",
                render: (rowData) => (
                  <img
                    src={rowData.pic}
                    alt={"ProfilePic"}
                    style={{ width: 40, height: 40, borderRadius: 16 }}
                  />
                ),
                headerStyle: { width: "50px" },
                cellStyle: { width: "50px" },
                width: null,
              },

              {
                field: "",
                render: (rowData) => (
                  <Button
                    onClick={() => this.goToFriendsTinderify(rowData.userId)}
                  >
                    Browse {rowData.username}'s Music
                  </Button>
                ),
              },
            ]}
            data={this.state.followList}
            options={{
              showTitle: false,
              search: false,
              paging: false,
              toolbar: false,
              sorting: false,
              rowStyle: { borderBottom: 0 },
            }}
          />
        ) : (
          <div>
            <Box ml={5}>
              <Button
                className={classes.submit}
                variant="outlined"
                color="secondary"
                onClick={() => this.goBackToFriendsList()}
              >
                Go Back
              </Button>
            </Box>

            <MusicBrowser otherUser={this.state.selectedUser}></MusicBrowser>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(
  withStyles(styles)(FriendsDiscoverWeekly)
);
