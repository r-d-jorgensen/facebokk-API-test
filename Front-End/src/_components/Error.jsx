import React from 'react';

function Error({error}) {
  console.log(error);
  return (
    <div>
      <h1>Error Has Happened in retrieving your data</h1>
    </div>
  );
}

export { Error }; 