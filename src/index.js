import './css/styles.css';

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.6.min.css';

import { fetchCountries } from './fetchCountries.js';

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

searchInput.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  clearHTML([countryList, countryInfo]);
  if (e.target.value.trim() === '') {
    return;
  }
  fetchCountries(e.target.value.trim())
    .then(countries => {
      if (countries.length > 10) {
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      countries = normalizeCountries(countries);

      if (countries.length > 1 && countries.length <= 10) {
        renderCountries(countries);
      } else if (countries.length === 1) {
        renderCountry(countries);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function normalizeCountries(countries) {
  return countries.map(({ name, capital, population, flags, languages }) => ({
    name: name.official,
    capital,
    population,
    flag: flags.svg,
    languages: Object.values(languages),
  }));
}

function renderCountries(countries) {
  countryList.innerHTML = `
    <ul>
      ${countries
        .map(
          country => `
          <li>
            <img src="${country.flag}" alt="Flag of ${country.name}" width="35" height="25">
            <span class="country-name">${country.name}</span>
          </li>
        `
        )
        .join('')}
    </ul>
  `;
}

function renderCountry(countries) {
  renderCountries(countries);
  const country = countries[0];
  const countryInfoElem = document.createElement('div');
  countryInfoElem.classList.add('country-info-container');

  const countryInfoHTML = `
    <h2>${country.name}</h2>
    <div class="country-info-details">
      <p><span>Capital:</span> ${country.capital}</p>
      <p><span>Population:</span> ${country.population.toLocaleString()}</p>
      <p><span>Languages:</span> ${country.languages.join(', ')}</p>
    </div>
  `;
  countryInfoElem.innerHTML = countryInfoHTML;

  countryInfo.append(countryInfoElem);
}

function clearHTML(HTMLElements) {
  HTMLElements.forEach(elem => (elem.innerHTML = ''));
}








