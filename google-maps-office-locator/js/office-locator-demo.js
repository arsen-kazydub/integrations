document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('office-locator');
  if (!root) return;

  const apiKey = 'AIzaSyDDC0873SGpv4tEm69SO8KSzttmBh1ve7o';
  const mapId  = '3ae749673c9ce03ae6dc801a';

  // To add a new office, retrieve:
  // - the country Place ID
  // - the geographic coordinates
  //
  // Resources:
  // https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
  // https://developers.google.com/maps/documentation/geocoding/overview#place-id

  const offices = [{
    country: 'France',
    countryId: 'ChIJMVd4MymgVA0R99lHx5Y__Ws',
    position: { lat: 48.857548, lng: 2.351377 },
    labelPlacement: 'right',
    cities: [{
      name: 'Paris',
      link: '/paris',
    }],
  }, {
    country: { en: 'Morocco', fr: 'Maroc' },
    countryId: 'ChIJjcVRlmGICw0Rw_8sxIGT09k',
    position: { lat: 33.57311, lng: -7.589843 },
    labelPlacement: 'right',
    cities: [{
      name: 'Casablanca',
      link: '/casablanca',
    }],
  }, {
    country: { en: 'Lebanon', fr: 'Liban' },
    countryId: 'ChIJraoihAIXHxURcPkAbAk0fcw',
    position: { lat: 33.893791, lng: 35.501777 },
    labelPlacement: 'left',
    cities: [{
      name: { en: 'Beirut', fr: 'Beyrouth' },
      link: '/beirut',
    }],
  }, {
    country: { en: 'Saudi Arabia', fr: 'Arabie saoudite' },
    countryId: 'ChIJQSqV5z-z5xURm7YawktQYFk',
    position: { lat: 24.713552, lng: 46.675296 },
    labelPlacement: 'left',
    cities: [{
      name: { en: 'Riyadh', fr: 'Riyad' },
      link: '/riyadh',
    }],
  }, {
    country: { en: 'China', fr: 'Chine' },
    countryId: 'ChIJwULG5WSOUDERbzafNHyqHZU',
    position: { lat: 22.319304, lng: 114.169361 },
    labelPlacement: 'left',
    cities: [{
      name: 'Hong Kong',
      link: '/hong-kong',
    }],
  }, {
    country: { en: 'UAE', fr: 'ÉAU' },
    countryId: 'ChIJvRKrsd9IXj4RpwoIwFYv0zM',
    position: { lat: 25.204849, lng: 55.270783 },
    labelPlacement: 'right',
    cities: [{
      name: { en: 'Dubai', fr: 'Dubaï' },
      link: '/dubai',
    }, {
      name: { en: 'Abu Dhabi', fr: 'Abou Dabi' },
      link: '/abu-dhabi',
    }, {
      name: 'Ras Al Khaimah',
      link: '/ras-al-khaimah',
    }],
  }];

  new GoogleMapsOfficeLocator(root, { apiKey, mapId, offices });
});