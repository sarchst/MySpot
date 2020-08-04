// import axios from "axios";
// import { fetchPostsWithFilter } from "./postActions";
import { applyFilter } from "./filterActions";

// export const TOGGLE_LIKE = "TOGGLE_LIKE";
export const FETCH_FEED_SUCCESS = "FETCH_FEED_SUCCESS";
export const FETCH_FEED_ERROR = "FETCH_FEED_ERROR";
export const FETCH_FEED_STARTED = "FETCH_FEED_STARTED";
export const ADD_POSTS_TO_FEED = "ADD_POSTS_TO_FEED";
export const COMBINE_P_POSTS_WITH_FEED = "COMBINE_P_POSTS_WITH_FEED";
export const FILTER_NEW_TO_OLD = "FILTER_NEW_TO_OLD";
export const FILTER_OLD_TO_NEW = "FILTER_OLD_TO_NEW";
export const FILTER_MOST_LIKED = "FILTER_MOST_LIKED";
export const FILTER_MOST_COMMENTED = "FILTER_MOST_COMMENTED";

// export const toggleLike = (payload) => ({
//   type: TOGGLE_LIKE,
//   payload,
// });

export function fetchFeedStarted() {
  return {
    type: FETCH_FEED_STARTED,
  };
}

export function fetchFeedSuccess() {
  return {
    type: FETCH_FEED_SUCCESS,
  };
}

export function fetchFeedError(error) {
  return {
    type: FETCH_FEED_ERROR,
    error: error,
  };
}

export function addPostsToFeed(data) {
  return {
    type: ADD_POSTS_TO_FEED,
    payload: data,
  };
}

// export const toggleLike = (post, id, profileFeedFilter, feedFilter) => {
//   let postInfo = { postId: post._id, userId: id };
//   let toggle = "like";
//   if (post.usersLiked.includes(id)) {
//     toggle = "unlike";
//   }
//   return (dispatch) => {
//     return axios
//       .put(
//         `http://localhost:9000/user/posts/${toggle}/${post.authorId}`,
//         postInfo
//       )
//       .then(() => {
//         dispatch(fetchPostsWithFilter(id, profileFeedFilter));
//       })
//       .then(() => {
//         dispatch(fetchFeedWithFilter(id, feedFilter));
//       })
//       .catch((error) => {
//         throw error;
//       });
//   };
// };

// export function fetchFeed(id) {
//   return (dispatch) => {
//     dispatch(fetchFeedStarted());
//     fetch(`http://localhost:9000/user/feed/${id}`)
//       .then((res) => res.json())
//       .then((res) => {
//         if (res.error) {
//           throw res.error;
//         }
//         dispatch(fetchFeedSuccess());
//         return res.data;
//       })
//       .then((res) => {
//         let followerSet = {};
//         let numFollowing = res[0].following.length;
//         followerSet[res[0]._id] = res[0].profilePic;
//         for (let i = 0; i < numFollowing; i++) {
//           followerSet[res[0].following[i]._id] = res[0].following[i].profilePic;
//         }

//         let feed = res[0].posts;
//         for (let i = 0; i < numFollowing; i++) {
//           feed = feed.concat(res[0].following[i].posts);
//         }

//         for (let i = 0; i < feed.length; i++) {
//           feed[i].profilePic = followerSet[feed[i].authorId];
//         }

//         // apply filtering here..
//         const sortedFeed = feed.sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         dispatch(addPostsToFeed(sortedFeed));
//         return res;
//       })
//       .catch((error) => {
//         dispatch(fetchFeedError(error));
//       });
//   };
// }

export function fetchFeedWithFilter(id, filter) {
  return (dispatch) => {
    dispatch(fetchFeedStarted());
    fetch(`http://localhost:9000/user/feed/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          throw res.error;
        }
        dispatch(fetchFeedSuccess());
        return res.data;
      })
      .then((res) => {
        let followerSet = {};
        let numFollowing = res[0].following.length;
        followerSet[res[0]._id] = res[0].profilePic;
        for (let i = 0; i < numFollowing; i++) {
          followerSet[res[0].following[i]._id] = res[0].following[i].profilePic;
        }

        let feed = res[0].posts;
        for (let i = 0; i < numFollowing; i++) {
          feed = feed.concat(res[0].following[i].posts);
        }

        for (let i = 0; i < feed.length; i++) {
          feed[i].profilePic = followerSet[feed[i].authorId];
        }

        let sortedFeed = applyFilter(feed, filter);

        dispatch(addPostsToFeed(sortedFeed));
        return res;
      })
      .catch((error) => {
        dispatch(fetchFeedError(error));
      });
  };
}
