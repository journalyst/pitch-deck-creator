document.getElementById('investor-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('investor-name').value;
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');

    loading.style.display = 'block';
    results.style.display = 'none';

    try {
        const response = await fetch('https://cryptic-mask.ignorelist.com/webhook/pitch-creator', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const item = data[0];

        renderSummary(item);
        renderFindings(item.top_findings || []);

        results.style.display = 'block';
    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        loading.style.display = 'none';
    }
});

function renderSummary(item) {
    document.getElementById('investor-name-display').textContent = item.investor || 'Unknown investor';
    document.getElementById('email-handle').textContent = item['email-handle'] ? 'Email: ' + item['email-handle'] : 'Email handle not found';
    document.getElementById('linkedin-handle').textContent = item['linkedin-handle'] ? 'LinkedIn: ' + item['linkedin-handle'] : 'LinkedIn handle not found';
    document.getElementById('twitter-handle').textContent = item['twitter-handle'] ? 'Twitter: ' + item['twitter-handle'] : 'Twitter handle not found';
    document.getElementById('instagram-handle').textContent = item['instagram-handle'] ? 'Instagram: ' + item['instagram-handle'] : 'Instagram handle not found';
}

function renderFindings(findings) {
    const list = document.getElementById('findings-list');
    list.innerHTML = '';
    document.getElementById('findings-count').textContent = `${findings.length} items`;

    findings
        .sort((a, b) => (a.rank || 999) - (b.rank || 999))
        .forEach(f => {
            const card = document.createElement('div');
            card.className = 'finding-card';

            const top = document.createElement('div');
            top.className = 'finding-top';
            top.innerHTML = `<span class="rank">#${f.rank ?? '–'}</span><span class="type-badge">${f.type ? f.type.replace(/_/g, ' ') : 'finding'}</span>`;
            card.appendChild(top);

            const summary = document.createElement('p');
            summary.className = 'summary';
            summary.textContent = f.summary || 'No summary available.';
            card.appendChild(summary);

            if (f.date) {
                const date = document.createElement('p');
                date.className = 'meta';
                date.textContent = `Date: ${f.date}`;
                card.appendChild(date);
            }

            if (f.quote) {
                const quote = document.createElement('div');
                quote.className = 'quote';
                quote.textContent = f.quote;
                card.appendChild(quote);
            }

            if (f.source) {
                const source = document.createElement('a');
                source.className = 'source-link';
                source.href = f.source;
                source.target = '_blank';
                source.rel = 'noopener noreferrer';
                source.textContent = 'Source';
                card.appendChild(source);
            }

            list.appendChild(card);
        });
}