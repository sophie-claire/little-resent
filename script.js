
// ======================================
// MY LITTLE RESET - JAVASCRIPT
// ======================================

// Get saved information or create a new starting point.

const STORAGE_KEY = "myLittleResetData";

let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    days: {},
    habits: [
        { id: 1, name: "Drink enough water", completed: [] },
        { id: 2, name: "Read my Bible", completed: [] },
        { id: 3, name: "Practice coding", completed: [] },
        { id: 4, name: "Read a book", completed: [] }
    ],
    journals: {}
};

const today = getTodayKey();

// Default daily tasks.

const defaultTasks = [
    {
        category: "🌷 Morning routine",
        tasks: ["Make my bed", "Brush my teeth", "Have breakfast"]
    },
    {
        category: "♡ Bible and prayer",
        tasks: ["Read the Bible", "Spend time in prayer"]
    },
    {
        category: "💻 Coding",
        tasks: ["Study programming", "Practice coding"]
    },
    {
        category: "🎀 Nail practice",
        tasks: ["Practice a nail design", "Take pictures of my work"]
    },
    {
        category: "📖 Reading",
        tasks: ["Read a few pages"]
    },
    {
        category: "📝 Journaling",
        tasks: ["Write in my journal"]
    },
    {
        category: "🏡 Household activities",
        tasks: ["Help with household activities"]
    },
    {
        category: "☁ Phone-free time",
        tasks: ["Spend some time away from my phone"]
    },
    {
        category: "🌙 Evening routine",
        tasks: ["Prepare for tomorrow", "Have a peaceful evening"]
    }
];

// Create a new day if one does not exist.

function createToday() {
    if (!data.days[today]) {
        let id = 1;

        const tasks = defaultTasks.flatMap(category => {
            return category.tasks.map(task => ({
                id: id++,
                name: task,
                category: category.category,
                completed: false
            }));
        });

        data.days[today] = tasks;
        saveData();
    }
}

function getTodayKey() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ======================================
// DATE AND GREETING
// ======================================

function displayDate() {
    const date = new Date();

    document.getElementById("today-date").textContent =
        date.toLocaleDateString("en-KE", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    const hour = date.getHours();

    let greeting = "Hello, sunshine!";

    if (hour < 12) {
        greeting = "Good morning, sunshine! ☀";
    } else if (hour < 17) {
        greeting = "Good afternoon, sunshine! 🌷";
    } else {
        greeting = "Good evening, sunshine! 🌙";
    }

    document.getElementById("greeting").textContent = greeting;
}

// ======================================
// DISPLAY TASKS
// ======================================

function displayTasks() {
    const container = document.getElementById("task-categories");
    container.innerHTML = "";

    const tasks = data.days[today];

    // Group tasks by category.

    const categories = {};

    tasks.forEach(task => {
        if (!categories[task.category]) {
            categories[task.category] = [];
        }

        categories[task.category].push(task);
    });

    Object.keys(categories).forEach(category => {

        const card = document.createElement("div");
        card.className = "task-category";

        const heading = document.createElement("h3");
        heading.textContent = category;

        card.appendChild(heading);

        categories[category].forEach(task => {

            const label = document.createElement("label");
            label.className = "task-item";

            if (task.completed) {
                label.classList.add("completed");
            }

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            checkbox.addEventListener("change", function () {
                task.completed = checkbox.checked;

                saveData();
                displayTasks();
                updateProgress();
                updateStatistics();
            });

            const taskText = document.createElement("span");
            taskText.textContent = task.name;

            label.appendChild(checkbox);
            label.appendChild(taskText);

            card.appendChild(label);
        });

        container.appendChild(card);
    });

    updateProgress();
}

// ======================================
// PROGRESS BAR
// ======================================

function updateProgress() {
    const tasks = data.days[today];

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("progress-percent").textContent =
        percentage + "%";

    document.getElementById("progress-fill").style.width =
        percentage + "%";

    document.getElementById("task-count").textContent =
        `${completed} of ${total} tasks completed`;

    let message = "Every little step counts. ♡";

    if (percentage === 100 && total > 0) {
        message = "You did it! Look at you go! 🎀";
    } else if (percentage >= 75) {
        message = "You're almost there. Keep going! 🌷";
    } else if (percentage >= 50) {
        message = "Look at the progress you're making! ♡";
    } else if (percentage >= 25) {
        message = "A little progress is still progress.";
    }

    document.getElementById("progress-message").textContent =
        message;
}

// ======================================
// ADD CUSTOM TASK
// ======================================

document.getElementById("add-task-form")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const input = document.getElementById("new-task");

        const taskName = input.value.trim();

        if (taskName === "") return;

        const newTask = {
            id: Date.now(),
            name: taskName,
            category: "♡ My extra tasks",
            completed: false
        };

        data.days[today].push(newTask);

        saveData();

        input.value = "";

        displayTasks();
        updateStatistics();
    });

// ======================================
// RESET TODAY
// ======================================

document.getElementById("reset-day")
    .addEventListener("click", function () {

        const confirmed = confirm(
            "Are you sure you want to reset today's checklist? Your previous days will remain saved."
        );

        if (!confirmed) return;

        data.days[today] = defaultTasks.flatMap((category, index) => {
            return category.tasks.map((task, taskIndex) => ({
                id: `${index}-${taskIndex}-${Date.now()}`,
                name: task,
                category: category.category,
                completed: false
            }));
        });

        saveData();
        displayTasks();
        displayHistory();
        updateStatistics();
    });

// ======================================
// NAVIGATION
// ======================================

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".page-section");

navLinks.forEach(link => {

    link.addEventListener("click", function () {

        const target = link.dataset.section;

        navLinks.forEach(item => item.classList.remove("active"));
        sections.forEach(section =>
            section.classList.remove("active-section")
        );

        link.classList.add("active");

        document.getElementById(target)
            .classList.add("active-section");

        if (target === "habits") displayHabits();
        if (target === "journal") displayJournalHistory();
        if (target === "history") displayHistory();
        if (target === "statistics") updateStatistics();
    });
});

// ======================================
// HABIT TRACKER
// ======================================

function displayHabits() {
    const container = document.getElementById("habit-list");
    container.innerHTML = "";

    data.habits.forEach(habit => {

        const label = document.createElement("label");
        label.className = "habit-item";

        const completed = habit.completed.includes(today);

        if (completed) {
            label.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = completed;

        checkbox.addEventListener("change", function () {

            if (checkbox.checked) {
                if (!habit.completed.includes(today)) {
                    habit.completed.push(today);
                }
            } else {
                habit.completed = habit.completed.filter(
                    date => date !== today
                );
            }

            saveData();
            displayHabits();
            updateStatistics();
        });

        const text = document.createElement("span");
        text.textContent = habit.name;

        label.appendChild(checkbox);
        label.appendChild(text);

        container.appendChild(label);
    });
}

// Add a new habit.

document.getElementById("add-habit-form")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const input = document.getElementById("new-habit");
        const name = input.value.trim();

        if (name === "") return;

        data.habits.push({
            id: Date.now(),
            name: name,
            completed: []
        });

        saveData();
        input.value = "";

        displayHabits();
        updateStatistics();
    });

// ======================================
// JOURNAL
// ======================================

function displayJournal() {
    document.getElementById("journal-entry").value =
        data.journals[today] || "";
}

document.getElementById("save-journal")
    .addEventListener("click", function () {

        const entry = document.getElementById("journal-entry").value.trim();

        if (entry === "") {
            document.getElementById("journal-status").textContent =
                "Write a little something before saving. ♡";
            return;
        }

        data.journals[today] = entry;

        saveData();

        document.getElementById("journal-status").textContent =
            "Your journal entry has been saved. ♡";

        displayJournalHistory();
    });

function displayJournalHistory() {
    const container = document.getElementById("journal-history");
    container.innerHTML = "";

    const dates = Object.keys(data.journals).sort().reverse();

    if (dates.length === 0) {
        container.textContent = "Your journal entries will appear here. 🌷";
        return;
    }

    dates.forEach(date => {

        const entry = document.createElement("div");
        entry.className = "journal-entry";

        const dateText = document.createElement("strong");
        dateText.textContent = date;

        const preview = document.createElement("p");
        preview.textContent =
            data.journals[date].slice(0, 100) + "...";

        const readButton = document.createElement("button");
        readButton.textContent = "Read entry";

        readButton.addEventListener("click", function () {
            document.getElementById("journal-entry").value =
                data.journals[date];

            document.getElementById("journal-status").textContent =
                `Viewing entry from ${date}. Saving will update today's entry.`;
        });

        entry.appendChild(dateText);
        entry.appendChild(preview);
        entry.appendChild(readButton);

        container.appendChild(entry);
    });
}

// ======================================
// DAILY HISTORY
// ======================================

function displayHistory() {
    const container = document.getElementById("history-list");
    container.innerHTML = "";

    const dates = Object.keys(data.days)
        .filter(date => date !== today)
        .sort()
        .reverse();

    if (dates.length === 0) {
        container.textContent =
            "Your previous days will appear here as you use your planner. ♡";
        return;
    }

    dates.forEach(date => {

        const tasks = data.days[date];

        const completed = tasks.filter(task => task.completed).length;

        const percentage = tasks.length === 0
            ? 0
            : Math.round((completed / tasks.length) * 100);

        const item = document.createElement("div");
        item.className = "history-item";

        const dateText = document.createElement("span");
        dateText.textContent = date;

        const progressText = document.createElement("strong");
        progressText.textContent =
            `${percentage}% (${completed}/${tasks.length} tasks)`;

        item.appendChild(dateText);
        item.appendChild(progressText);

        container.appendChild(item);
    });
}

// ======================================
// STATISTICS
// ======================================

function updateStatistics() {

    const dates = Object.keys(data.days);

    let totalCompleted = 0;

    dates.forEach(date => {
        totalCompleted += data.days[date].filter(
            task => task.completed
        ).length;
    });

    let habitCheckins = 0;

    data.habits.forEach(habit => {
        habitCheckins += habit.completed.length;
    });

    document.getElementById("days-tracked").textContent =
        dates.length;

    document.getElementById("total-completed").textContent =
        totalCompleted;

    document.getElementById("habits-completed").textContent =
        habitCheckins;
}

// ======================================
// START THE WEBSITE
// ======================================

createToday();
displayDate();
displayTasks();
displayHabits();
displayJournal();
displayJournalHistory();
displayHistory();
updateStatistics();