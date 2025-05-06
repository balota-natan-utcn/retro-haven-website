var attendance = ['08.03.2025', '15.03.2025', '29.03.2025', '12.04.2025', '5', '6', '7'];

async function loadInitialData() {
    try {
        const usersfile = await fetch('http://localhost:3000/users');
        const users = await usersfile.json();

        const local = await fetch('./local.json');
        const current = await local.json();


        renderFeaturesGrid(scrambleWithLocalFirst(users, current.username));

        return { users, current };
    } catch (error) {
        console.error('Error loading JSON files:', error);
    }
}

loadInitialData();
/*
fetch('./users.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(users => {

    })
    .catch(error => {
        console.error('Error loading JSON:', error);
    });
*/
function renderFeaturesGrid(users, current) {
    const divNumber = users.length;
    const isOdd = divNumber % 2 !== 0;

    const container = document.createElement('div');
    container.classList = 'grid-container';

    for (let i = 0; i < divNumber; i++) {
        const box = document.createElement('div');
        box.className = 'grid-item';
        if (i == 0 && isOdd && !isScreenLessThan768()) { box.className = 'grid-item span-cell' }

        const profileId = users[i].name.toLowerCase().trim().split(/\s+/).join("-") + '-profile';
        const profile = document.createElement('div');
        profile.id = profileId;

        const vueWidget = document.createElement('div');
        vueWidget.id = users[i].name.toLowerCase().trim().split(/\s+/).join("-") + '-widget';
        vueWidget.classList = 'widget';

        box.appendChild(profile);
        loadVueProfileWidget(profile, users[i], profileId)
        box.appendChild(vueWidget);
        container.appendChild(box);
    }
    document.body.appendChild(container);

    sendGridReadyEvent();
}

function isScreenLessThan768() {
    return window.innerWidth < 768;
}

function sendGridReadyEvent() {
    document.dispatchEvent(new Event("gridReadyEvent"));
}

function scrambleWithLocalFirst(arr, localFirst) {
    return arr.sort((a, b) => {
        if (a.username === localFirst) return -1;
        if (b.username === localFirst) return 1;
        return Math.random() - 0.5;
    });
}

function loadVueProfileWidget(container, user, id) {
    fetch('shared/profile.html')
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;
            start(id, user);
        });
}

function start(id, user) {
    new Vue({
        el: '#' + id,
        data: {
            user: user,
            attendance: []

        },
        created() {
            this.attendance = attendance.map(item => user.attendance.includes(item));
        },
        mounted() {
            // console.log(user.attendance);
        },
        methods: {
            login: function () {
            }
        }
    });
}