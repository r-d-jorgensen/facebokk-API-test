//method to call facebook api with promise
export async function facebookAPICall(url, fields) {
  return await new Promise((resolve, reject) => {
    window.FB.api(
      url,
      'GET',
      fields,
      function (response) {
        if (response.error) reject(new Error(response.error));
        else resolve(response);
      }
    );
  })
}