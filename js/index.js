const locationDescTitle = document.querySelector('.location-description-title');
const sidebarDescription = document.querySelector(
  '.side-location-description '
);
const locationListContainer = document.querySelector('.location-list');
const imageDesc = document.querySelector('.image-desc');
const textDesc = document.querySelector('.text-desc');
const textContent = document.querySelector('.text-content');
const descLocation = document.querySelector('.address');
const descWeb = document.querySelector('.website');

const closeDesc = document.querySelector('#close');

async function sidebarList() {
  // sidebar
  const sidebarContainer = document.querySelector('.sidebar');
  const getSidebarList = await getDataFromJson('./js/listSidebar.json');

  getSidebarList.forEach((data, idx) => {
    const sidebarContent = document.createElement('div');
    const sidebarContentImage = document.createElement('img');

    if (idx == 0) {
      sidebarContent.classList.add('sidebar-content-active');
    } else {
      sidebarContent.classList.add('sidebar-content');
    }
    sidebarContent.textContent = data.text;
    sidebarContentImage.width = 40;
    sidebarContentImage.src = data.icon;

    sidebarContent.append(sidebarContentImage);
    sidebarContainer.append(sidebarContent);
  });
}

function sidebarDescriptionHandler(title, img, text, content, location, web) {
  sidebarDescription.classList.remove('hidden');
  locationDescTitle.textContent = title;
  imageDesc.src = img;
  textDesc.textContent = text;
  textContent.textContent = content;
  descLocation.textContent = location;
  descWeb.textContent = web;
}

function closeSidebarDescription() {
  sidebarDescription.classList.add('hidden');
}

sidebarList();
