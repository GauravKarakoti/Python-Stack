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
    // 1. Grab the scrollable container
    const scrollContainer = document.getElementById('main-content');
    
    // 2. Instantly reset the scrollbar to the very top
    if (scrollContainer) {
        scrollContainer.scrollTop = 0;
    }

    mainContent.innerHTML = `<p style="color: #666;">Loading ${topicTitle}...</p>`;

    try {
        const response = await fetch(`./pages/${topicId}.html`);
        
        if (!response.ok) {
            throw new Error(`Could not load ./pages/${topicId}.html (Status: ${response.status})`);
        }
        
        const htmlData = await response.text();
        
        // 3. Add lazy loading AND block focus-stealing using tabindex
        const optimizedHtml = htmlData.replace(/<iframe /g, '<iframe loading="lazy" tabindex="-1" ');
        
        mainContent.innerHTML = optimizedHtml;     
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