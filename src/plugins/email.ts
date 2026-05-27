import { definePlugin } from "emdash";
import type { PluginDescriptor } from "emdash";

const FROM_EMAIL = "no-reply@littlebigthings.co";
const FROM_NAME = "Little Big Things";

/**
 * Build a minimal RFC 2822 / MIME email string without external dependencies.
 * Cloudflare's EmailMessage constructor accepts a raw string.
 */
function buildRawEmail({
	from,
	to,
	subject,
	text,
	html,
}: {
	from: string;
	to: string;
	subject: string;
	text?: string;
	html?: string;
}): string {
	const CRLF = "\r\n";
	const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).slice(2)}`;

	const headers = [
		`From: "${FROM_NAME}" <${from}>`,
		`To: ${to}`,
		`Subject: ${subject}`,
		`MIME-Version: 1.0`,
	];

	if (html && text) {
		return [
			...headers,
			`Content-Type: multipart/alternative; boundary="${boundary}"`,
			``,
			`--${boundary}`,
			`Content-Type: text/plain; charset=utf-8`,
			``,
			text,
			`--${boundary}`,
			`Content-Type: text/html; charset=utf-8`,
			``,
			html,
			`--${boundary}--`,
		].join(CRLF);
	} else if (html) {
		return [...headers, `Content-Type: text/html; charset=utf-8`, ``, html].join(CRLF);
	} else {
		return [
			...headers,
			`Content-Type: text/plain; charset=utf-8`,
			``,
			text ?? "",
		].join(CRLF);
	}
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
 * Plugin implementation — uses the Cloudflare send_email Workers binding.
 * Requires `send_email` in wrangler.jsonc with `allowed_sender_addresses`.
 *
 * The Cloudflare binding API is:
 *   new EmailMessage(from, to, rawMimeString)
 *   env.EMAIL.send(emailMessage)
 */
export function createPlugin() {
	return definePlugin({
		id: "lbt-email-cloudflare",
		version: "1.0.0",
		capabilities: ["hooks.email-transport:register"],
		hooks: {
			"email:deliver": {
				exclusive: true,
				handler: async (event, ctx) => {
					const env = ctx.env as Record<string, unknown>;
					const emailBinding = env["EMAIL"] as
						| { send(msg: unknown): Promise<void> }
						| undefined;

					if (!emailBinding) {
						ctx.log.error(
							"EMAIL binding not found — check wrangler.jsonc send_email config",
						);
						return;
					}

					// Normalise recipients to an array
					const recipients = Array.isArray(event.message.to)
						? event.message.to
						: [event.message.to];

					for (const recipient of recipients) {
						try {
							const raw = buildRawEmail({
								from: FROM_EMAIL,
								to: recipient,
								subject: event.message.subject,
								text: event.message.text,
								html: event.message.html,
							});

							// Cloudflare's EmailMessage is a runtime global in the Workers environment
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const EmailMessage = (globalThis as any).EmailMessage as new (
								from: string,
								to: string,
								raw: string,
							) => unknown;

							if (!EmailMessage) {
								ctx.log.error(
									"EmailMessage global not found — are you running in a Cloudflare Worker?",
								);
								return;
							}

							const message = new EmailMessage(FROM_EMAIL, recipient, raw);
							await emailBinding.send(message);
						} catch (err) {
							ctx.log.error(
								`Cloudflare Email delivery failed for ${recipient}: ${String(err)}`,
							);
						}
					}
				},
			},
		},
	});
}
