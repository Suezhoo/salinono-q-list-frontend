window.onload = async function () {
    await getQueuers();
    // await removeFromQueue("Gamer 7");
};

let AMOUNT; // Stores amount of current queuers

// observer
setInterval(function () {
    getQueuers();
}, 30000);

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
                                            <p>${queuer.name}</p>
                                            <a href="#" onclick="removeFromQueue('${queuer.name}')" href="#" class="remove-from-q">&chi;</a>
                                            </div>`;
                });
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
