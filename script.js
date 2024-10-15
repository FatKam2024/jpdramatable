document.addEventListener('DOMContentLoaded', function() {
    // Highlight the current day column
    const today = new Date().getDay(); // Sunday - Saturday : 0 - 6
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
                day1: [],
                day2: [],
                day3: [],
                day4: [],
                day5: [],
                day6: [],
                day7: []
            };
            
            results.data.forEach(row => {
                const day = row.Weekday;
                if (day && row.Time && row.Channel && row.ProgramName) {
                    scheduleData[day].push({
                        time: row.Time,
                        channel: row.Channel,
                        show: row.ProgramName,
                        link: row.Link
                    });
                }
            });
            
            for (const day in scheduleData) {
                const dayColumn = document.getElementById(day);
                if (dayColumn) {
                    dayColumn.innerHTML += scheduleData[day].map(slot => {
                        if (slot.link) {
                            return `<div class="time-slot">
                                        <a href="${slot.link}" target="_blank">${slot.time} ${slot.channel}<br>${slot.show} ★</a>
                                    </div>`;
                        } else {
                            return `<div class="time-slot">
                                        ${slot.time} ${slot.channel}<br>${slot.show}
                                    </div>`;
                        }
                    }).join('');
                }
            }
        }
    });
});
