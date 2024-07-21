document.addEventListener('DOMContentLoaded', function() {
    Papa.parse('schedule.csv', {
        download: true,
        header: true,
        complete: function(results) {
            console.log("CSV Data:", results.data);  // Debug: Log parsed data
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
                console.log("Processing row:", row);  // Debug: Log each row
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
                    console.log("Updating day column:", day);  // Debug: Log day column update
                    dayColumn.innerHTML += scheduleData[day].map(slot => {
                        if (slot.link) {
                            return `<div class="time-slot">
                                        <a href="${slot.link}" target="_blank">${slot.time} ${slot.channel}<br>${slot.show}</a>
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
