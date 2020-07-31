import { combineReducers } from "redux";

import toggleSidebar from "./toggleSidebar";
import user from "./user";
import feed from "./feed";
import settings from "./settings";
import profileFeed from "./profileFeed";
import spotifyApi from "./spotifyApi";
import fetchFeed from "./fetchFeed";
import fetchPosts from "./fetchPosts";
import updateSettings from "./updateSettings";
import delPostDialog from "./delPostDialog";
import editPostDialog from "./editPostDialog";

const allReducers = combineReducers({
  isSidebarOpen: toggleSidebar,
  spotifyApi: spotifyApi,
  user: user,
  feed: feed,
  profileFeed: profileFeed,
  fetchFeed: fetchFeed,
  fetchPosts: fetchPosts,
  delPostDialog: delPostDialog,
  editPostDialog: editPostDialog,
  accountSettings: settings,
  updateSettings: updateSettings,
});

export default allReducers;
