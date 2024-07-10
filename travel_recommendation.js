let data = {};

fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(json => {
        data = json;
    })
    .catch(error => console.error('Error loading JSON data:', error));

function search() {
    const input = document.getElementById('search-input').value.toLowerCase();
    const results = document.getElementById('search-results');
    results.innerHTML = '';

    if (!input) return;

    let found = false;

    // Search in countries and cities
    data.countries.forEach(country => {
        if (country.name.toLowerCase().includes(input)) {
            found = true;
            displayCountry(country);
            fetchCountryTime(country.name);
        }
        country.cities.forEach(city => {
            if (city.name.toLowerCase().includes(input)) {
                found = true;
                displayCity(city, country.name);
                fetchCountryTime(country.name);
            }
        });
    });

    // Search in temples
    data.temples.forEach(temple => {
        if (temple.name.toLowerCase().includes(input)) {
            found = true;
            displayTemple(temple);
            fetchCountryTime(temple.name.split(', ')[1]);
        }
    });

    // Search in beaches
    data.beaches.forEach(beach => {
        if (beach.name.toLowerCase().includes(input)) {
            found = true;
            displayBeach(beach);
            fetchCountryTime(beach.name.split(', ')[1]);
        }
    });

    if (!found) {
        results.innerHTML = '<p>No results found.</p>';
    }
}

function displayCountry(country) {
    const results = document.getElementById('search-results');
    const countryDiv = document.createElement('div');
    countryDiv.classList.add('result-item');
    countryDiv.innerHTML = `<h2>${country.name}</h2><div id="time-${country.name.replace(/\s+/g, '-')}"></div>`;
    results.appendChild(countryDiv);
}

function displayCity(city, countryName) {
    const results = document.getElementById('search-results');
    const cityDiv = document.createElement('div');
    cityDiv.classList.add('result-item');
    cityDiv.innerHTML = `
        <h3>${city.name}</h3>
        <img src="${city.imageUrl}" alt="${city.name}">
        <p>${city.description}</p>
        <p><strong>Country:</strong> ${countryName}</p>
        <div id="time-${city.name.replace(/\s+/g, '-')}"></div>
    `;
    results.appendChild(cityDiv);
}

function displayTemple(temple) {
    const results = document.getElementById('search-results');
    const templeDiv = document.createElement('div');
    templeDiv.classList.add('result-item');
    templeDiv.innerHTML = `
        <h3>${temple.name}</h3>
        <img src="${temple.imageUrl}" alt="${temple.name}">
        <p>${temple.description}</p>
        <div id="time-${temple.name.replace(/\s+/g, '-')}"></div>
    `;
    results.appendChild(templeDiv);
}

function displayBeach(beach) {
    const results = document.getElementById('search-results');
    const beachDiv = document.createElement('div');
    beachDiv.classList.add('result-item');
    beachDiv.innerHTML = `
        <h3>${beach.name}</h3>
        <img src="${beach.imageUrl}" alt="${beach.name}">
        <p>${beach.description}</p>
        <div id="time-${beach.name.replace(/\s+/g, '-')}"></div>
    `;
    results.appendChild(beachDiv);
}

function fetchCountryTime(countryName) {
    const countrySlug = countryName.replace(/\s+/g, '-').toLowerCase();
    const timeContainer = document.getElementById(`time-${countrySlug}`);

    fetch(`https://worldtimeapi.org/api/timezone/${getTimezone(countryName)}`)
        .then(response => response.json())
        .then(data => {
            const dateTime = new Date(data.datetime);
            timeContainer.innerHTML = `<p>Current local time: ${dateTime.toLocaleTimeString()}</p>`;
        })
        .catch(error => console.error('Error fetching time data:', error));
}

function getTimezone(countryName) {
    switch (countryName.toLowerCase()) {
        case 'australia':
            return 'Australia/Sydney'; // Example timezone, change as needed
        case 'japan':
            return 'Asia/Tokyo'; // Example timezone, change as needed
        case 'brazil':
            return 'America/Sao_Paulo'; // Example timezone, change as needed
        default:
            return 'UTC'; // Default timezone
    }
}

function resetSearch() {
    document.getElementById('search-input').value = '';
    document.getElementById('search-results').innerHTML = '';
}
