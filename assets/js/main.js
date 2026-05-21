const mainContent = document.querySelector('.content-inner');
const sidebarWrapper = document.getElementById('sidebar-wrapper');
const hamburgerBtn = document.getElementById('hamburger-btn');
const topicItems = document.querySelectorAll('.topic-item');

call("basics/introduction", "Introduction to Python");

// Toggle Sidebar Logic
hamburgerBtn.addEventListener('click', () => {
    sidebarWrapper.classList.toggle('collapsed');
});

async function call(topicId, topicTitle) {
    const scrollContainer = document.getElementById('main-content');
    
    mainContent.innerHTML = `<p style="color: #666;">Loading ${topicTitle}...</p>`;

    try {
        const response = await fetch(`./pages/${topicId}.html`);
        
        if (!response.ok) {
            throw new Error(`Could not load ./pages/${topicId}.html (Status: ${response.status})`);
        }
        
        const htmlData = await response.text();
        
        // 1. Temporarily replace 'src' with 'data-src' so iframes don't load immediately
        const optimizedHtml = htmlData
            .replace(/<iframe /g, '<iframe tabindex="-1" ')
            .replace(/ src="/g, ' data-src="');
        
        mainContent.innerHTML = optimizedHtml;     

        // 2. Reset the scrollbar AFTER the new content is injected into the DOM
        if (scrollContainer) {
            scrollContainer.scrollTop = 0;
        }

        // 3. Use an IntersectionObserver to strictly load iframes only when scrolled into view
        const iframes = mainContent.querySelectorAll('iframe[data-src]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    // Assign the actual URL to trigger the iframe load
                    iframe.src = iframe.getAttribute('data-src');
                    iframe.removeAttribute('data-src');
                    // Stop observing once loaded so it doesn't reload
                    observer.unobserve(iframe); 
                }
            });
        }, { 
            root: scrollContainer,
            rootMargin: '50px' // Load when the iframe is 50px away from the viewport
        });

        iframes.forEach(iframe => observer.observe(iframe));

    } catch (error) {
        console.error("Error fetching the page:", error);
        mainContent.innerHTML = `
            <h2>${topicTitle}</h2>
            <p style="color: #e53e3e; font-weight: bold;">Error: ${error.message}</p>
        `;
    }
}

// Attach click listeners to the hardcoded sidebar items
topicItems.forEach(li => {
    li.addEventListener('click', async () => {
        // Remove active class from all items
        topicItems.forEach(el => el.classList.remove('active'));
        // Add active class to clicked item
        li.classList.add('active');

        // On mobile/smaller screens, auto-collapse sidebar after selection
        if (window.innerWidth < 768) {
            sidebarWrapper.classList.add('collapsed');
        }

        const topicId = li.dataset.id;
        const topicTitle = li.textContent;
        call(topicId, topicTitle);
    });
});