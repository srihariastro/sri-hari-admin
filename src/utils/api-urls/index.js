export let api_urls;

if (window.location.protocol === 'http:') {
    api_urls = 'https://api.astroremedy.com/';
} else if (window.location.protocol === 'https:') {
    api_urls = 'https://api.astroremedy.com/';
} else {
    console.log('Unknown protocol');
};