document.addEventListener('DOMContentLoaded', function() {
    const popUp = document.createElement('div');
    popUp.classList.add('pop-up');
    document.body.appendChild(popUp);

    // Function to show pop-up with description only
    function showPopUp(e, description) {
        popUp.innerHTML = `<p>${description}</p>`;
        popUp.style.display = 'block';
        popUp.style.top = e.pageY + 10 + 'px';
        popUp.style.left = e.pageX + 10 + 'px';
    }

    // Function to hide pop-up
    function hidePopUp() {
        popUp.style.display = 'none';
    }

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
                        link: row.Link,
                        igLink: row.IG || '', // Handle missing IG links
                        description: row.Desc || '' // Handle missing descriptions
                    });
                }
            });

            for (const day in scheduleData) {
                const dayColumn = document.getElementById(day);
                if (dayColumn) {
                    dayColumn.innerHTML += scheduleData[day].map(slot => {
                        let iconHTML = slot.igLink ? `<img src="instagram-icon.png" alt="IG" class="ig-icon">` : '';
                        return `<div class="time-slot" data-desc="${slot.description}">
                                    ${iconHTML}
                                    ${slot.time} ${slot.channel}<br>${slot.show}
                                </div>`;
                    }).join('');

                    // Add hover events to show and hide the pop-up
                    dayColumn.querySelectorAll('.time-slot').forEach(slot => {
                        const description = slot.getAttribute('data-desc');
                        if (description) {
                            slot.addEventListener('mouseenter', function(e) {
                                showPopUp(e, description);
                            });
                            slot.addEventListener('mouseleave', hidePopUp);
                        }
                    });
                }
            }
        }
    });
});
