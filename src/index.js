import "./styles.css";

const app = {};
const apikey = "https://api.themoviedb.org/3/";
const key = "2f515fc504e3f50e398af0511739efa3";
const image_size = "/w500/";
const trending = apikey + "trending/all/day?api_key=" + key;
const parent = document.getElementById("app");
const inputValue = document.getElementById("data");
const searchElement = document.getElementById("search");
const homeElement = document.getElementById("home");

const movie = {};
const recomendation = {};

const init = () => getMovies();
const getMovies = () => request(trending, "movie");
const getImage = obj => createElem("img", obj);

const request = async url => {
  try {
    const response = await fetch(url);
    const { results } = await response.json();

    if (results.length !== 0) {
      results.map(num => createElem("a", num));
    } else {
      throw new Error("Not found items");
    }
  } catch (error) {
    createElem("p", error);
  }
};

const createElem = (tagName, results) => {
  const newElem = document.createElement(tagName);
  switch (tagName) {
    case "img":
      newElem.setAttribute("src", `http://image.tmdb.org/t/p${image_size}${results}`);
      break;
    case "a":
      let title = results.original_title ? results.original_title : results.original_name;
      title = title ? title : results.name;
      newElem.setAttribute("href", title);
      newElem.setAttribute("id", results.id);
      newElem.addEventListener("click", (e) => {
          e.preventDefault();
          removeElements();
          getImage(results.backdrop_path ? results.backdrop_path : results.logo_path);
          createElem("h3", title);
          createElem("p", results.overview);
          getRecomendation(results.id);
        },
        false
      );
      newElem.innerHTML = title;
      newElem.setAttribute("title", title);
      break;
    default:
      newElem.innerHTML = results;
      break;
  }
  parent.appendChild(newElem);
};

const removeElements = () => {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

const getMovieByName = () => {
  const url = `${apikey}search/movie?api_key=${key}&query=${inputValue.value}&page=1`;
  request(url, "movie");
  removeElements();
  const results = movie.results ? movie.results : [];
  results.map(num => createElem("a", num));
  return;
};

const setLinks = () => {
  const links = document.getElementsByTagName("a");
  links.forEach(link => {
    document
      .getElementById(link[i].id)
      .addEventListener("click", evt => getImage(evt), false);
  });
};

const getRecomendation = id => {
  const url = `${apikey}movie/${id}/recommendations?api_key=${key}`;
  createElem("h3", "Recomendations:");
  request(url, "recomendation");
};

inputValue.onkeydown = (e) => e.keyCode === 13 ? getMovieByName() : null;

homeElement.addEventListener("click", () => {
  removeElements();
  init();
});

searchElement.addEventListener("click", () => {
  if (inputValue.value) {
    getMovieByName();
  } else {
    removeElements();
    init();
  }
});

init();
