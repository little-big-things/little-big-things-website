import { definePlugin } from "emdash";

interface SendEmail {
	send(message: {
		to: string | string[];
		from: string | { email: string; name: string };
		subject: string;
		text?: string;
		html?: string;
	}): Promise<{ messageId: string }>;
}

/**
 * Email transport plugin using the Cloudflare Email Service native binding.
 *
 * Requires:
 * 1. Domain verified in Cloudflare Email Service dashboard
 * 2. The `send_email` binding in wrangler.jsonc (already added)
 *
 * No third-party API keys needed — uses Cloudflare's own email infrastructure.
 * 3,000 emails/month included on Workers Paid plan.
 */
export function emailPlugin() {
	return definePlugin({
		id: "lbt-email-cloudflare",
		version: "1.0.0",
		name: "Email (Cloudflare Email Service)",
		description: "Transactional email via Cloudflare Email Service for magic links and invites.",
		hooks: {
			"email:deliver": {
				exclusive: true,
				handler: async (event, ctx) => {
					const env = ctx.env as Record<string, unknown>;
					const emailBinding = env["EMAIL"] as SendEmail | undefined;

					if (!emailBinding) {
						ctx.log.error("EMAIL binding not found — check wrangler.jsonc send_email config");
						return;
					}

					try {
						await emailBinding.send({
							to: event.message.to,
							from: { email: "no-reply@littlebigthings.co", name: "Little Big Things" },
							subject: event.message.subject,
							text: event.message.text,
							...(event.message.html ? { html: event.message.html } : {}),
						});
					} catch (err) {
						ctx.log.error(`Cloudflare Email delivery failed: ${String(err)}`);
					}
				},
			},
		},
	});
}
