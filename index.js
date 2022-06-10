window.onload = async function () {
    // await addToQueue("Gamer 6");
    initEventListeners();
    await getQueuers();
    // await removeFromQueue("Gamer 7");
};

let AMOUNT; // Stores amount of current queuers

// observer
setInterval(function () {
    getQueuers();
}, 30000);

function initEventListeners() {
    const button_join_queue = document.querySelector("[data-q='button_join']");
    button_join_queue.addEventListener("click", () => {
        const twitch_name = document.querySelector("[data-q='twitch_name']").value;
        const gamertag = document.querySelector("[data-q='gamertag']").value;

        addToQueue(twitch_name, gamertag);
    });
}

async function getQueuers() {
    // DOM
    const element = document.querySelector("[data-q='queuers']");

    await fetch("https://sali-q-list.herokuapp.com/queuers", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then((res) => res.json())
        .then((queuers) => {
            if (AMOUNT == queuers.length) {
                return;
            }
            AMOUNT = queuers.length;

            // Display people in queue
            document.querySelector("[data-q='people-in-queue']").innerHTML = AMOUNT == 0 || undefined ? "" : `${AMOUNT} In Queue`;
            if (queuers.length == 0) element.innerHTML = "No people in queue at the moment...";
            else {
                element.innerHTML = "";
                queuers.forEach((queuer, index) => {
                    if (index == 2) element.innerHTML += `<hr>`;
                    element.innerHTML += `<div id="queuer">
                                            <p>${index + 1}</p>
                                            <p>${queuer.twitch_name}</p>
                                            <p>${queuer.gamertag}</p>
                                            <a href="#" onclick="removeFromQueue('${queuer.twitch_name}')" href="#" class="remove-from-q">&chi;</a>
                                            </div>`;
                });
            }
        });
}

async function addToQueue(twitch_name, gamertag) {
    // Make gamertag param optional
    if (gamertag === undefined || gamertag === "") gamertag = twitch_name;

    const data = { twitch_name, gamertag };

    await fetch("https://sali-q-list.herokuapp.com/queuers/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((data) => {
            const element = document.querySelector("[data-q='join_queue_error']");
            if (data.error) {
                element.style.display = "flex";
                element.innerHTML = `${data.value}`;
                if (element.classList.contains("success")) element.classList.replace("success", "error");
                element.classList.add("error");
            } else {
                element.style.display = "flex";
                element.innerHTML = "Joined the queue";
                if (element.classList.contains("error")) element.classList.replace("error", "success");
                element.classList.add("success");
                // Reload page
                window.location.reload();
            }
        });
}

async function removeFromQueue(name) {
    await fetch("https://sali-q-list.herokuapp.com/queuers/:name" + "?name=" + name, {
        method: "DELETE",
    });

    // Reload page
    window.location.reload();
}
