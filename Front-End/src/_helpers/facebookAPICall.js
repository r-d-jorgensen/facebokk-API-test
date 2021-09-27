// Method to call facebook api with promise
export default async function facebookAPICall(url, fields) {
  return new Promise((resolve, reject) => {
    window.FB.api(
      url,
      'GET',
      fields,
      (response) => {
        if (response.error) reject(response.error);
        else resolve(response);
      },
    );
  });
}
