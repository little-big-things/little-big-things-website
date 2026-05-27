import { definePlugin } from "emdash";
import type { PluginDescriptor } from "emdash";

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
 * Descriptor factory — called at build time in astro.config.mjs.
 * Points back at this same file as the runtime entrypoint.
 */
export function emailPlugin(): PluginDescriptor {
	return {
		id: "lbt-email-cloudflare",
		version: "1.0.0",
		format: "native",
		entrypoint: import.meta.url,
		capabilities: ["hooks.email-transport:register"],
	};
}

/**
 * Plugin implementation — EmDash imports this file at runtime and calls
 * the default export to get the resolved plugin.
 *
 * Uses the Cloudflare Email Service native Workers binding (EMAIL).
 * Requires the send_email binding in wrangler.jsonc and the domain
 * verified in Cloudflare Email Service.
 *
 * 3,000 emails/month included on Workers Paid plan — no API key needed.
 */
export default function createPlugin() {
	return definePlugin({
		id: "lbt-email-cloudflare",
		version: "1.0.0",
		capabilities: ["hooks.email-transport:register"],
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
