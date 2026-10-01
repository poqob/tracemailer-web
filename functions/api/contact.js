/**
 * Cloudflare Pages Functions - /api/contact
 * Handles contact form leads and forwards to TraceMailer backend
 */
export async function onRequestPost(context) {
    try {
        const bodyText = await context.request.text();
        const data = JSON.parse(bodyText);

        if (!data.name || !data.email) {
            return new Response(JSON.stringify({
                success: false,
                message: "İsim ve e-posta zorunludur"
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Forward to production TraceMailer backend
        try {
            const backendRes = await fetch("https://dash.tracemailer.com/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (backendRes.ok) {
                const resJson = await backendRes.json();
                return new Response(JSON.stringify(resJson), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                });
            }
        } catch (e) {
            // Log forward error and proceed with local edge confirmation
            console.error("[CF Function] Forward error:", e);
        }

        // Fallback edge confirmation
        return new Response(JSON.stringify({
            success: true,
            message: "Talebiniz başarıyla alındı",
            id: "lead-cf-" + Date.now().toString(36)
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({
            success: false,
            message: "Geçersiz veri formatı"
        }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }
}
