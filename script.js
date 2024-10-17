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
    function showModal(imageSrc, description, programName, igLink, tvLink) {
        let igHTML = igLink ? `<a href="${igLink}" target="_blank"><img src="Instagram-app-logo.png" alt="IG" class="ig-icon-modal"></a>` : '';
        let tvHTML = tvLink ? `<a href="${tvLink}" target="_blank"><img src="tv.png" alt="TV Icon" class="tv-icon-modal"></a>` : '';

        modalImage.src = imageSrc;
        modalDescription.innerHTML = `
            <div class="modal-header">
                <div class="modal-icons">
                    ${igHTML}
                    ${tvHTML}
                </div>
                <div class="program-name">${programName}</div>
            </div>
            <div class="modal-description-text">${description}</div>
        `;
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
						image: row.Image || '',  // Handle image
						link: row.Link || '',    // Handle link
						igLink: row.IG || '',    // Handle IG link
						description: row.Desc || '',  // Handle description
						tvLink: row.TV || '' // Handle TV link
					});
				}
			});

			for (const day in scheduleData) {
				const dayColumn = document.getElementById(day);
				if (dayColumn) {
					dayColumn.innerHTML += scheduleData[day].map(slot => {
						// **Always reset tvLink and link at the start**
						let tvLink = '';   // Reset tvLink for each slot
						let link = '';     // Reset link for each slot

						// Log slot processing to ensure debugging works
						console.log(`Processing slot for ${slot.show}: link = ${slot.link}, tvLink = ${slot.tvLink}`);

						// **Process the content as usual** 
						let imageSrc = slot.image ? getImageSrc(slot.image) : '';
						let imageHTML = imageSrc ? `<button class="image-button" data-image="${imageSrc}" data-desc="${slot.description}">
														<img src="${imageSrc}" alt="Image" class="slot-image">
													</button>` : '';

						let igHTML = slot.igLink ? `<a href="${slot.igLink}" target="_blank"><img src="Instagram-app-logo.png" alt="IG" class="ig-icon"></a>` : '';     

						// **Ensure that the transparent button is only created if `slot.link` exists**
						let transparentButtonHTML = slot.link ? `<button class="transparent-button" data-link="${slot.link}"></button>` : '';  

						// **Ensure that the TV icon is only created if `slot.tvLink` exists**
						tvLink = slot.tvLink ? `<a href="${slot.tvLink}" target="_blank"><img src="tv.png" alt="TV Icon" class="tv-icon"></a>` : '';

						return `<div class="time-slot" data-link="${slot.link}">
									${imageHTML}
									${igHTML}
									${slot.time} ${slot.channel}<br>${slot.show}
									${transparentButtonHTML}
									${tvLink}  <!-- Only add tvLink if it exists -->
								</div>`;
					}).join('');

					// **Handle image buttons and modal display as normal**
					dayColumn.querySelectorAll('.image-button').forEach(button => {
						const imageSrc = button.getAttribute('data-image');
						const description = button.getAttribute('data-desc');
						const programName = button.closest('.time-slot').querySelector('br').nextSibling.textContent.trim();
						const igLink = button.closest('.time-slot').querySelector('.ig-icon') ? button.closest('.time-slot').querySelector('.ig-icon').parentElement.href : '';
						const tvLink = button.closest('.time-slot').querySelector('.tv-icon') ? button.closest('.time-slot').querySelector('.tv-icon').parentElement.href : '';

						button.addEventListener('click', function(e) {
							e.stopPropagation(); 
							e.preventDefault(); 
							showModal(imageSrc, description, programName, igLink, tvLink);
						});
					});

					// **Ensure that transparent buttons open the link only if it exists**
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
