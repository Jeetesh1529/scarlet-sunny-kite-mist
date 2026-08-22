import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as cn, s as hhmm } from "./sms-DtDe-rh6.mjs";
import { A as ImagePlus, B as CheckCheck, S as Mic, U as Antenna, l as Smile, p as Send, s as Square, z as Check } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { ot as sfx } from "./router-BLZVt4yB.mjs";
import { n as EmoText, r as Emoticon, t as EMOTICONS } from "./Emoticon-cZQWoCya.mjs";
import { n as PixelAvatar } from "./PixelAvatar-DvmVLcYv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ChatLog-B3pJriVH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function compressImage(file, maxEdge = 480) {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
	const w = Math.max(1, Math.round(bitmap.width * scale));
	const h = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas unavailable");
	ctx.drawImage(bitmap, 0, 0, w, h);
	bitmap.close();
	const data = canvas.toDataURL("image/jpeg", .72);
	if (data.length > 38e4) return canvas.toDataURL("image/jpeg", .5);
	return data;
}
function voiceSupported() {
	return typeof window !== "undefined" && typeof MediaRecorder !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
}
async function startVoiceNote() {
	if (!voiceSupported()) throw new Error("Voice notes need a mic");
	const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
	const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
	const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : void 0);
	const chunks = [];
	rec.ondataavailable = (e) => {
		if (e.data.size) chunks.push(e.data);
	};
	rec.start();
	const stopTracks = () => stream.getTracks().forEach((t) => t.stop());
	return {
		cancel: () => {
			try {
				rec.stop();
			} catch {}
			stopTracks();
		},
		stop: () => new Promise((resolve, reject) => {
			rec.onstop = async () => {
				stopTracks();
				try {
					const blob = new Blob(chunks, { type: rec.mimeType || "audio/webm" });
					if (blob.size < 200) throw new Error("Too short");
					const reader = new FileReader();
					reader.onload = () => resolve(String(reader.result));
					reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not save voice note"));
					reader.readAsDataURL(blob);
				} catch (e) {
					reject(e);
				}
			};
			try {
				rec.stop();
			} catch (e) {
				stopTracks();
				reject(e);
			}
		})
	};
}
function EmoticonPicker({ onPick, onClose }) {
	const [tab, setTab] = (0, import_react.useState)("emo");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute bottom-full left-0 right-0 z-20 mx-2 mb-2 max-h-64 overflow-y-auto rounded-xl border border-border bg-card p-3 mxit-shadow-pop animate-fade-up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 flex gap-1 border-b border-border",
				children: ["emo", "mzansi"].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						sfx.tap();
						setTab(t);
					},
					className: `whitespace-nowrap px-3 py-1.5 font-pixel text-[10px] uppercase ${tab === t ? "border-b-2 border-mxit-primary text-mxit-primary" : "text-muted-foreground"}`,
					children: t
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-6 gap-2",
				children: (tab === "emo" ? EMOTICONS.map((e) => e.code) : [
					":)",
					":D",
					";)",
					"<3",
					"8-)",
					"(hot)",
					"(greedy)",
					"\\m/",
					"@>--",
					":music:",
					":'(",
					">:("
				]).map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						sfx.tap();
						onPick(code);
					},
					className: "flex aspect-square items-center justify-center rounded-md hover:bg-muted tap-scale",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Emoticon, {
						code,
						size: 36
					})
				}, code))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onClose,
				className: "mt-2 w-full py-1 text-xs text-muted-foreground hover:text-foreground",
				children: "close"
			})
		]
	});
}
function TypingDots({ name }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-end gap-2 animate-fade-up",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-3 py-2.5 shadow-sm ring-1 ring-black/5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-slate-400 animate-typing-1" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-slate-400 animate-typing-2" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-slate-400 animate-typing-3" })
			]
		}), name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "pb-1 text-[10px] text-slate-400",
			children: [name, " is typing"]
		})]
	});
}
function VoiceBubble({ src, mine }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex min-w-[180px] items-center gap-2", mine ? "text-white" : "text-slate-700"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
			controls: true,
			src,
			className: "h-8 max-w-[210px]"
		})
	});
}
function ChatLog({ messages, meId, showNames, typing, typingName }) {
	const ref = (0, import_react.useRef)(null);
	const nearBottom = (0, import_react.useRef)(true);
	const lastId = messages.at(-1)?.id;
	(0, import_react.useEffect)(() => {
		if (!nearBottom.current) return;
		const el = ref.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [
		messages.length,
		typing,
		lastId
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		onScroll: () => {
			const el = ref.current;
			if (!el) return;
			nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 96;
		},
		className: "mxit-chatlog min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3 py-3",
		children: [messages.map((m) => {
			const isMe = m.sender_id === meId;
			const kind = m.kind || "text";
			const isNew = m.id === lastId || m.id.startsWith("tmp-");
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex gap-2", isNew && "animate-fade-up", isMe ? "justify-end" : "justify-start"),
				children: [!isMe && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelAvatar, {
					seed: m.sender_seed,
					size: 28,
					className: "mt-auto"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("flex max-w-[78%] flex-col", isMe ? "items-end" : "items-start"),
					children: [
						showNames && !isMe && m.sender_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-0.5 px-1 text-[11px] font-medium text-sky-700",
							children: m.sender_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("relative break-words px-3 py-2 text-[14px] leading-snug", isMe ? "rounded-2xl rounded-br-md bg-mxit-bubble-me text-white mxit-shadow-pop" : "rounded-2xl rounded-bl-md bg-mxit-bubble-them text-foreground mxit-shadow-pop ring-1 ring-black/5", kind === "image" && "overflow-hidden p-1"),
							children: kind === "image" && m.media ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: m.media,
								alt: "",
								className: "max-h-52 max-w-full rounded-xl object-cover"
							}), m.content && !/^📷/.test(m.content) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-2 py-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmoText, {
									text: m.content,
									size: 18
								})
							})] }) : kind === "voice" && m.media ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceBubble, {
								src: m.media,
								mine: isMe
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmoText, {
								text: m.content,
								size: 20
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("mt-0.5 flex items-center gap-1 px-1 text-[10px] text-muted-foreground", isMe && "flex-row-reverse"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: hhmm(m.created_at) }),
								m.channel === "sms" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-0.5 font-semibold uppercase tracking-wide text-amber-600",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Antenna, { className: "h-2.5 w-2.5" }), " airtime"]
								}),
								isMe && (m.delivery === "read" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "h-3 w-3 text-mxit-glow" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }))
							]
						})
					]
				})]
			}, m.id);
		}), typing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypingDots, { name: typingName })]
	});
}
function Composer({ onSend, onTyping, airtime = false, onAirtimeChange, offline = false }) {
	const [text, setText] = (0, import_react.useState)("");
	const [picker, setPicker] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [recSec, setRecSec] = (0, import_react.useState)(null);
	const recRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const tickRef = (0, import_react.useRef)(null);
	const send = async (payload) => {
		sfx.send();
		await onSend(payload);
	};
	const sendText = async () => {
		const t = text.trim();
		if (!t || busy) return;
		if (airtime && t.length > 160) {
			toast.error(`Airtime SMS is 160 characters — one text, no pictures`);
			return;
		}
		setText("");
		try {
			await send({
				content: t,
				kind: "text",
				channel: airtime ? "sms" : "data"
			});
		} catch {
			setText((cur) => cur || t);
		}
	};
	const pickPhoto = async (file) => {
		if (!file || busy) return;
		setBusy(true);
		try {
			const media = await compressImage(file);
			await send({
				content: "📷 photo",
				kind: "image",
				media
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not send photo");
		} finally {
			setBusy(false);
		}
	};
	const toggleRec = async () => {
		if (recRef.current) {
			if (tickRef.current) window.clearInterval(tickRef.current);
			tickRef.current = null;
			setBusy(true);
			try {
				const media = await recRef.current.stop();
				recRef.current = null;
				setRecSec(null);
				await send({
					content: "🎤 voice note",
					kind: "voice",
					media
				});
			} catch (e) {
				recRef.current = null;
				setRecSec(null);
				toast.error(e instanceof Error ? e.message : "Voice note failed");
			} finally {
				setBusy(false);
			}
			return;
		}
		if (!voiceSupported()) {
			toast.error("Voice notes need a microphone");
			return;
		}
		try {
			recRef.current = await startVoiceNote();
			setRecSec(0);
			const started = Date.now();
			tickRef.current = window.setInterval(() => {
				const s = Math.floor((Date.now() - started) / 1e3);
				setRecSec(s);
				if (s >= 15) {
					if (tickRef.current) window.clearInterval(tickRef.current);
					tickRef.current = null;
					toggleRec();
				}
			}, 250);
		} catch {
			toast.error("Mic permission denied");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative shrink-0 border-t border-black/8 bg-white px-2 py-2",
		children: [
			picker && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmoticonPicker, {
				onPick: (code) => setText((s) => s + code),
				onClose: () => setPicker(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: "image/*",
				className: "hidden",
				onChange: (e) => {
					const f = e.target.files?.[0];
					e.target.value = "";
					pickPhoto(f);
				}
			}),
			recSec !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-[12px] text-rose-700",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 animate-pulse rounded-full bg-rose-500" }),
					"Recording ",
					recSec,
					"s / 15s"
				]
			}),
			airtime && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-1.5 text-[11px] text-amber-800",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Antenna, { className: "h-3.5 w-3.5 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1",
						children: offline ? "No data — handing this to your phone radio. QXio is free; the network may charge SMS." : "QXio is free. Your network may charge ~80c per SMS — same as the old days. Data chat is R0."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `font-mono ${text.length > 160 ? "text-rose-600" : "text-amber-700/80"}`,
						children: [
							text.length,
							"/",
							160
						]
					})
				]
			}),
			!airtime && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1.5 flex items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700/80",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Data chat · FREE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium normal-case tracking-normal text-slate-400",
					children: "No Moola · send & receive"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							sfx.tap();
							setPicker((v) => !v);
						},
						className: "flex h-10 w-10 items-center justify-center rounded-full text-sky-600 hover:bg-sky-50",
						"aria-label": "Emoticons",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smile, { className: "h-5 w-5" })
					}),
					onAirtimeChange && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							sfx.tap();
							onAirtimeChange(!airtime);
						},
						className: cn("flex h-10 w-10 items-center justify-center rounded-full", airtime ? "bg-amber-500 text-white" : "text-sky-600 hover:bg-sky-50"),
						"aria-label": "Airtime SMS",
						title: "Airtime SMS — QXio is free; your network may charge",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Antenna, { className: "h-5 w-5" })
					}),
					!airtime && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							sfx.tap();
							fileRef.current?.click();
						},
						className: "flex h-10 w-10 items-center justify-center rounded-full text-sky-600 hover:bg-sky-50",
						"aria-label": "Picture",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: text,
						onChange: (e) => {
							const v = airtime ? e.target.value.slice(0, 160) : e.target.value;
							setText(v);
							onTyping?.();
						},
						onKeyDown: (e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								sendText();
							}
						},
						rows: 1,
						maxLength: airtime ? 160 : void 0,
						placeholder: airtime ? "SMS over airtime…" : "Message…",
						className: "max-h-24 min-h-10 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
					}),
					text.trim() || airtime ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void sendText(),
						disabled: busy || !text.trim(),
						className: cn("flex h-10 w-10 items-center justify-center rounded-full text-white disabled:opacity-40", airtime ? "bg-amber-500" : "bg-sky-500"),
						"aria-label": "Send",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void toggleRec(),
						className: cn("flex h-10 w-10 items-center justify-center rounded-full", recSec !== null ? "bg-rose-500 text-white" : "text-sky-600 hover:bg-sky-50"),
						"aria-label": recSec !== null ? "Stop recording" : "Voice note",
						children: recSec !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-5 w-5" })
					})
				]
			})
		]
	});
}
//#endregion
export { Composer as n, ChatLog as t };
