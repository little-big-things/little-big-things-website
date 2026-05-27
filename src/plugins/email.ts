import { definePlugin } from "emdash";

/**
 * Email transport plugin using Resend.
 *
 * Requires a RESEND_API_KEY environment variable (set it in Cloudflare
 * Workers → Settings → Variables and Secrets, or in .dev.vars locally).
 *
 * From address is read from EMDASH_EMAIL_FROM, defaulting to
 * "Little Big Things <no-reply@littlebigthings.co>".
 */
export function emailPlugin() {
	return definePlugin({
		id: "lbt-email-resend",
		version: "1.0.0",
		name: "Email (Resend)",
		description: "Transactional email via Resend for magic links and invites.",
		hooks: {
			"email:deliver": {
				exclusive: true,
				handler: async (event, ctx) => {
					const apiKey = (ctx.env as Record<string, string>)["RESEND_API_KEY"];
					if (!apiKey) {
						ctx.log.error("RESEND_API_KEY is not set — email not sent");
						return;
					}

					const from =
						(ctx.env as Record<string, string>)["EMDASH_EMAIL_FROM"] ??
						"Little Big Things <no-reply@littlebigthings.co>";

					const res = await fetch("https://api.resend.com/emails", {
						method: "POST",
						headers: {
							Authorization: `Bearer ${apiKey}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							from,
							to: event.message.to,
							subject: event.message.subject,
							text: event.message.text,
							...(event.message.html ? { html: event.message.html } : {}),
						}),
					});

					if (!res.ok) {
						const body = await res.text();
						ctx.log.error(`Resend delivery failed (${res.status}): ${body}`);
					}
				},
			},
		},
	});
}
