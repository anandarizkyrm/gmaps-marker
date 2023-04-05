// web refferences
// http://users.umiacs.umd.edu/~louiqa/2014/BMGT406/novel-project-tutorial/novel-google-maps-javascript.html
// https://stackoverflow.com/questions/42323569/customize-google-map-api-v3-marker-label

async function mapHandler() {
  const googlemap = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 1.293666, lng: 103.850524 },
    zoom: 15,
  });

  const positionData = await getDataFromJson(); // will return an array of positions
  let currentActiveMarker = null;

  //this will reset active marker back to default because without this the marker
  //will stay in large position even when another active marker is selected
  const markers = [];
  function resetMarkers(iconConfig) {
    markers.forEach((x) => {
      if (x.label.text != currentActiveMarker) {
        x.setIcon(iconConfig.icon);
        x.setLabel(iconConfig.label);
      }
    });
  }
  positionData.forEach((data) => {
    const { name, img, description, address, website, content } = data.about;
    const locationListName = document.createElement('div');

    // google maps configuration
    const smallMarkerConfig = {
      icon: {
        url: '/img/path-map.png',
        scaledSize: new google.maps.Size(90, 95),
        labelOrigin: new google.maps.Point(
          data.labelPos[0].x,
          data.labelPos[0].y
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
          data.labelPos[1].x,
          data.labelPos[1].y
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
    markers.push(marker);

    // handle transform marker icon
    function transformMarker(markerConfig) {
      marker.setIcon(markerConfig.icon);
      marker.setLabel(markerConfig.label);
    }

    function centeredMarker() {
      googlemap.setCenter({ lat: data.lat, lng: data.lng });
      googlemap.setZoom(17);
    }

    function setActiveMarker() {
      currentActiveMarker = name;
      // first need to reset other active markers
      resetMarkers(smallMarkerConfig);

      centeredMarker();
      transformMarker(bigMarkerConfig);
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

      transformMarker(smallMarkerConfig);
      // reset the active sidebar
      activePosition();

      closeSidebarDescription();
    });

    // marker handler
    marker.addListener('mouseover', function () {
      transformMarker(bigMarkerConfig);
    });

    marker.addListener('mouseout', function () {
      if (currentActiveMarker != name) {
        transformMarker(smallMarkerConfig);
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
      transformMarker(bigMarkerConfig);
    });

    locationListName.addEventListener('mouseout', function () {
      if (currentActiveMarker != name) {
        transformMarker(smallMarkerConfig);
      }
    });
  });
}

google.maps.event.addDomListener(window, 'load', mapHandler());
