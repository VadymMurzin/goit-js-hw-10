import debounce from 'lodash/debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const searchBox = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const countryListItemTemplate = country => `
  <li class="list">
    <img src="${country.flags.svg}" width="60" height="40" alt="Flag of ${country.name.common}">
    <p class="text">${country.name.common}</p>
  </li>
`;

const countryInfoTemplate = country => `
  <div class="country-card">
    <div class="contry-title-flag">
      <img src="${country.flags.svg}" width="80" height="60" alt="Flag of ${country.name.common}">
      <h1 class="text">${country.name.common}</h1>
    </div>
    <p>Capital: ${country.capital}</p>
    <p>Population: ${country.population}</p>
    <p>Languages: ${Object.values(country.languages).join(', ')}</p>
  </div>
`;

function renderCountryList(countries) {
  countryList.innerHTML = countries.map(country => `<li>${countryListItemTemplate(country)}</li>`).join('');

  const listItems = countryList.querySelectorAll('li');
  listItems.forEach((listItem, index) => {
    listItem.addEventListener('click', () => {
      renderCountryInfo(countries[index]);
    });
  });
}

function showTooManyMatchesMessage() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}

function renderCountryInfo(country) {
  countryInfo.innerHTML = countryInfoTemplate(country);
}

function searchCountries(name) {
  clearCountryListAndInfo();
  if (name === '') {
    return;
  }

  fetchCountries(name)
    .then(countries => {
      if (countries.length === 0) {
        clearCountryListAndInfo();
      } else if (countries.length === 1) {
        renderCountryInfo(countries[0]);
        showTooManyMatchesMessage();
        clearCountryList();
      } else {
        renderCountryList(countries);
        showTooManyMatchesMessage();
      }
    })
    .catch(error => {
      showErrorMessage();
      console.error(error);
    });
}

function clearCountryList() {
  countryList.innerHTML = '';
}

function clearCountryListAndInfo() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function showErrorMessage() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

searchBox.addEventListener(
  'input',
  debounce(event => {
    const searchValue = event.target.value.trim();
    searchCountries(searchValue);
  }, DEBOUNCE_DELAY)
);
