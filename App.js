window.addEventListener("DOMContentLoaded", initializeApp);
// the base url endpoint
const baseUrlEndpoint =
  "https://coronavirus-tracker-api.herokuapp.com/v2/locations";

//container for displaying the corona details

let coronaDetailsContainer;

//drop down for countries
let countrySelectDropdown;
//container for world corona details
let coronaWorldDetailsContainer;

const coronaData = {
  latest: {},
  locations: [],
};
const countriesWithCountryCode = {
  "TH": "Thailand",
  "JP": "Japan",
  "SG": "Singapore",
  "NP": "Nepal",
  "MY": "Malaysia",
  "CA": "Canada",
  "AU": "Australia",
  "KH": "Cambodia",
  "LK": "Sri Lanka",
  "DE": "Germany",
  "FI": "Finland",
  "AE": "United Arab Emirates",
  "PH": "Philippines",
  "IN": "India",
  "IT": "Italy",
  "SE": "Sweden",
  "ES": "Spain",
  "BE": "Belgium",
  "EG": "Egypt",
  "LB": "Lebanon",
  "IQ": "Iraq",
  "OM": "Oman",
  "AF": "Afghanistan",
  "BH": "Bahrain",
  "KW": "Kuwait",
  "DZ": "Algeria",
  "HR": "Croatia",
  "CH": "Switzerland",
  "AT": "Austria",
  "IL": "Israel",
  "PK": "Pakistan",
  "BR": "Brazil",
  "GE": "Georgia",
  "GR": "Greece",
  "MK": "North Macedonia",
  "NO": "Norway",
  "RO": "Romania",
  "EE": "Estonia",
  "SM": "San Marino",
  "BY": "Belarus",
  "IS": "Iceland",
  "LT": "Lithuania",
  "MX": "Mexico",
  "NZ": "New Zealand",
  "NG": "Nigeria",
  "IE": "Ireland",
  "LU": "Luxembourg",
  "MC": "Monaco",
  "QA": "Qatar",
  "EC": "Ecuador",
  "AZ": "Azerbaijan",
  "AM": "Armenia",
  "DO": "Dominican Republic",
  "ID": "Indonesia",
  "PT": "Portugal",
  "AD": "Andorra",
  "LV": "Latvia",
  "MA": "Morocco",
  "SA": "Saudi Arabia",
  "SN": "Senegal",
  "AR": "Argentina",
  "CL": "Chile",
  "JO": "Jordan",
  "UA": "Ukraine",
  "HU": "Hungary",
  "LI": "Liechtenstein",
  "PL": "Poland",
  "TN": "Tunisia",
  "BA": "Bosnia and Herzegovina",
  "SI": "Slovenia",
  "ZA": "South Africa",
  "BT": "Bhutan",
  "CM": "Cameroon",
  "CO": "Colombia",
  "CR": "Costa Rica",
  "PE": "Peru",
  "RS": "Serbia",
  "SK": "Slovakia",
  "TG": "Togo",
  "MT": "Malta",
  "MQ": "Martinique",
  "BG": "Bulgaria",
  "MV": "Maldives",
  "BD": "Bangladesh",
  "PY": "Paraguay",
  "AL": "Albania",
  "CY": "Cyprus",
  "BN": "Brunei",
  "US": "US",
  "BF": "Burkina Faso",
  "VA": "Holy See",
  "MN": "Mongolia",
  "PA": "Panama",
  "CN": "China",
  "IR": "Iran",
  "KR": "Korea, South",
  "FR": "France",
  "XX": "Cruise Ship",
  "DK": "Denmark",
  "CZ": "Czechia",
  "TW": "Taiwan*",
  "VN": "Vietnam",
  "RU": "Russia",
  "MD": "Moldova",
  "BO": "Bolivia",
  "HN": "Honduras",
  "GB": "United Kingdom",
  "CD": "Congo (Kinshasa)",
  "CI": "Cote d'Ivoire",
  "JM": "Jamaica",
  "TR": "Turkey",
  "CU": "Cuba",
  "GY": "Guyana",
  "KZ": "Kazakhstan",
  "ET": "Ethiopia",
  "SD": "Sudan",
  "GN": "Guinea",
  "KE": "Kenya",
  "AG": "Antigua and Barbuda",
  "UY": "Uruguay",
  "GH": "Ghana",
  "NA": "Namibia",
  "SC": "Seychelles",
  "TT": "Trinidad and Tobago",
  "VE": "Venezuela",
  "SZ": "Eswatini",
  "GA": "Gabon",
  "GT": "Guatemala",
  "MR": "Mauritania",
  "RW": "Rwanda",
  "LC": "Saint Lucia",
  "VC": "Saint Vincent and the Grenadines",
  "SR": "Suriname",
  "XK": "Kosovo",
  "CF": "Central African Republic",
  "CG": "Congo (Brazzaville)",
  "GQ": "Equatorial Guinea",
  "UZ": "Uzbekistan",
  "NL": "Netherlands",
  "BJ": "Benin",
  "LR": "Liberia",
  "SO": "Somalia",
  "TZ": "Tanzania",
  "BB": "Barbados",
  "ME": "Montenegro",
  "KG": "Kyrgyzstan",
  "MU": "Mauritius",
  "ZM": "Zambia",
  "DJ": "Djibouti",
  "GM": "Gambia, The",
  "BS": "Bahamas, The",
  "TD": "Chad",
  "SV": "El Salvador",
  "FJ": "Fiji",
  "NI": "Nicaragua",
  "MG": "Madagascar",
  "HT": "Haiti",
  "AO": "Angola",
  "CV": "Cape Verde",
  "NE": "Niger",
  "PG": "Papua New Guinea",
  "ZW": "Zimbabwe",
  "TL": "Timor-Leste",
  "ER": "Eritrea",
  "UG": "Uganda",
  "DM": "Dominica",
  "GD": "Grenada",
  "MZ": "Mozambique",
  "SY": "Syria"
};

function populateLocation(country, country_code) {
  const countryOption = document.createElement("option");
  countryOption.value = country;
  //console.log(countryOption);
  countryOption.textContent = `${country_code}-${country}`;
  console.log(countryOption);
  countrySelectDropdown.appendChild(countryOption);
}

function populateLocations() {
  Object.entries(countriesWithCountryCode).forEach(([country_code, country]) =>
    populateLocation(country, country_code)
  );
}
async function initializeApp() {
  console.log("initialize the App");
  setReferences();
  NProgress.start();
  populateLocations();
  await performAsyncCall();
  renderUI(coronaData.latest, world=true);
  //console.log("world detail", coronaData.latest);
  //console.log(`world location:${coronaData.location}`);
  doEventBindings();
  NProgress.done();
}
async function performAsyncCall() {
  const response = await fetch(`${baseUrlEndpoint}`);
  const data = await response.json();
  //console.log(data);
  const { latest, locations } = data;
  coronaData.latest = latest;
  coronaData.locations.push(...locations);
}

function renderUI(details, world=false)
{
  let html ='';
  html=`
  <table class="table">
  <thead>
  ${world ? '<h1> World Details </h1>':`
  <tr>${details.country} ${details.country_code}</tr>
  
  `}
  <tbody>
  <tr>
  <td class="cases"> Reported Cases:</td>
  <td> ${world ? details.confirmed : details.latest.confirmed}</td>
  </tr>
  <tr>
  <td class="deaths"> Deaths:</td>
  <td> ${world ? details.deaths : details.latest.deaths}</td>
  </tr>
  </tbody>
  </thead>
  
  </table>
  `;
  if(world){
    coronaWorldDetailsContainer.innerHTML=html;
  }
  else
  {
    coronaDetailsContainer.innerHTML=html;
  }

}

function renDerdetailsforSelectedLocation(event) {
  // console.log(event.target.value);
  const countrySelected = event.target.value;
  const locationCoronaDetails = coronaData.locations.reduce(
    (accumulator, currentLocation) => {
      if (currentLocation.country === countrySelected) {
        accumulator['country'] = currentLocation.country;
        accumulator['country_code'] = currentLocation.country_code;
        accumulator.latest.confirmed += currentLocation.latest.confirmed;
        accumulator.latest.deaths += currentLocation.latest.deaths;
        //console.log(currentLocation.latest.confirmed)
      }
      return accumulator
    },
    {
      //initial value for accumulator.
      country : '',
      country_code : '',
      latest : {
        confirmed : 0,
        deaths : 0
      }
     
     
      });
  //console.log(locationCoronaDetails);
  renderUI(locationCoronaDetails);
}

function setReferences() {
  coronaDetailsContainer = document.querySelector('#corona-details');
  countrySelectDropdown = document.querySelector('[name="select-country"]');
  coronaWorldDetailsContainer = document.querySelector('#corona-world-details');
}

function doEventBindings() {
  countrySelectDropdown.addEventListener('change',renDerdetailsforSelectedLocation);
}
