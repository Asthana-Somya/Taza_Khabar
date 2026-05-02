const API_KEY = "1cc19917-bf9f-4201-b3f3-926f50782a60";
const BASE_URL = `https://content.guardianapis.com/search?api-key=${API_KEY}&show-fields=thumbnail,trailText,headline&page-size=12&q=`;

window.addEventListener('load', () => fetchNews("India"));

function reload() { window.location.reload(); }

async function fetchNews(query) {
    try {
        showLoader(true);
        const res = await fetch(`${BASE_URL}${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.response?.results?.length > 0) {
            bindData(data.response.results);
        } else {
            showError("No articles found.");
        }
    } catch (err) {
        showError("Failed to load news. Please try again.");
        console.error(err);
    } finally {
        showLoader(false);
    }
}

function bindData(articles) {
    const cardscontainer = document.getElementById('card-container');
    const newsCardTemplate = document.getElementById('template-news-card');
    cardscontainer.innerHTML = "";
    articles.forEach(article => {
        if (!article.fields?.thumbnail) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardscontainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newsImg.src = article.fields?.thumbnail;
    newsImg.onerror = () => {
        newsImg.src = "https://via.placeholder.com/400x200?text=No+Image";
    };

    newsTitle.innerHTML = article.fields?.headline || article.webTitle;
    newsDesc.innerHTML = article.fields?.trailText || 'Click to read more...';

    const date = new Date(article.webPublicationDate).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata"
    });

    newsSource.innerHTML = `The Guardian · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.webUrl, "_blank");
    });
}

function showLoader(show) {
    let loader = document.getElementById('loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loader';
        loader.style.cssText = 'text-align:center;padding:40px;font-size:1.2rem;color:#555';
        loader.innerHTML = '⏳ Loading news...';
        document.getElementById('card-container').before(loader);
    }
    loader.style.display = show ? 'block' : 'none';
}

function showError(msg) {
    const cardscontainer = document.getElementById('card-container');
    cardscontainer.innerHTML = `<p style="text-align:center;color:red;padding:40px">${msg}</p>`;
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const NavItem = document.getElementById(id);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = NavItem;
    curSelectedNav.classList.add('active');
}

const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search-text');
searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = null;
});
