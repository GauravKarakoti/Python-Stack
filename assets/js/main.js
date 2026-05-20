import curriculumData from '../../data/curriculum.json' with { type: 'json' };

const listElement = document.getElementById('curriculum-list');
const mainContent = document.querySelector('.content-inner');
const sidebarWrapper = document.getElementById('sidebar-wrapper');
const hamburgerBtn = document.getElementById('hamburger-btn');

// Toggle Sidebar Logic
hamburgerBtn.addEventListener('click', () => {
    sidebarWrapper.classList.toggle('collapsed');
});

// Render the sidebar items
curriculumData.forEach(module => {
    // Create Section Header
    const sectionLi = document.createElement('li');
    sectionLi.className = 'section-title';
    sectionLi.textContent = module.section;
    listElement.appendChild(sectionLi);

    // Create Topic Items
    module.topics.forEach(topic => {
        const li = document.createElement('li');
        li.className = 'topic-item';
        li.textContent = topic.title;
        li.dataset.id = topic.id;

        li.addEventListener('click', () => {
            // Remove active class from all items
            document.querySelectorAll('.topic-item').forEach(el => el.classList.remove('active'));
            // Add active class to clicked item
            li.classList.add('active');

            // On mobile/smaller screens, auto-collapse sidebar after selection
            if (window.innerWidth < 768) {
                sidebarWrapper.classList.add('collapsed');
            }

            // Update main content
            mainContent.innerHTML = `
                <h2>${topic.title}</h2>
                <p>${topic.description}</p>
            `;
        });

        listElement.appendChild(li);
    });
});