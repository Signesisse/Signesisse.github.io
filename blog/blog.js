document.addEventListener('DOMContentLoaded', () => {
  const OWNER = 'Signesisse';
  const REPO = 'Signesisse.github.io';
  const EXCLUDED = new Set(['index.html', 'template.html']);

  const status = document.getElementById('posts-status');
  const list = document.getElementById('posts');
  if (!status || !list) return;

  async function loadPosts() {
    let files;
    try {
      // Unauthenticated GitHub API calls are capped at 60/hour per visitor IP —
      // fine for this site's traffic, but the reason a failure here isn't fatal.
      const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/blog`);
      if (!res.ok) throw new Error('list-failed');
      files = await res.json();
    } catch {
      status.textContent = 'Opslagene kunne ikke hentes lige nu. Prøv igen senere.';
      return;
    }

    const postFiles = files
      .filter((file) => file.type === 'file' && file.name.endsWith('.html') && !EXCLUDED.has(file.name))
      .sort((a, b) => b.name.localeCompare(a.name));

    if (postFiles.length === 0) {
      status.textContent = 'Der er endnu ikke skrevet nogen opslag.';
      return;
    }

    const posts = await Promise.all(postFiles.map(async (file) => {
      try {
        const raw = await fetch(file.download_url).then((r) => r.text());
        const doc = new DOMParser().parseFromString(raw, 'text/html');
        return {
          href: file.name,
          title: doc.querySelector('h1')?.textContent.trim() || file.name,
          date: doc.querySelector('.intro-lead')?.textContent.trim() || '',
          excerpt: doc.querySelector('.excerpt')?.textContent.trim() || '',
        };
      } catch {
        return null;
      }
    }));

    const validPosts = posts.filter(Boolean);
    if (validPosts.length === 0) {
      status.textContent = 'Opslagene kunne ikke hentes lige nu. Prøv igen senere.';
      return;
    }

    status.remove();

    validPosts.forEach(({ href, title, date, excerpt }) => {
      const article = document.createElement('article');
      article.className = 'post-card';

      const heading = document.createElement('h2');
      const link = document.createElement('a');
      link.href = href;
      link.textContent = title;
      heading.appendChild(link);
      article.appendChild(heading);

      if (date) {
        const dateEl = document.createElement('p');
        dateEl.className = 'post-date';
        dateEl.textContent = date;
        article.appendChild(dateEl);
      }

      if (excerpt) {
        const excerptEl = document.createElement('p');
        excerptEl.textContent = excerpt;
        article.appendChild(excerptEl);
      }

      list.appendChild(article);
    });
  }

  loadPosts();
});
