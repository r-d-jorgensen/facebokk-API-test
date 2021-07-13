import React, { useEffect, useState } from 'react';
import { dateCleaner } from '_helpers';
import { Error } from '_components/Error';

function Photos() {
  const [error, setError] = useState();
  const [photos, setPhotos] = useState();
  //photos data call
  useEffect(() => {
    window.FB.api(
      "/me/photos",
      'GET',
      {"fields":"id,name,created_time,images"},
      function (response) {
        if (response && !response.error) {
          setPhotos(response.data);
        } else {
          setError(response.error);
        }
      }
    );
  });

  if (!photos) return <h3>Loading Your Facebook Photos</h3>;
  if (error) return (<Error error={error} />);
  return (
    <div>
      <a href={photos[0].images[6].source} download>Click to download</a>
      <h3>Photos [Page 1]:</h3>
      {photos.map(photo => <div key={photo.id}>
        <p>Created on: {dateCleaner(photo.created_time)}</p>
        <img
          src={photo.images[6].source}
          alt={photo.name ? photo.name : ""}
          width={photo.images[6].width}
          height={photo.images[6].height} />,
      </div> )}
    </div>
  );
}

export { Photos };