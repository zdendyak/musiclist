import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { addAlbum, albumSearchClear, searchAlbums } from '../../actions/albums';

import AlbumPage from './AlbumPage';

export class AlbumsPageContainer extends React.Component {
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(albumSearchClear());
  }

  render() {
    const { addAlbumFunction, albums, authentication, searchAlbumsFunction, user } = this.props;
    return (
      <AlbumPage
        addAlbumFunction={addAlbumFunction}
        albums={albums}
        authentication={authentication}
        searchAlbumsFunction={searchAlbumsFunction}
        user={user}
      />
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  addAlbumFunction: addAlbum,
  searchAlbumsFunction: searchAlbums,
  dispatch,
}, dispatch);

const mapStateToProps = state => ({
  albums: state.albums,
  authentication: state.authentication,
  user: state.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(AlbumsPageContainer);
