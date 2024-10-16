document.addEventListener('DOMContentLoaded', function() {
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
    function showModal(imageSrc, description) {
        modalImage.src = imageSrc;
        modalDescription.textContent = description;
        modal.style.display = 'block';
    }

    // Function to hide the modal
    function hideModal() {
        modal.style.display = 'none';
    }

    closeButton.addEventListener('click', hideModal);

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

    Papa.parse('csv/schedule.csv', {
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
                        image: row.Image || '',  // Handle image
                        link: row.Link || '',    // Handle link
                        igLink: row.IG || '',    // Handle IG link
                        description: row.Desc || ''  // Handle description
                    });
                }
            });

            for (const day in scheduleData) {
                const dayColumn = document.getElementById(day);
                if (dayColumn) {
                    dayColumn.innerHTML += scheduleData[day].map(slot => {
                        let imageSrc = slot.image ? getImageSrc(slot.image) : ''; // Call function to get image source
                        let imageHTML = imageSrc ? `<button class="image-button" data-image="${imageSrc}" data-desc="${slot.description}">
                                                          <img src="${imageSrc}" alt="Image" class="slot-image">
                                                      </button>` : '';
                        let igHTML = slot.igLink ? `<a href="${slot.igLink}" target="_blank"><img src="Instagram-app-logo.png" alt="IG" class="ig-icon"></a>` : '';
                        let starHTML = slot.link ? `<span class="star-icon">★</span>` : '';
                        let transparentButtonHTML = slot.link ? `<button class="transparent-button" data-link="${slot.link}"></button>` : '';  // Add transparent button if link exists
                        return `<div class="time-slot" data-link="${slot.link}">
                                    ${imageHTML}
                                    ${igHTML}
                                    ${starHTML}
                                    ${slot.time} ${slot.channel}<br>${slot.show}
                                    ${transparentButtonHTML}
                                </div>`;
                    }).join('');

                    // Add event listeners for the image buttons
                    dayColumn.querySelectorAll('.image-button').forEach(button => {
                        const imageSrc = button.getAttribute('data-image');
                        const description = button.getAttribute('data-desc');

                        button.addEventListener('click', function() {
                            showModal(imageSrc, description);
                        });
                    });

                    // Add event listeners for the transparent button to handle link click
                    dayColumn.querySelectorAll('.transparent-button').forEach(button => {
                        const link = button.getAttribute('data-link');
                        button.addEventListener('click', function() {
                            window.open(link, '_blank');  // Open the link in a new tab
                        });
                    });
                }
            }
        }
    });
});
