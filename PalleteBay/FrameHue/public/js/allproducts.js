function searchPaintings() {
    const searchInput = document.querySelector('.search-container input').value.toLowerCase();
    const paintings = document.querySelectorAll('.card');
    let foundPainting = null;

    if (searchInput.trim() === '') return;

    paintings.forEach(painting => {
        const title = painting.querySelector('h3').textContent.toLowerCase();
        const price = painting.querySelector('p').textContent.toLowerCase();
        const words = searchInput.split(' ');
        
        // Check if any word in the search input matches part of the title or price
        const isMatch = words.some(word => {
            if (word.trim() === '') return false;
            return title.includes(word) || price.includes(word);
        });
        
        if (isMatch) {
            foundPainting = painting;
            painting.classList.remove('highlight-animation');
            // Trigger reflow to restart animation
            void painting.offsetWidth;
            painting.classList.add('highlight-animation');
            
            // Smooth scroll to the painting
            painting.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    if (!foundPainting) {
        alert('No matching paintings found!');
    }
}

document.querySelector('.search-btn').addEventListener('click', searchPaintings);
document.querySelector('.search-container input').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchPaintings();
    }
});
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/user');
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const user = await response.json();

        if (user && user.id) {
            // User is logged in
            document.getElementById("loginBtn").style.display = "none";
            document.getElementById("logoutBtn").style.display = "inline-block";
            
            // Optional: Display user name if available
            if (user.displayName) {
                const nav = document.querySelector('nav');
                const userSpan = document.createElement('span');
                userSpan.textContent = `Welcome, ${user.displayName}`;
                userSpan.style.marginLeft = '20px';
                userSpan.style.color = '#fff';
                nav.appendChild(userSpan);
            }
        } else {
            // Not logged in
            document.getElementById("loginBtn").style.display = "inline-block";
            document.getElementById("logoutBtn").style.display = "none";
        }
    } catch (err) {
        console.error('Error checking login state:', err);
        // Show login button on error
        document.getElementById("loginBtn").style.display = "inline-block";
        document.getElementById("logoutBtn").style.display = "none";
    }
});

// Logout button handler with improved error handling
document.getElementById("logoutBtn").addEventListener("click", async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('/logout');
        if (response.ok) {
            window.location.href = '/'; // Redirect to home page after logout
        } else {
            throw new Error('Logout failed');
        }
    } catch (err) {
        console.error('Error during logout:', err);
        alert('Logout failed. Please try again.');
    }
});
function searchPaintings() {
    const searchInput = document.querySelector('.search-container input').value.toLowerCase();
    const paintings = document.querySelectorAll('.card');
    let foundPainting = null;

    if (searchInput.trim() === '') return;

    paintings.forEach(painting => {
        const title = painting.querySelector('h3').textContent.toLowerCase();
        const price = painting.querySelector('p').textContent.toLowerCase();
        const words = searchInput.split(' ');
        
        // Check if any word in the search input matches part of the title or price
        const isMatch = words.some(word => {
            if (word.trim() === '') return false;
            return title.includes(word) || price.includes(word);
        });
        
        if (isMatch) {
            foundPainting = painting;
            painting.classList.remove('highlight-animation');
            // Trigger reflow to restart animation
            void painting.offsetWidth;
            painting.classList.add('highlight-animation');
            
            // Smooth scroll to the painting
            painting.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    if (!foundPainting) {
        alert('No matching paintings found!');
    }
}

document.querySelector('.search-btn').addEventListener('click', searchPaintings);
document.querySelector('.search-container input').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchPaintings();
    }
});