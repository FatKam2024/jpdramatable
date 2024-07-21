document.addEventListener('DOMContentLoaded', function() {
    const scheduleData = {
        day1: [
            { time: '01:20', show: '異世界悠閒紀行', link: 'https://example.com/show1' },
            { time: '21:30', show: '深夜 Punch', link: 'https://example.com/show2' }
        ],
        day2: [
            { time: '01:00', show: 'SHY 觀映英雄', link: 'https://example.com/show3' },
            { time: '21:30', show: '啃啃島消失的蘿甜歌姬', link: 'https://example.com/show4' },
            { time: '22:45', show: '曾經 · 魔法少女和邪惡相互為敵', link: 'https://example.com/show5' }
        ],
        day3: [
            { time: '21:30', show: '這是妳與我的最終戰場', link: 'https://example.com/show6' },
            { time: '22:00', show: '魔王最強的魔術師是人類', link: 'https://example.com/show7' },
            { time: '23:00', show: '【我推的孩子】', link: 'https://example.com/show8' }
        ],
        day4: [
            { time: '15:01', show: '異世界自殺突擊隊', link: 'https://example.com/show9' },
            { time: '23:00', show: '賣昏光影', link: 'https://example.com/show10' }
        ],
        day5: [
            { time: '00:00', show: 'DDDD 惡魔的破壞', link: 'https://example.com/show11' },
            { time: '00:30', show: '舞魔技能 | 成為最強', link: 'https://example.com/show12' },
            { time: '01:00', show: '拉麵赤貓', link: 'https://example.com/show13' }
        ],
        day6: [
            { time: '00:00', show: '尼爾：自動人形 Ver1.1a', link: 'https://example.com/show14' },
            { time: '01:30', show: '地下城中的人', link: 'https://example.com/show15' },
            { time: '01:53', show: '這個世界漏洞百出', link: 'https://example.com/show16' }
        ],
        day7: [
            { time: '00:00', show: '探長逃跑的殿下', link: 'https://example.com/show17' },
            { time: '01:00', show: '敗北女角太多了！', link: 'https://example.com/show18' },
            { time: '02:00', show: '小市民系列', link: 'https://example.com/show19' }
        ],
    };

    const daysOfWeek = ['day7', 'day1', 'day2', 'day3', 'day4', 'day5', 'day6'];
    const today = new Date().getDay(); // Get the current day (0-6, where 0 is Sunday)
    const todayId = daysOfWeek[today];

    for (const day in scheduleData) {
        const dayColumn = document.getElementById(day);
        if (dayColumn) {
            if (day === todayId) {
                dayColumn.querySelector('h2').classList.add('highlight-today');
            }
            dayColumn.innerHTML = `<h2>${dayColumn.querySelector('h2').innerText}</h2>`;
            scheduleData[day].forEach(slot => {
                const slotDiv = document.createElement('div');
                slotDiv.classList.add('time-slot');
                slotDiv.innerHTML = `<a href="${slot.link}" target="_blank">${slot.time}<br>${slot.show}</a>`;
                dayColumn.appendChild(slotDiv);
            });
        }
    }
});
