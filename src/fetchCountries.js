export function fetchCountries(name) {
  const baseUrl = 'https://restcountries.com/v3.1/';
  const endpoint = `name/${name}?fields=name,capital,population,flags,languages`;

  return fetch(baseUrl + endpoint)
    .then(response => {
      // if (!response.ok) {
      //   throw new Error(response.status);
      // }
      return response.json();
    });
}
