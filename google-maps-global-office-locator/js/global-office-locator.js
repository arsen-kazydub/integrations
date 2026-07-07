class GlobalOfficeLocator {
  constructor(root, options = {}) {
    this.root = root;
    if (!this.root) return;

    const defaults = {
      apiKey        : 'YOUR_API_KEY',
      mapId         : 'YOUR_MAP_ID',
      scriptId      : 'gol-api',
      baseUrl       : 'https://website.com',
      mapBounds : {
        north       : 75,
        south       : -40,
        west        : -180,
        east        : 180,
      },
      classes : {
        dragging    : 'gol--dragging',
        marker      : 'gol__marker',
        label       : 'gol__label',
        labelLeft   : 'gol__label--left',
        labelRight  : 'gol__label--right',
        labelLink   : 'gol__label-link',
      },
      countryStyle : {
        fillColor   : 'hsl(212, 80%, 50%)',
        fillOpacity : 0.4,
      },
      offices : [{
        country: 'Ukraine',
        countryId: 'ChIJjw5wVMHZ0UAREED2iIQGAQA',
        position: { lat: 50.45036, lng: 30.524503 },
        labelPlacement: 'right',
        cities: [{
          name: 'Kyiv',
          link: '/kyiv',
        }],
      }],
    };

    this.options = {
      ...defaults,
      ...options,
      mapBounds: {
        ...defaults.mapBounds,
        ...(options.mapBounds ?? {}),
      },
      classes: {
        ...defaults.classes,
        ...(options.classes ?? {}),
      },
      countryStyle: {
        ...defaults.countryStyle,
        ...(options.countryStyle ?? {}),
      },
    };

    this.lang = this.root.dataset.lang || 'en';

    // Google Maps invokes the callback without preserving the class context
    this.initGol = this.initGol.bind(this);

    this.init();
  }


  init() {
    this.loadGoogleMapsApi();
  }


  loadGoogleMapsApi() {
    // API already loaded - initialize the locator
    if (window.google && window.google.maps) {
      this.initGol();
      return;
    }

    // script already injected - wait for the callback
    if (document.getElementById(this.options.scriptId)) {
      return;
    }

    // expose callback for Google Maps
    window.initGol = this.initGol;

    const script = document.createElement('script');
    script.src =
      'https://maps.googleapis.com/maps/api/js' +
      '?key=' + this.options.apiKey +
      '&map_ids=' + this.options.mapId +
      '&libraries=marker' +
      '&callback=initGol';
    script.id    = this.options.scriptId;
    script.async = true;

    document.body.appendChild(script);
  }


  initGol() {
    const map = new google.maps.Map(this.root, {
      mapId: this.options.mapId,
      disableDefaultUI: true,
      restriction: {
        strictBounds: true,
        latLngBounds: this.options.mapBounds,
      },
      // the "center" parameter is required to initialize the map, though the exact location
      // is not used, because the map boundaries are defined in the "restrictions"
      center: { lat: 32, lng: 61 },
      // zoom: 4, // optional here, because we set zoom after initialization with map.setZoom()
    });

    // fractional zoom works only after initialization
    map.setZoom(this.getInitialZoom());

    // toggle class to correctly display the cursor state
    const mapDiv = map.getDiv();
    map.addListener('dragstart', () => {
      mapDiv.classList.add(this.options.classes.dragging);
    });
    map.addListener('dragend', () => {
      mapDiv.classList.remove(this.options.classes.dragging);
    });

    // style countries
    const countryLayer = map.getFeatureLayer('COUNTRY');
    const countryIds = new Set(this.options.offices.map(o => o.countryId));

    countryLayer.style = ({ feature }) => {
      if (!countryIds.has(feature.placeId)) {
        // apply the default Google Maps style to non-office countries
        return null;
      }
      return this.options.countryStyle;
    };

    // create markers
    this.options.offices.forEach(({ position, labelPlacement, cities }) => {
      const { classes } = this.options;

      const marker = document.createElement('div');
      marker.className = classes.marker;

      const label = document.createElement('span');
      label.classList.add(
        classes.label,
        labelPlacement === 'left'
          ? classes.labelLeft
          : classes.labelRight
      );
      marker.appendChild(label);

      cities.forEach(city => {
        const cityLink = document.createElement('a');
        const prefix = (this.lang === 'en') ? '' : `/${this.lang}`;

        cityLink.textContent = this.getLocalized(city.name);
        cityLink.href        = this.options.baseUrl + prefix + this.getLocalized(city.link);
        cityLink.className   = classes.labelLink;

        label.append(cityLink);
      });

      new google.maps.marker.AdvancedMarkerElement({ map, position, content: marker });
    });

    return map;
  }


  getInitialZoom() {
    const width = this.root.offsetWidth;
    if (width >= 1800) return 3.9;
    if (width >= 1600) return 3.7;
    if (width >= 1400) return 3.5;
    if (width >= 1200) return 3.3;
    if (width >= 950)  return 3;
    if (width >= 800)  return 2.7;
    if (width >= 600)  return 2.3;
    return 1.8;
  }


  getLocalized(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[this.lang] || value.en || '';
  }
}