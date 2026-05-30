document.addEventListener('DOMContentLoaded', () => {
    // talksData is assumed to be globally available from the injected script
    const talks = window.talksData;

    const scheduleContainer = document.getElementById('schedule-container');
    const categorySearchInput = document.getElementById('category-search');
    const talkDetailsOverlay = document.getElementById('talk-details-overlay');
    const detailTitle = document.getElementById('detail-title');
    const detailSpeakers = document.getElementById('detail-speakers');
    const detailCategories = document.getElementById('detail-categories');
    const detailDescription = document.getElementById('detail-description');
    const closeDetailsButton = document.getElementById('close-details');

    const eventStartTime = new Date();
    eventStartTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

    const transitionTime = 10; // 10 minutes between talks
    const lunchBreakDuration = 60; // 1 hour lunch break

    let currentTalks = talks;

    function renderSchedule(filteredTalks = talks) {
        scheduleContainer.innerHTML = ''; // Clear existing schedule

        let currentTime = new Date(eventStartTime);
        let talkIndex = 0;

        for (let i = 0; i < 6; i++) { // There are 6 talks
            const talk = filteredTalks[talkIndex];

            // Render Talk
            if (talk) {
                const talkEndTime = new Date(currentTime.getTime() + talk.duration * 60 * 1000);
                const talkElement = document.createElement('div');
                talkElement.classList.add('schedule-item');
                talkElement.dataset.talkId = talk.id;
                talkElement.innerHTML = `
                    <div class="time-slot">${formatTime(currentTime)} - ${formatTime(talkEndTime)}</div>
                    <div class="talk-info">
                        <h3>${talk.title}</h3>
                        <p><strong>Speakers:</strong> ${talk.speakers.join(', ')}</p>
                        <p class="categories">
                            ${talk.categories.map(cat => `<span>${cat}</span>`).join('')}
                        </p>
                    </div>
                `;
                scheduleContainer.appendChild(talkElement);
                talkElement.addEventListener('click', () => showTalkDetails(talk));

                currentTime = new Date(talkEndTime.getTime() + transitionTime * 60 * 1000);
                talkIndex++;
            }

            // Insert Lunch Break after the 3rd talk
            if (i === 2) {
                const lunchEndTime = new Date(currentTime.getTime() + lunchBreakDuration * 60 * 1000);
                const lunchElement = document.createElement('div');
                lunchElement.classList.add('schedule-item', 'break');
                lunchElement.innerHTML = `
                    <div class="time-slot">${formatTime(currentTime)} - ${formatTime(lunchEndTime)}</div>
                    <div class="talk-info">
                        <h3>Lunch Break</h3>
                        <p>Enjoy your meal!</p>
                    </div>
                `;
                scheduleContainer.appendChild(lunchElement);
                currentTime = new Date(lunchEndTime.getTime() + transitionTime * 60 * 1000);
            }
        }
    }

    function formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function showTalkDetails(talk) {
        detailTitle.textContent = talk.title;
        detailSpeakers.textContent = `Speakers: ${talk.speakers.join(', ')}`;
        detailCategories.innerHTML = `Categories: ${talk.categories.map(cat => `<span>${cat}</span>`).join('')}`;
        detailDescription.textContent = talk.description;
        talkDetailsOverlay.style.display = 'flex';
    }

    function hideTalkDetails() {
        talkDetailsOverlay.style.display = 'none';
    }

    categorySearchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredTalks = talks.filter(talk =>
            talk.categories.some(category => category.toLowerCase().includes(searchTerm))
        );
        renderSchedule(filteredTalks);
    });

    closeDetailsButton.addEventListener('click', hideTalkDetails);
    talkDetailsOverlay.addEventListener('click', (event) => {
        if (event.target === talkDetailsOverlay) {
            hideTalkDetails();
        }
    });

    // Initial render
    renderSchedule();
});
