// Current joke object
let currentJoke = null;
let jokeHistory = [];

// API endpoints
const API_ENDPOINTS = {
    random: 'https://v2.jokeapi.dev/joke/Any',
    general: 'https://v2.jokeapi.dev/joke/Miscellaneous',
    programming: 'https://v2.jokeapi.dev/joke/Programming',
    knockKnock: 'https://v2.jokeapi.dev/joke/Knock-Knock',
    dad: 'https://v2.jokeapi.dev/joke/Dad'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    generateJoke();
    loadHistoryFromStorage();
});

// Generate random joke
async function generateJoke() {
    await fetchJoke(API_ENDPOINTS.random);
}

// Generate joke by category
async function generateJokeByCategory(category) {
    const categoryMap = {
        'general': API_ENDPOINTS.general,
        'programming': API_ENDPOINTS.programming,
        'knock-knock': API_ENDPOINTS.knockKnock,
        'dad': API_ENDPOINTS.dad
    };
    
    await fetchJoke(categoryMap[category]);
}

// Fetch joke from API
async function fetchJoke(url) {
    const jokeText = document.getElementById('jokeText');
    const jokeType = document.getElementById('jokeType');
    const loading = document.getElementById('loading');
    const jokeContainer = document.querySelector('.joke-container');
    const generateBtn = document.getElementById('generateBtn');
    
    // Show loading state
    loading.style.display = 'flex';
    jokeContainer.style.display = 'none';
    generateBtn.disabled = true;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch joke');
        }
        
        const data = await response.json();
        
        // Handle the joke response
        if (data.type === 'single') {
            currentJoke = {
                text: data.joke,
                type: data.category,
                fullText: data.joke
            };
        } else if (data.type === 'twopart') {
            currentJoke = {
                text: `${data.setup}\n\n${data.delivery}`,
                type: data.category,
                fullText: `${data.setup}\n${data.delivery}`
            };
        }
        
        // Update UI
        jokeText.textContent = currentJoke.text;
        jokeType.textContent = `${formatCategory(data.category)}`;
        
        // Add to history
        addToHistory(currentJoke.fullText);
        
        // Hide loading
        loading.style.display = 'none';
        jokeContainer.style.display = 'flex';
        
        // Add animation
        jokeContainer.style.animation = 'none';
        setTimeout(() => {
            jokeContainer.style.animation = 'fadeInText 0.5s ease-out';
        }, 10);
        
    } catch (error) {
        console.error('Error fetching joke:', error);
        jokeText.textContent = 'Oops! Could not fetch a joke. Please try again.';
        jokeType.textContent = 'ERROR';
        loading.style.display = 'none';
        jokeContainer.style.display = 'flex';
        showToast('Failed to fetch joke. Please try again!', 'error');
    } finally {
        generateBtn.disabled = false;
    }
}

// Format category name
function formatCategory(category) {
    const categoryNames = {
        'Miscellaneous': '😄 General',
        'Programming': '💻 Programming',
        'Knock-Knock': '🚪 Knock Knock',
        'Dad': '👨 Dad Jokes',
        'Any': '🎲 Random'
    };
    
    return categoryNames[category] || category;
}

// Copy joke to clipboard
function copyJoke() {
    if (!currentJoke) {
        showToast('No joke to copy!', 'error');
        return;
    }
    
    navigator.clipboard.writeText(currentJoke.fullText).then(() => {
        showToast('Joke copied to clipboard! 📋', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy joke', 'error');
    });
}

// Share joke (Web Share API)
function shareJoke() {
    if (!currentJoke) {
        showToast('No joke to share!', 'error');
        return;
    }
    
    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: 'Random Joke Generator',
            text: currentJoke.fullText,
            url: window.location.href
        }).catch(err => {
            if (err.name !== 'AbortError') {
                console.error('Error sharing:', err);
            }
        });
    } else {
        // Fallback: copy to clipboard and show message
        navigator.clipboard.writeText(currentJoke.fullText);
        showToast('Share link copied! You can paste it anywhere. 🔗', 'success');
    }
}

// Add joke to history
function addToHistory(jokeText) {
    // Add to beginning of array
    jokeHistory.unshift(jokeText);
    
    // Keep only last 10 jokes
    if (jokeHistory.length > 10) {
        jokeHistory.pop();
    }
    
    // Save to localStorage
    saveHistoryToStorage();
    
    // Update display
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    
    if (jokeHistory.length === 0) {
        historyList.innerHTML = '<p class="empty-message">No jokes yet. Generate your first joke!</p>';
        return;
    }
    
    historyList.innerHTML = jokeHistory.map((joke, index) => `
        <div class="history-item">
            <strong>#${jokeHistory.length - index}</strong>
            <p>${truncateText(joke, 100)}</p>
        </div>
    `).join('');
}

// Truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Clear history
function clearHistory() {
    if (jokeHistory.length === 0) {
        showToast('History is already empty!', 'warning');
        return;
    }
    
    if (confirm('Are you sure you want to clear all history?')) {
        jokeHistory = [];
        saveHistoryToStorage();
        updateHistoryDisplay();
        showToast('History cleared! 🗑️', 'success');
    }
}

// Save history to localStorage
function saveHistoryToStorage() {
    try {
        localStorage.setItem('jokeHistory', JSON.stringify(jokeHistory));
    } catch (err) {
        console.error('Failed to save history:', err);
    }
}

// Load history from localStorage
function loadHistoryFromStorage() {
    try {
        const saved = localStorage.getItem('jokeHistory');
        if (saved) {
            jokeHistory = JSON.parse(saved);
            updateHistoryDisplay();
        }
    } catch (err) {
        console.error('Failed to load history:', err);
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Space bar to generate new joke
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        generateJoke();
    }
    
    // Ctrl+C or Cmd+C to copy (in addition to the button)
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && currentJoke) {
        if (window.getSelection().toString() === '') {
            e.preventDefault();
            copyJoke();
        }
    }
});
