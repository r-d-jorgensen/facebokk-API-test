import React, { useEffect, useState } from 'react';
import { Error } from '_components/Error';

function PhotosSummary() {
  const [error, setError] = useState();
  const [photos, setPhotos] = useState([]);
  //photos data call 
  useEffect(() => {
    window.FB.api(
      "/me/photos",
      'GET',
      {"fields":"id,created_time"},
      function (response) {
        if (response && !response.error) {
          if (response.paging.next === undefined) {
            setPhotos(response.data);
          } else {
            getAllPhotos(response.paging.next, response.data);
          }
        } else {
          setError(response.error);
        }
      }
    );

    //call and set all the photos
    function getAllPhotos(next, data) {
      window.FB.api(
        next,
        'GET',
        {},
        function (response) {
          if (response && !response.error) {
            if (response.paging.next === undefined) {
              setPhotos(data.concat(response.data));
            } else {
              getAllPhotos(response.paging.next, data.concat(response.data));
            }
          } else {
            setError(response.error);
          }
        }
      );
    }

  }, []);

  function numberOfPhotosByDate(days) {
    if (photos.length === 0) return 'Loading Photos';
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const today = new Date();
    for (let i = 0; i < photos.length; i++) {
      if (dateDiffInDays(new Date(photos[i].created_time), today) >= days)
        return i;
    }
    return photos.length;
    

    // a and b are javascript Date objects
    function dateDiffInDays(a, b) {
      // Discard the time and time-zone information.
      const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

      return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }
  }

  if (error) return <Error error={error} />;
  return (
    <div>
      <h1>Photos Held Facebook</h1>
      <h3>Past week Photos: {numberOfPhotosByDate(7)}</h3>
      <h3>Past month Photos: {numberOfPhotosByDate(30)}</h3>
      <h3>Past year Photos: {numberOfPhotosByDate(365)}</h3>
      <h3>All Stored Photos: {photos.length}</h3>
    </div>
  );
}

export { PhotosSummary };