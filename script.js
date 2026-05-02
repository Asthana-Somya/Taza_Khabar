const API_KEY = "9ddafe22322cf34258cd14a552d83a27"; 
const url = "https://gnews.io/api/v4/search?lang=en&country=in&max=12&apikey=" + API_KEY + "&q=";

window.addEventListener('load', () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        showLoader(true);
        const res = await fetch(`${url}${encodeURIComponent(query)}`);
        const data = await res.json();
        console.log(data);
        if (data.articles) {
            bindData(data.articles);
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
        if (!article.image) return;
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

    newsImg.src = article.image;
    newsImg.onerror = () => { newsImg.src = "https://via.placeholder.com/400x200?text=No+Image"; };
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata" // Fixed to India timezone
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
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
