const SHEET_URL = "https://docs.google.com/spreadsheets/d/1tdJduStfvJ9qPi0V-8d7UejLp__gMmXwUu79wP2y3Pc/export?format=csv";

function updateMeter(count) {
    const meter = document.getElementById("meter");
    const status = document.getElementById("status");
    const petImg = document.getElementById("pet-img");
    const petCard = document.querySelector(".pet-card");
    console.log("Updating meter with count:", count);

    // Remove all state classes
    petCard.classList.remove("happy", "tired", "exhausted");

    if (count === 0) {
        meter.style.background = "#4CAF50"; // Green
        status.textContent = "Your pet is full of energy!";
        petImg.src = "images/happypet.jpg";
        petCard.classList.add("happy");
    } else if (count === 1) {
        meter.style.background = "#8BC34A"; // Light Green
        status.textContent = "Your pet is still energetic, but starting to get a bit tired...";
        petImg.src = "images/happypet.jpg";
        petCard.classList.add("tired");
    } else if (count === 2) {
        meter.style.background = "#CDDC39"; // Lime
        status.textContent = "Your pet is getting sleepy. Maybe it's time for a break?";
        petImg.src = "images/happypet.jpg";
        petCard.classList.add("tired");
    } else if (count === 3) {
        meter.style.background = "#FFC107"; // Yellow
        status.textContent = "Your pet is really tired now. Please give them a rest!";
        petImg.src = "images/sadpet.jpg";
        petCard.classList.add("tired");
    } else if (count === 4) {
        meter.style.background = "#FF9800"; // Orange
        status.textContent = "⚠️ WARNING: Your pet is extremely tired! One more and they'll be exhausted!";
        petImg.src = "images/sadpet.jpg";
        petCard.classList.add("tired");
    } else {
        meter.style.background = "#F44336"; // Red
        status.textContent = "Your pet is completely exhausted! They need a long rest now!";
        petImg.src = "images/deadpet.jpg";
        petCard.classList.add("exhausted");
    }
}

function processCSV(csv) {
    try {
        console.log("Raw CSV data:", csv);
        
        // Split into rows and remove any empty rows
        let rows = csv.trim().split('\n').filter(row => row.trim());
        console.log("All rows:", rows);
        
        // Get today's date in M/D/YYYY format
        let today = new Date();
        let todayStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        console.log("Today's date:", todayStr);
        
        // Count rows that contain "Yes" and today's date
        let count = rows.filter(row => {
            let cells = row.split(',');
            console.log("Processing row:", cells);
            // Check if the row has "Yes" in the "Are you watching Youtube?" column
            let hasYes = cells[1] && cells[1].trim() === "Yes";
            // Check if the timestamp is from today
            let timestamp = cells[0];
            let hasToday = timestamp && timestamp.includes(todayStr);
            console.log("Row timestamp:", timestamp, "Has Yes:", hasYes, "Has Today:", hasToday);
            return hasYes && hasToday;
        }).length;

        console.log("Final count:", count);
        updateMeter(count);
    } catch (error) {
        console.error("Error processing CSV:", error);
        document.getElementById("status").textContent = "Error processing data.";
    }
}

// Fetch the data
fetch(SHEET_URL)
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text();
    })
    .then(csv => processCSV(csv))
    .catch(err => {
        console.error("Error fetching data:", err);
        document.getElementById("status").textContent = "Error loading data. Please check the sheet URL.";
    }); 