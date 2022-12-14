/* Helper functions */
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return (
        [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),  // 👈️ can also add seconds
        ].join(':')
    );
}

function emitMessage(message, level="#2fb84e",timeout=10000) {
    const comZone = document.querySelectorAll('.comZone');
    comZone.forEach((zone) => {
        zone.style.color = level;
        zone.textContent = message;
        zone.classList.remove("hidden");
        setTimeout(() => {
            zone.classList.add("hidden");
        }, timeout);
    })
}

function sortDataByDate(data, type="desc") {
    if(type == "desc") {
        return data.sort((a, b) => (a.date > b.date) ? -1 : 1);
    }
    return data.sort((a, b) => (a.date > b.date) ? 1 : -1);
  }

export {padTo2Digits, formatDate, emitMessage, sortDataByDate}