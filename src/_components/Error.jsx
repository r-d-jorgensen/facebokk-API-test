import React from 'react';

function Error({error}) {
  return (
    <div>
      <h1>Error Has Happened in retrieving your data</h1>
      <h3>{error}</h3>
    </div>
  );
}

export { Error }; 