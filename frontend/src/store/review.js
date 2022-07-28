import { csrfFetch } from './csrf';

export const LOAD_REVIEWS = "reviews/LOAD_REVIEWS";
export const LOAD_USERREVIEWS = "reviews/LOAD_USERREVIEWS"
export const LOAD_SPOTREVIEWS = "reviews/LOAD_SPOTREVIEWS"
export const UPDATE_REVIEW = "reviews/UPDATE_REVIEW";
export const REMOVE_REVIEW = "reviews/REMOVE_REVIEW";
export const ADD_REVIEW = "reviews/ADD_REVIEW";

const loadreviews = (reviews) => ({
    type: LOAD_REVIEWS,
    reviews
});

const loadownerreviews = (reviews) => ({
    type: LOAD_USERREVIEWS,
    reviews
  });

const loadspotreviews = (reviews) => ({
    type: LOAD_SPOTREVIEWS,
    reviews
  });

  const addreview = review => ({
    type: ADD_REVIEW,
    review
});

const updatereview = (review) => ({
    type: UPDATE_REVIEW,
    review
  });

  const removereview = (reviewId) => ({
    type: REMOVE_REVIEW,
    reviewId
});

export const getReviews = () => async (dispatch) => {
    const response = await csrfFetch("/api/reviews");
    // console.log('res', response)
    if(response.ok){
    const reviews = await response.json()
    // console.log(reviews)
    dispatch(loadreviews(reviews))}
  }



  const initialState = {};

  const reviewReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_REVIEWS:
        newState={};
      action.reviews.forEach(review => {
      newState[review.id] = review;
    })
    return newState;

        default:
      return state;
  }
};

export default reviewReducer;
