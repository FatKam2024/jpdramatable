document.addEventListener('DOMContentLoaded', function() {
    // Show loading overlay
    document.getElementById('loadingOverlay').style.display = 'flex';

    // Check if page needs to reload
    if (!sessionStorage.getItem('reloaded')) {
        sessionStorage.setItem('reloaded', 'true');
        setTimeout(() => {
            location.reload();
        }, 1000); // Adjust the delay if needed
    } else {
        // Hide the loading overlay after a short delay
        setTimeout(() => {
            document.getElementById('loadingOverlay').style.display = 'none';
        }, 500);
    }
});


document.getElementById('refreshButton').addEventListener('click', function() {
    location.reload();
});

document.addEventListener('DOMContentLoaded', function() {
    // Define the getImageSrc function to check and load the correct image with extension
    function getImageSrc(imageName) {
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
        for (let ext of imageExtensions) {
            let imgSrc = `image/${imageName}${ext}`;
            let img = new Image();
            img.src = imgSrc;
            if (img.complete) {
                return imgSrc; // Return the correct image source if it exists
            }
        }
        return ''; // Return empty if no image found
    }

    // Show loading overlay
    document.getElementById('loadingOverlay').style.display = 'flex';

    // Check if page needs to reload
    if (!sessionStorage.getItem('reloaded')) {
        sessionStorage.setItem('reloaded', 'true');
        setTimeout(() => {
            location.reload();
        }, 1000); // Adjust the delay if needed
    } else {
        // Hide the loading overlay after a short delay
        setTimeout(() => {
            document.getElementById('loadingOverlay').style.display = 'none';
        }, 500);
    }

    document.getElementById('refreshButton').addEventListener('click', function() {
        location.reload();
    });

    // Create the modal for showing the image and description
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <img id="modal-image" class="modal-image" src="" alt="Image">
            <p id="modal-description" class="modal-description"></p>
        </div>
    `;
    document.body.appendChild(modal);

    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const closeButton = document.querySelector('.close-button');

    // Function to show the modal
    function showModal(imageSrc, description, programName, igLink, tvLink, liveLink) {
        let igHTML = igLink ? `<a href="${igLink}" target="_blank"><img src="Instagram-app-logo.png" alt="IG" class="ig-icon-modal"></a>` : '';
        let tvHTML = tvLink ? `<a href="${tvLink}" target="_blank"><img src="tv.png" alt="TV Icon" class="tv-icon-modal"></a>` : '';
        let liveHTML = liveLink ? `<a href="${liveLink}" target="_blank"><img src="live.png" alt="Live Icon" class="live-icon-modal"></a>` : '';

        modalImage.src = imageSrc;
        modalDescription.innerHTML = `
            <div class="modal-header">
                <div class="modal-icons">
                    ${igHTML}
                    ${tvHTML}
                    ${liveHTML}
                </div>
                <div class="program-name">${programName}</div>
            </div>
            <div class="modal-description-text">${description}</div>
        `;
        modal.style.display = 'block';
    }

    function hideModal() {
        modal.style.display = 'none';
    }

    closeButton.addEventListener('click', hideModal);

    // Event listener to close the modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            hideModal();
        }
    });

    // Highlight the current day column
    const today = new Date().getDay();
    const dayMap = {
        0: 'day7', // Sunday
        1: 'day1', // Monday
        2: 'day2', // Tuesday
        3: 'day3', // Wednesday
        4: 'day4', // Thursday
        5: 'day5', // Friday
        6: 'day6'  // Saturday
    };
    const currentDayColumn = document.getElementById(dayMap[today]);
    if (currentDayColumn) {
        currentDayColumn.classList.add('current-day');
    }

    // Supported image extensions
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

    // Function to check and load the correct image with extension
    function getImageSrc(imageName) {
        for (let ext of imageExtensions) {
            let imgSrc = `image/${imageName}${ext}`;
            let img = new Image();
            img.src = imgSrc;
            if (img.complete) {
                return imgSrc; // Return the correct image source if it exists
            }
        }
        return ''; // Return empty if no image found
    }

    Papa.parse('schedule.csv', {
        download: true,
        header: true,
        complete: function(results) {
            const scheduleData = {
                day1: [], day2: [], day3: [], day4: [], day5: [], day6: [], day7: []
            };

            results.data.forEach(row => {
                const day = row.Weekday;
                if (day && row.Time && row.Channel && row.ProgramName) {
                    scheduleData[day].push({
                        time: row.Time,
                        channel: row.Channel,
                        show: row.ProgramName,
                        image: row.Image || '',
                        link: row.Link || '',
                        igLink: row.IG || '',
                        description: row.Desc || '',
                        tvLink: row.TV || ''
                    });
                }
            });

            for (const day in scheduleData) {
                const dayColumn = document.getElementById(day);
                if (dayColumn) {
                    dayColumn.innerHTML += scheduleData[day].map(slot => {
                        let imageSrc = slot.image ? getImageSrc(slot.image) : '';
                        let imageHTML = imageSrc ? `<button class="image-button" data-image="${imageSrc}" data-desc="${slot.description}">
                                                        <img src="${imageSrc}" alt="Image" class="slot-image">
                                                    </button>` : '';

                        let igHTML = slot.igLink ? `<a href="${slot.igLink}" target="_blank"><img src="Instagram-app-logo.png" alt="IG" class="ig-icon"></a>` : '';
                        let tvHTML = slot.tvLink ? `<a href="${slot.tvLink}" target="_blank"><img src="tv.png" alt="TV Icon" class="tv-icon"></a>` : '';
                        //let liveHTML = slot.link ? `<a href="${slot.link}" target="_blank"><img src="live.png" alt="Live Icon" class="live-icon"></a>` : '';

                        // Keep the purple transparent button logic as before
                        let transparentButtonHTML = slot.link ? `<button class="transparent-button" data-link="${slot.link}"></button>` : '';

                        return `<div class="time-slot" data-link="${slot.link}">
                                    ${imageHTML}
                                    ${igHTML}
                                    ${tvHTML}
                                    ${slot.time} ${slot.channel}<br>${slot.show}
                                    ${transparentButtonHTML}
                                </div>`;
                    }).join('');

                    // Event listeners for image buttons
                    dayColumn.querySelectorAll('.image-button').forEach(button => {
                        const imageSrc = button.getAttribute('data-image');
                        const description = button.getAttribute('data-desc');
                        const programName = button.closest('.time-slot').querySelector('br').nextSibling.textContent.trim();
                        const igLink = button.closest('.time-slot').querySelector('.ig-icon') ? button.closest('.time-slot').querySelector('.ig-icon').parentElement.href : '';
                        const tvLink = button.closest('.time-slot').querySelector('.tv-icon') ? button.closest('.time-slot').querySelector('.tv-icon').parentElement.href : '';
                        const liveLink = button.closest('.time-slot').dataset.link;

                        button.addEventListener('click', function(e) {
                            e.stopPropagation(); 
                            e.preventDefault(); 
                            showModal(imageSrc, description, programName, igLink, tvLink, liveLink);
                        });
                    });

                    // Event listeners for the transparent button
                    dayColumn.querySelectorAll('.transparent-button').forEach(button => {
                        const link = button.getAttribute('data-link');
                        if (link) {
                            button.addEventListener('click', function(e) {
                                e.stopPropagation();
                                window.open(link, '_blank');
                            });
                        }
                    });
                }
            }
        }
    });
});
