import axios from "axios";
import { fetchFeed } from "./feedActions";

export const FETCH_POSTS_SUCCESS = "FETCH_POSTS_SUCCESS";
export const FETCH_POSTS_ERROR = "FETCH_POSTS_ERROR";
export const FETCH_POSTS_STARTED = "FETCH_POSTS_STARTED";
export const ADD_POSTS_TO_POSTS = "ADD_POSTS_TO_POSTS";
export const MAKE_POST_SUCCESS = "MAKE_POST_SUCCESS";

export const makePostSuccess = (posts) => ({
  type: MAKE_POST_SUCCESS,
  payload: posts,
});

export function fetchPostsStarted() {
  return {
    type: FETCH_POSTS_STARTED,
  };
}

export function fetchPostsSuccess() {
  return {
    type: FETCH_POSTS_SUCCESS,
  };
}

export function fetchPostsError(error) {
  return {
    type: FETCH_POSTS_ERROR,
    error: error,
  };
}

export function addPostsToPosts(data) {
  return {
    type: ADD_POSTS_TO_POSTS,
    payload: data,
  };
}

export const makePost = (post) => {
  console.log("Post from actions: ", post);
  const id = post.authorId;
  return (dispatch) => {
    return axios
      .put(`/user/posts/${id}`, post)

      .then(() => {
        dispatch(fetchPosts(id));
      })
      .then(() => {
        dispatch(fetchFeed(id));
      })
      .catch((error) => {
        throw error;
      });
  };
};


export const deletePost = (id, postId) => {
  console.log("Delete post in actions user ID", id)
  console.log("Delete post in postBody", postId)
  return (dispatch) => {
    return axios
      .put(`http://localhost:9000/user/posts/delete/${id}`, postId)
      .then(() => {
        dispatch(fetchPosts(id));
      })
      .then(() => {
        dispatch(fetchFeed(id));
      })
      .catch((error) => {
        throw error;
      });
  }
}
export function fetchPosts(id) {
  return (dispatch) => {
    dispatch(fetchPostsStarted());
    fetch(`/user/posts/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          throw res.error;
        }
        // console.log("fetchPosts method:");
        dispatch(fetchPostsSuccess());
        return res.data;
      })
      .then((res) => {
        // console.log("POSTS to be loaded:");
        // console.log(res);

        // add profilePic key to every post yin posts
        for (let i = 0; i < res.posts.length; i++) {
          res.posts[i].profilePic = res.profilePic;
        }

        const sortedPosts = res.posts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        dispatch(addPostsToPosts(sortedPosts));
        return res;
      })
      .catch((error) => {
        console.log("Fetch Posts Error");
        dispatch(fetchPostsError(error));
      });
  };
}
