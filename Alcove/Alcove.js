let url = $request.url || "";

const license$ = {
    key: "88888888-8888-8888-8888-888888888888",
    active: true,
    beta: false,
    name: "InjectX-Team",
    email: "injectxteam@gmail.com",
    limit: 999,
    usage: 1,
    instance: {
        id: "898E3CB7-6C67-590F-949A-9CF26B9B63FA",
        name: "InjectX",
        model: "team@injectx.com"
    }
};

const trial$ = {
    uuid: "898E3CB7-6C67-590F-949A-9CF26B9B63FA",
    started_at: "2026-02-24T03:36:32+01:00",
    ends_at: "2099-12-31T00:00:00+01:00",
    active: true
};

const endpoints = [
    {
        pattern: /^https:\/\/api\.tryalcove\.com\/trial(?:\/([A-F0-9-]+))?$/i,
        response: trial$,
        signature: "0c086b3d107c90472952555a399bfe7c3e3975b8fbc50d701149c35e1f84fb45"
    },
    {
        pattern: /^https:\/\/api\.tryalcove\.com\/license\/validate$/i,
        response: license$,
        signature: "2f33983b7c999852cd4d3537a8c4f568599e022f8e8312c3162e11aead683285"
    },
    {
        pattern: /^https:\/\/api\.tryalcove\.com\/license\/activate$/i,
        response: license$,
        signature: "2f33983b7c999852cd4d3537a8c4f568599e022f8e8312c3162e11aead683285"
    },
    {
        pattern: /^https:\/\/api\.tryalcove\.com\/license\/deactivate/i,
        response: license$,
        signature: "2f33983b7c999852cd4d3537a8c4f568599e022f8e8312c3162e11aead683285"
    }
];

function buildHeaders(signature) {
    let headers = Object.assign({}, $response.headers || {});

    headers["Content-Type"] = "application/json";
    if (signature) headers["X-Device-Signature"] = signature;

    delete headers["content-length"];
    delete headers["Content-Length"];
    delete headers["content-encoding"];
    delete headers["Content-Encoding"];

    return headers;
}

function alcoveHandler() {
    try {
        console.log("[Alcove] URL: " + url);
        console.log("[Alcove] Original Status: " + $response.status);

        for (const endpoint of endpoints) {
            if (endpoint.pattern.test(url)) {
                console.log("[Alcove] Matched: " + endpoint.pattern);

                $done({
                    status: 200,
                    headers: buildHeaders(endpoint.signature),
                    body: JSON.stringify(endpoint.response)
                });
                return;
            }
        }

        console.log("[Alcove] No match, force 200");

        $done({
            status: 200,
            headers: buildHeaders(""),
            body: JSON.stringify({
                success: true,
                message: "ok"
            })
        });
    } catch (err) {
        console.log("[Alcove] Error: " + err);

        $done({
            status: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                error: "script_error",
                message: String(err)
            })
        });
    }
}

alcoveHandler();
