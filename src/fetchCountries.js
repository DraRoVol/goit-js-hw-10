const BASE_URL = 'https://restcountries.com/v3.1';
const searchParams = new URLSearchParams({
  fields: 'name,capital,population,flags,languages',
});

export async function fetchCountries(name) {
  const response = await fetch(`${BASE_URL}/name/${name}?${searchParams}`);
  if (!response.ok) {
    throw new Error(response.status);
  }
  const data = await response.json();
  return data;
}


