export let api_urls;
const API_URL = 'https://api.srihariastro.com/'
if (window.location.protocol === 'http:') {
    api_urls = API_URL;
} else if (window.location.protocol === 'https:') {
    api_urls = API_URL;
} else {
    console.log('Unknown protocol');
};