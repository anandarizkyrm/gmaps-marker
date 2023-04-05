async function getDataFromJson(url = './js/position.json') {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Failed to read json', error);
  }
}
