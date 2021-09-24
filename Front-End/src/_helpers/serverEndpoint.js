export const serverEndpoint = 
  process.env.NODE_ENV === 'development'
    ? 'localhost:80'
    : process.env.REACT_APP_PRODUCTION_ENDPOINT;