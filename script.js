async function analyzeCar() {

    const year = document.getElementById("year").value;
    const make = document.getElementById("make").value;
    const model = document.getElementById("model").value;
    const trim = document.getElementById("trim").value;
    const mileage = document.getElementById("mileage").value;
    const price = document.getElementById("price").value;
    const urlInput = document.getElementById("url") ? document.getElementById("url").value : "";

    const results = document.getElementById("results");

    results.innerHTML = `
        <div class="result-card">
            <h2>🤖 CarTruth AI</h2>
            <p>Analyzing vehicle...</p>
        </div>
    `;

    results.scrollIntoView({
        behavior: "smooth"
    });

    try {

        const response = await fetch("/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                year,
                make,
                model,
                trim,
                mileage,
                price,
                url: urlInput
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Server Error");
        }

        results.innerHTML = `
            <div class="result-card">

                <h2>🚗 CarTruth AI Report</h2>

                <div class="ai-report">
                    ${data.text.replace(/\n/g, "<br><br>")}
                </div>

            </div>
        `;

        results.scrollIntoView({
            behavior: "smooth"
        });

    } catch (err) {

        results.innerHTML = `
            <div class="result-card">

                <h2>❌ Error</h2>

                <p>${err.message}</p>

            </div>
        `;

    }

}