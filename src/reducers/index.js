import { combineReducers } from 'redux';
import AlbumsReducer from './albums';
import ArtistsReducer from './artists';
import AuthenticationReducer from './authentication';
import ErrorReducer from './error';
import ListReducer from './list';
import ProgressReducer from './progress';
import RandomReducer from './random';
import UserReducer from './user';

const reducers = {
  albums: AlbumsReducer,
  artists: ArtistsReducer,
  authentication: AuthenticationReducer,
  error: ErrorReducer,
  list: ListReducer,
  progress: ProgressReducer,
  random: RandomReducer,
  user: UserReducer,
};

export default combineReducers(reducers);
