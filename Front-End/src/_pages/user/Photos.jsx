/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import dateCleaner from '../../_helpers/dateCleaner';
import serverEndpoint from '../../_helpers/serverEndpoint';

export default function Photos() {
  const [photos, setPhotos] = useState();
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  useEffect(() => {
    const user = JSON.parse(window.sessionStorage.getItem('user'));

    (async function getPhotos() {
      const photoData = await axios.get(`https://${serverEndpoint}/photos/facebook/${user.user_id}`)
        .then((data) => data)
        .catch((error) => console.log(error)); // TODO: Implement error display for user
      setPhotos(photoData.data);
    }(user));
  }, []);

  // Toggles individual photo selection
  function toggleSelection(id) {
    if (selectedPhotos.includes(id)) {
      setSelectedPhotos(selectedPhotos.filter((item) => item !== id));
    } else {
      setSelectedPhotos(selectedPhotos.concat([id]));
    }
  }

  // Toggles all photos
  function toggleAll() {
    if (selectedPhotos.length === photos.length) {
      setSelectedPhotos([]);
    } else {
      setSelectedPhotos(photos.map((photo) => photo.image_id));
    }
  }

  if (!photos) return <h3>Loading Your Facebook Photos</h3>;
  if (photos.length === 0) return <h3>You do not have any photos avalible</h3>;
  return (
    <div>
      <h3>All Photos Ever</h3>
      <button
        type="button"
        onClick={toggleAll}
      >
        {selectedPhotos.length === photos.length ? 'Deselect All' : 'Select All'}
      </button>
      <div style={{
        display: 'grid', gridTemplateColumns: 'auto auto auto auto', gridColumnGap: '10px', gridRowGap: '10px',
      }}
      >
        {photos.map((photo) => (
          <div
            key={photo.image_id}
            onClick={() => toggleSelection(photo.image_id)}
            style={selectedPhotos.includes(photo.image_id)
              ? { border: '2px solid blue', borderRadius: '5px' }
              : { padding: '2px' }}
          >
            <img
              src={photo.src_link}
              alt={photo.caption ? photo.caption : null}
              width={300}
              height={225}
            />
            <div>
              Created on:
              {dateCleaner(photo.created_at)}
              <br />
              {photo.caption === 'null' ? 'No Caption Given' : photo.caption}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
