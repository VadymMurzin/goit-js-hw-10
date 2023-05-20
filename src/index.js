import './css/styles.css';
import debounce from 'lodash/debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const searchBox = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

function countryListItemTemplate(country) {
  const { name, flags } = country;
  return `
      <li class="list">
        <img src="${flags.svg}" width="60" height="40" alt="Flag of ${name.common}">
        <p class="text">${name.common}</p>
      </li>
    `;
}

function countryInfoTemplate(country) {
  const { name, flags, capital, population, languages } = country;
  const countryName = name.common;
  const countryLanguages = Object.values(languages).join(', ');
  return `
      <div class="country-card">
        <div class="contry-title-flag">
            <img src="${flags.svg}" width="80" height="60" alt="Flag of ${countryName}">
            <h1 class="text">${countryName}</h1>
        </div>
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Languages: ${countryLanguages}</p>
      </div>
    `;
}

function renderCountryList(countries) {
  countryList.innerHTML = '';
  if (countries.length === 0) {
    return;
  }

  if (countries.length > 10) {
    showTooManyMatchesMessage();
    return;
  }

  countries.forEach(function (country) {
    const listItem = createCountryListItem(country);
    countryList.appendChild(listItem);
  });
}

function createCountryListItem(country) {
  const listItem = document.createElement('li');
  listItem.innerHTML = countryListItemTemplate(country);
  listItem.addEventListener('click', function () {
    renderCountryInfo(country);
  });
  return listItem;
}

function showTooManyMatchesMessage() {
  Notiflix.Notify.warning(
    'Too many matches found. Please enter a more specific name.'
  );
}

function renderCountryInfo(country) {
  countryInfo.innerHTML = countryInfoTemplate(country);
}

function searchCountries(name) {
  if (name.trim() === '') {
    clearCountryListAndInfo();
    return;
  }

  fetchCountries(name)
    .then(function (countries) {
      if (countries.length === 0) {
        clearCountryListAndInfo();
      } else if (
        countries.length === 1 &&
        countries[0].name.common.toLowerCase().startsWith(name.toLowerCase())
      ) {
        renderCountryInfo(countries[0]);
        clearCountryList();
      } else {
        renderFilteredCountryList(countries, name);
      }
    })
    .catch(function (error) {
      showErrorMessage();
      console.error(error);
    });
}

function clearCountryList() {
  countryList.innerHTML = '';
}

function renderFilteredCountryList(countries, name) {
  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().startsWith(name.toLowerCase())
  );
  renderCountryList(filteredCountries);
}

function clearCountryListAndInfo() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function showErrorMessage() {
  Notiflix.Notify.failure('Oops, there was an error. Please try again.');
}

const debouncedSearch = debounce(function (searchValue) {
  searchCountries(searchValue);
}, DEBOUNCE_DELAY);

searchBox.addEventListener('input', function (event) {
  const searchValue = event.target.value.trim();
  debouncedSearch(searchValue);
});
