import React, { useEffect, useState } from 'react';
import { dateCleaner } from '_helpers';
import { Error } from '_components/Error';

function Photos() {
  const [error, setError] = useState();
  const [photos, setPhotos] = useState();
  const [selectedPhotos, setSelectedPhotos] = useState([]);
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
  }, []);

  function toggleSelection(id) {
    if (selectedPhotos.includes(id)) {
      setSelectedPhotos(selectedPhotos.filter(item => item !== id));
    } else {
      setSelectedPhotos(selectedPhotos.concat([id]));
    }
  }

  function toggleAll() {
    if (selectedPhotos.length === photos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(photos.map(photo => photo.id))
    }
  } 

  if (!photos) return <h3>Loading Your Facebook Photos</h3>;
  if (error) return <Error error={error} />;
  if (photos.length === 0) return <h3>You don't have any photos avalible</h3>;
  return (
    <div>
      <h3>All Photos Ever</h3>
      <button onClick={toggleAll}>{selectedPhotos.length === photos.length ? "Deselect All" : "Select All"}</button>
      <div style={{display: "grid", gridTemplateColumns: "auto auto auto auto", gridColumnGap: "10px", gridRowGap: "10px"}}>
        {photos.map(photo =>
        <div
          key={photo.id}
          onClick={() => toggleSelection(photo.id)} 
          style={selectedPhotos.includes(photo.id) ? {border: "2px solid blue", borderRadius: "5px"} : {padding: "2px"}}>
          <img
            src={photo.images[6].source}
            alt={photo.name ? photo.name : ""}
            width={300}
            height={225} />
            <div>
              Created on: {dateCleaner(photo.created_time)}
              <br />
              {photo.name ? photo.name : "No Caption Given"}
            </div>
      </div>)}
      </div>
    </div>
  );
}

export { Photos };