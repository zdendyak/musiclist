import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getRandomAlbum } from '../../actions/albums';

import HomePage from './HomePage';

export class HomePageContainer extends React.Component {
  componentWillMount() {
    const { getRandomAlbumFunction } = this.props;
    getRandomAlbumFunction();
  }

  render() {
    const { randomAlbum } = this.props;
    return (
      <HomePage
        randomAlbum={randomAlbum}
      />
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  getRandomAlbumFunction: getRandomAlbum,
  dispatch,
}, dispatch);
const mapStateToProps = state => ({ randomAlbum: state.random });

export default connect(mapStateToProps, mapDispatchToProps)(HomePageContainer);
