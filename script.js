// No API key needed!
const RSS_URL = "https://api.rss2json.com/v1/api.json?rss_url=";
const GOOGLE_NEWS = "https://news.google.com/rss/search?q=";

window.addEventListener('load', () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        showLoader(true);
        const rssUrl = `${GOOGLE_NEWS}${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
        const res = await fetch(`${RSS_URL}${encodeURIComponent(rssUrl)}`);
        const data = await res.json();
        if (data.items && data.items.length > 0) {
            bindData(data.items);
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

    // Google RSS thumbnail or fallback
    newsImg.src = article.thumbnail || 
                  article.enclosure?.link || 
                  `https://picsum.photos/seed/${Math.random()}/400/200`;
    newsImg.onerror = () => {
        newsImg.src = `https://picsum.photos/seed/${article.title}/400/200`;
    };

    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description
        ? article.description.replace(/<[^>]+>/g, '').substring(0, 150) + '...'
        : 'Click to read more...';

    const date = new Date(article.pubDate).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata"
    });

    newsSource.innerHTML = `${article.author || article.source || 'News'} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.link, "_blank");
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
