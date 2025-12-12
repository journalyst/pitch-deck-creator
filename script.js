let editingState = {};

document.getElementById('investor-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('investor-name').value;
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    
    loading.style.display = 'block';
    results.style.display = 'none';
    
    try {
        const response = await fetch('http://3.148.192.139:5678/webhook/pitch-creator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        const item = data[0];
        
        document.getElementById('email-subject').innerHTML = '<strong>Subject:</strong> ' + (item.email_subject || '');
        document.getElementById('email-body').textContent = item.email_body || '';
        document.getElementById('linkedin-message').textContent = item.linkedin_message || '';
        document.getElementById('twitter-message').textContent = item.twitter_message || '';
        document.getElementById('instagram-message').textContent = item.instagram_message || '';
        
        // Assuming handles are added to the response
        document.getElementById('email-handle').textContent = item['email-handle'] ? 'Email: ' + item['email-handle'] : 'Email handle not found';
        document.getElementById('linkedin-handle').textContent = item['linkedin-handle'] ? 'LinkedIn: ' + item['linkedin-handle'] : 'LinkedIn handle not found';
        document.getElementById('twitter-handle').textContent = item['twitter-handle'] ? 'Twitter: ' + item['twitter-handle'] : 'Twitter handle not found';
        document.getElementById('instagram-handle').textContent = item['instagram-handle'] ? 'Instagram: ' + item['instagram-handle'] : 'Instagram handle not found';
        
        results.style.display = 'block';
    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        loading.style.display = 'none';
    }
});

function toggleEdit(platform) {
    let content;
    const card = document.querySelector(`.${platform}`);
    const editBtn = card.querySelector('.btn-edit');
    
    if (platform === 'email') {
        content = [document.getElementById('email-subject'), document.getElementById('email-body')];
    } else {
        content = [document.getElementById(platform + '-message')];
    }
    
    if (editingState[platform]) {
        content.forEach(el => el.contentEditable = 'false');
        editBtn.textContent = 'Edit';
        card.classList.remove('editing');
        editingState[platform] = false;
    } else {
        content.forEach(el => el.contentEditable = 'true');
        content[0].focus();
        editBtn.textContent = 'Save';
        card.classList.add('editing');
        editingState[platform] = true;
    }
}

function copyContent(platform) {
    let content = '';
    if (platform === 'email') {
        const subject = document.getElementById('email-subject').textContent.replace('Subject: ', '');
        const body = document.getElementById('email-body').textContent;
        content = subject + '\n\n' + body;
    } else {
        content = document.getElementById(platform + '-message').textContent;
    }
    
    navigator.clipboard.writeText(content).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy to clipboard');
    });
}