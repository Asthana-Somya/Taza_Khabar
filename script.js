const API_KEY = "5a9623e86284128d48d6e9e059ee361d";
const BASE_URL = `http://api.mediastack.com/v1/news?access_key=${API_KEY}&countries=in&languages=en&limit=12`;

window.addEventListener('load', () => fetchNews("India"));

function reload() { window.location.reload(); }

async function fetchNews(query) {
    try {
        showLoader(true);
        const res = await fetch(`${BASE_URL}&keywords=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.data && data.data.length > 0) {
            bindData(data.data);
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

    newsImg.src = article.image || 
        `https://source.unsplash.com/400x200/?news,${encodeURIComponent(article.category || 'india')}`;
    newsImg.onerror = () => {
        newsImg.src = `https://source.unsplash.com/400x200/?newspaper`;
    };

    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description
        ? article.description.substring(0, 150) + '...'
        : 'Click to read more...';

    const date = new Date(article.published_at).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata"
    });

    newsSource.innerHTML = `${article.source || 'News'} · ${date}`;

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
