/**
 * Cloudflare Pages Function - /api/public/plans
 * Fetches public plans from live TraceMailer dashboard backend
 */
export async function onRequestGet(context) {
    try {
        const backendRes = await fetch("https://dash.tracemailer.com/api/public/plans", {
            headers: { "Accept": "application/json" }
        });
        if (backendRes.ok) {
            const data = await backendRes.json();
            return new Response(JSON.stringify(data), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Cache-Control": "public, max-age=60, s-maxage=60"
                }
            });
        }
    } catch (e) {
        console.error("[CF Function plans] Backend fetch error:", e);
    }

    // Default to empty array if dashboard has not published plans or unreachable
    return new Response(JSON.stringify([]), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    });
}
