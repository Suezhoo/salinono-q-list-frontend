window.onload = async function () {
    await getQueuers();
    // await removeFromQueue("Gamer 7");
};

let AMOUNT; // Stores amount of current queuers

// observer
setInterval(function () {
    getQueuers();
}, 10000);

async function getQueuers() {
    // DOM
    const element = document.querySelector("[data-q='queuers']");

    await fetch("https://sali-q-list.herokuapp.com/queuers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((res) => res.json())
        .then(async (queuers) => {
            // Queue status
            let queue_status = false;
            await fetch("https://sali-q-list.herokuapp.com/queue/status")
                .then((res) => res.json())
                .then((status) => {
                    queue_status = status ? "OPEN" : "CLOSED";
                });

            AMOUNT = queuers.length;

            // Display people in queue
            document.querySelector("[data-q='people-in-queue']").innerHTML = AMOUNT == 0 || undefined ? "" : `${AMOUNT} In Queue (${queue_status})`;
            if (queuers.length == 0) {
                document.querySelector("[data-q='people-in-queue']").innerHTML = `QUEUE IS ${queue_status}`;
                element.innerHTML = "No people in queue at the moment...";
            } else {
                element.innerHTML = "";
                queuers.forEach((queuer, index) => {
                    if (index == 2) element.innerHTML += `<hr>`;
                    element.innerHTML += `<div id="queuer">
                                            <p>${index + 1}</p>
                                            <p>${queuer.name}</p>
                                            <a href="#" onclick="removeFromQueue('${queuer.name}')" href="#" class="remove-from-q">&chi;</a>
                                            </div>`;
                });
            }
        });
}

async function removeFromQueue(name) {
    await fetch("https://sali-q-list.herokuapp.com/remove" + "?name=" + name, {
        method: "GET",
    });

    // Reload page
    window.location.reload();
}

async function openQueue() {
    await fetch("https://sali-q-list.herokuapp.com/open");
    // Reload page
    window.location.reload();
}

async function closeQueue() {
    await fetch("https://sali-q-list.herokuapp.com/close");
    // Reload page
    window.location.reload();
}

async function clearQueue() {
    await fetch("https://sali-q-list.herokuapp.com/clear");
    // Reload page
    window.location.reload();
}
