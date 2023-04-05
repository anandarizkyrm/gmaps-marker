// handle current marker active
function activePosition(locationListName) {
  document
    .querySelectorAll('.location-name')
    .forEach((el) => el.classList.remove('active'));
  if (locationListName) {
    locationListName.classList.add('active');
  }
}

async function initMap() {
  const mapOptions = {
    center: { lat: 1.293666, lng: 103.850524 },
    zoom: 15,
  };

  const googlemap = new google.maps.Map(
    document.getElementById('map'),
    mapOptions
  );

  const positionData = await getDataFromJson();
  let currentActiveMarker = null;
  const markers = [];

  positionData.forEach((data) => {
    const { name, img, description, address, website, content } = data.about;
    const locationListName = document.createElement('div');

    // google maps configuration
    const smallMarkerConfig = {
      icon: {
        url: '/img/path-map.png',
        scaledSize: new google.maps.Size(90, 95),
        labelOrigin: new google.maps.Point(
          data.additionalDataPosition[0].x,
          data.additionalDataPosition[0].y
        ),
      },
      label: {
        text: name,
        fontSize: '12px',
        className: 'label-pin-small',
      },
    };

    const bigMarkerConfig = {
      icon: {
        url: '/img/path-map.png',
        scaledSize: new google.maps.Size(180, 185),
        labelOrigin: new google.maps.Point(
          data.additionalDataPosition[1].x,
          data.additionalDataPosition[1].y
        ),
      },
      label: {
        text: name,
        fontSize: '12px',
        className: 'label-pin-large',
      },
    };

    const marker = new google.maps.Marker({
      position: { lat: data.lat, lng: data.lng },
      map: googlemap,
      icon: smallMarkerConfig.icon,
      title: name,
      label: smallMarkerConfig.label,
    });

    //this will reset active marker back to default because without this the marker
    //will stay in large position even when another active marker is selected
    markers.push(marker);
    // reset all marker
    function resetMarkers() {
      markers.forEach((x) => {
        if (x.label.text != currentActiveMarker) {
          x.setIcon(smallMarkerConfig.icon);
          x.setLabel(smallMarkerConfig.label);
        }
      });
    }

    // handle tranform marker icon
    function transformToSmallMarker() {
      marker.setIcon(smallMarkerConfig.icon);
      marker.setLabel(smallMarkerConfig.label);
    }

    function transformToLargeMarker() {
      marker.setIcon(bigMarkerConfig.icon);
      marker.setLabel(bigMarkerConfig.label);
    }

    function centeredMarker() {
      googlemap.setCenter({ lat: data.lat, lng: data.lng });
      googlemap.setZoom(17);
    }

    function setActiveMarker() {
      currentActiveMarker = name;
      // first need to reset other active markers
      resetMarkers();

      centeredMarker();
      transformToLargeMarker();
      // set active sidebar
      activePosition(locationListName);
      sidebarDescriptionHandler(
        name,
        img,
        description,
        content,
        address,
        website
      );
    }

    // handle close description
    closeDesc.addEventListener('click', function () {
      currentActiveMarker = null;
      googlemap.setZoom(15);

      transformToSmallMarker();
      // reset the active sidebar
      activePosition();

      closeSidebarDescription();
    });

    // marker handler
    marker.addListener('mouseover', function () {
      transformToLargeMarker();
    });

    marker.addListener('mouseout', function () {
      if (currentActiveMarker != name) {
        transformToSmallMarker();
      }
    });

    marker.addListener('click', function () {
      setActiveMarker();
    });

    // sidebar list item handler

    // append the location name to sidebar
    locationListContainer.append(locationListName);
    locationListName.classList.add('location-name');
    locationListName.append(name);

    locationListName.addEventListener('click', function () {
      setActiveMarker();
    });

    locationListName.addEventListener('mouseover', function () {
      transformToLargeMarker();
    });

    locationListName.addEventListener('mouseout', function () {
      if (currentActiveMarker != name) {
        transformToSmallMarker();
      }
    });
  });
}

initMap();
