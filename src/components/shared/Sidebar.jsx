import React from 'react';
import { Card, CardBlock, CardText, CardTitle } from 'reactstrap';

const formatAlbum = (album) => {
  if (!album) {
    return null;
  }

  return (
    <span className="text-center">
      <img src={album.thumb} alt="album thumb" /><br />
      { album.title }
    </span>
  );
};

export default function Sidebar(props) {
  const { randomAlbum } = props;
  return (
    <aside className="col-sm-12 col-md-4">
      <Card>
        <CardBlock>
          <CardTitle className="text-center">Random Album</CardTitle>
          <CardText className="text-center">
            { randomAlbum && randomAlbum.title ? formatAlbum(randomAlbum) : null }
          </CardText>
        </CardBlock>
      </Card>
    </aside>
  );
}
