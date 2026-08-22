import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as cn } from "./sms-DtDe-rh6.mjs";
import { n as ZONES } from "./zones-D1zBMza4.mjs";
import { r as signIn, t as authClient } from "./client-sGid3STf.mjs";
import { t as GROK_PROVIDERS } from "./server-5LKuYKvg.mjs";
import { i as TabletSmartphone, k as LoaderCircle, t as X, u as Smartphone, z as Check } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as APP_NAME, d as useMxit, h as checkMxitId, l as APP_TAGLINE, ot as sfx, v as createProfile } from "./router-BLZVt4yB.mjs";
import { t as MOOLA_EXTRAS } from "./rates-DzKarHBy.mjs";
import { n as PixelAvatar, t as AVATAR_SEEDS } from "./PixelAvatar-DvmVLcYv.mjs";
import { t as MOODS } from "./types-DkbMrLlo.mjs";
import { t as MoodIcon } from "./MoodIcon-C7hfQIot.mjs";
import { t as Button } from "./button-DsVgo1yZ.mjs";
import { t as Input } from "./input-ZuA8S123.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AuthScreen-DUwXcE5G.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-sm font-medium leading-none", className),
		...props
	});
}
function isStandaloneApp() {
	if (typeof window === "undefined") return false;
	const nav = window.navigator;
	return window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: fullscreen)").matches || Boolean(nav.standalone);
}
function openPhoneInstall(platform) {
	window.location.assign(`/?install=1&platform=${platform}`);
}
function AuthScreen({ needsProfile = false }) {
	const { refresh } = useMxit();
	const [mode, setMode] = (0, import_react.useState)(needsProfile ? "signup" : "login");
	const [step, setStep] = (0, import_react.useState)(needsProfile ? "profile" : "auth");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [mxitId, setMxitId] = (0, import_react.useState)("");
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [moodCode, setMoodCode] = (0, import_react.useState)(":)");
	const [avatarSeed, setAvatarSeed] = (0, import_react.useState)(AVATAR_SEEDS[0]);
	const [age, setAge] = (0, import_react.useState)("");
	const [gender, setGender] = (0, import_react.useState)("");
	const [zone, setZone] = (0, import_react.useState)("ct");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [oauthBusy, setOauthBusy] = (0, import_react.useState)(null);
	const [standalone, setStandalone] = (0, import_react.useState)(false);
	const [accountReady, setAccountReady] = (0, import_react.useState)(needsProfile);
	const [idStatus, setIdStatus] = (0, import_react.useState)("idle");
	const [idReason, setIdReason] = (0, import_react.useState)("");
	const [suggestions, setSuggestions] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		setStandalone(isStandaloneApp());
	}, []);
	(0, import_react.useEffect)(() => {
		const handle = mxitId.trim().toLowerCase();
		if (step !== "profile" && !needsProfile) return;
		if (handle.length < 3) {
			setIdStatus("idle");
			setIdReason(handle ? "3–20 letters, numbers, underscores" : "");
			setSuggestions([]);
			return;
		}
		setIdStatus("checking");
		const t = setTimeout(() => {
			checkMxitId({ data: handle }).then((r) => {
				setIdStatus(r.ok ? "ok" : "bad");
				setSuggestions(r.suggestions);
				setIdReason(r.ok ? "This ID is yours if you take it" : r.reason === "taken" ? "Already taken — IDs are unique forever" : r.reason === "reserved" ? "Reserved for QXio" : r.reason === "format" ? "3–20 letters, numbers, underscores" : "Pick a QXio ID");
			}).catch(() => {
				setIdStatus("bad");
				setIdReason("Could not check ID");
			});
		}, 280);
		return () => clearTimeout(t);
	}, [
		mxitId,
		step,
		needsProfile
	]);
	const oauth = async (providerId) => {
		sfx.tap();
		setOauthBusy(providerId);
		try {
			await signIn(providerId, { callbackURL: "/" });
		} catch (e) {
			sfx.error();
			toast.error(e instanceof Error ? e.message : "Sign-in failed");
			setOauthBusy(null);
		}
	};
	const finishProfile = async () => {
		if (idStatus === "bad") throw new Error(idReason || "That QXio ID is taken");
		const mood = MOODS.find((m) => m.code === moodCode);
		const p = await createProfile({ data: {
			mxitId,
			displayName,
			mood: mood ? `${mood.label} on QXio` : "Hey there! I'm on QXio.",
			moodCode,
			avatarSeed,
			age: age ? parseInt(age, 10) : null,
			gender: gender || null,
			zone,
			phone: phone || null
		} });
		toast.success(`Welcome to ${APP_NAME}, ${p.display_name}! Chat is free. ${MOOLA_EXTRAS.welcome} Moola added.`, { duration: 2200 });
		await refresh();
	};
	const handleAuth = async (e) => {
		e.preventDefault();
		sfx.tap();
		setBusy(true);
		try {
			if (needsProfile || accountReady) {
				await finishProfile();
				return;
			}
			if (mode === "login") {
				const { error } = await authClient.signIn.email({
					email,
					password
				});
				if (error) throw new Error(error.message);
				toast.success("Welcome back!");
				await authClient.getSession().catch(() => {});
				await refresh();
				return;
			}
			if (step === "auth") {
				if (password.length < 6) throw new Error("Password must be at least 6 characters");
				setStep("profile");
				setBusy(false);
				return;
			}
		} catch (err) {
			sfx.error();
			toast.error(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setBusy(false);
		}
	};
	const createAccount = async (e) => {
		e.preventDefault();
		sfx.tap();
		setBusy(true);
		try {
			if (idStatus !== "ok") throw new Error(idReason || "Pick a unique QXio ID");
			if (!accountReady) {
				const { error } = await authClient.signUp.email({
					email,
					password,
					name: displayName.trim() || mxitId
				});
				if (error) throw new Error(error.message);
				setAccountReady(true);
			}
			await finishProfile();
		} catch (err) {
			sfx.error();
			toast.error(err instanceof Error ? err.message : "Sign-up failed");
		} finally {
			setBusy(false);
		}
	};
	const field = "h-11 rounded-xl border-white/15 bg-white/8 text-white placeholder:text-white/35 focus-visible:ring-cyan-300/40";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "qx-auth relative flex min-h-0 flex-1 flex-col overflow-y-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "qx-auth-orb qx-auth-orb-a",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "qx-auth-orb qx-auth-orb-b",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: mode === "signup" && step === "profile" && !needsProfile ? createAccount : handleAuth,
				className: "relative z-10 mx-auto flex w-full max-w-[420px] flex-col gap-4 px-5 pb-10 pt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "qx-logo-tile mb-3 flex h-14 w-14 items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/qx-mark.svg",
									alt: "",
									className: "h-9 w-9 object-contain"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-[28px] font-semibold tracking-tight text-white",
								children: APP_NAME
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[12px] font-medium uppercase tracking-[0.32em] text-cyan-200/70",
								children: APP_TAGLINE
							})
						]
					}),
					step === "auth" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex rounded-2xl border border-white/12 bg-black/25 p-1",
							children: ["login", "signup"].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setMode(m);
									setStep("auth");
									sfx.tap();
								},
								className: `flex-1 rounded-xl py-2.5 text-[13px] font-semibold capitalize transition ${mode === m ? "bg-white text-[#0A1B3D] shadow-sm" : "text-white/55 hover:text-white"}`,
								children: m === "login" ? "Sign in" : "Create account"
							}, m))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: oauthBusy !== null,
								onClick: () => oauth(p.providerId),
								className: "flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/8 text-sm font-medium text-white transition hover:bg-white/14 active:scale-[0.98] disabled:opacity-60",
								children: oauthBusy === p.providerId ? "Redirecting…" : `Continue with ${p.label}`
							}, p.providerId))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 py-0.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-white/12" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-[0.28em] text-white/35",
									children: "or email"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-white/12" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								className: "text-xs text-white/65",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								required: true,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "you@example.com",
								className: field
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "password",
								className: "text-xs text-white/65",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								type: "password",
								required: true,
								value: password,
								onChange: (e) => setPassword(e.target.value),
								placeholder: "••••••••",
								minLength: 6,
								className: field
							})]
						})
					] }),
					(needsProfile || mode === "signup" && step === "profile") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-semibold text-white",
								children: "Your QXio identity"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-white/50",
								children: "Your ID is unique and locked forever. Nobody else can take it."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-white/65",
									children: "QXio ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: mxitId,
										onChange: (e) => setMxitId(e.target.value.replace(/\s/g, "").toLowerCase()),
										placeholder: "cooldude_92",
										maxLength: 20,
										autoComplete: "off",
										className: `${field} pr-12`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2",
										children: [
											idStatus === "checking" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-white/50" }),
											idStatus === "ok" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-emerald-400" }),
											idStatus === "bad" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4 text-rose-400" })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-[11px] ${idStatus === "ok" ? "text-emerald-300/90" : idStatus === "bad" ? "text-rose-300" : "text-white/40"}`,
									children: idReason || "3–20 chars · letters, numbers, underscores"
								}),
								suggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1.5 pt-1",
									children: suggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setMxitId(s);
											sfx.tap();
										},
										className: "rounded-full border border-cyan-300/30 bg-cyan-400/10 px-2.5 py-1 text-[11px] text-cyan-100",
										children: s
									}, s))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs text-white/65",
								children: "Display name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								value: displayName,
								onChange: (e) => setDisplayName(e.target.value),
								placeholder: "Cool Dude",
								maxLength: 40,
								className: field
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs text-white/65",
								children: "Zone"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-1.5",
								children: ZONES.map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setZone(z.id);
										sfx.tap();
									},
									className: `rounded-xl border px-2 py-2 text-left transition ${zone === z.id ? "border-cyan-300/60 bg-cyan-400/15 text-white" : "border-white/12 bg-white/5 text-white/70"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[12px] font-semibold",
										children: z.short
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-[10px] opacity-70",
										children: z.label
									})]
								}, z.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs text-white/65",
								children: "Mood"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-5 gap-1.5",
								children: MOODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									title: m.label,
									onClick: () => {
										setMoodCode(m.code);
										sfx.tap();
									},
									className: `flex flex-col items-center gap-1 rounded-xl border px-1 py-2 ${moodCode === m.code ? "border-cyan-300/70 bg-cyan-400/15" : "border-white/12 bg-white/5"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoodIcon, {
										code: m.code,
										size: 28
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-[9px] text-white/70",
										children: m.label
									})]
								}, m.code))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs text-white/65",
								children: "Pick an avatar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-5 gap-2",
								children: AVATAR_SEEDS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setAvatarSeed(s);
										sfx.tap();
									},
									className: `rounded-xl p-1 tap-scale ${avatarSeed === s ? "bg-white/20 ring-1 ring-white/70" : "border border-white/12 bg-white/5"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelAvatar, {
										seed: s,
										size: 48
									})
								}, s))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-white/65",
									children: "Age"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 14,
									max: 120,
									value: age,
									onChange: (e) => setAge(e.target.value),
									className: field
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-white/65",
									children: "Gender"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: gender,
									onChange: (e) => setGender(e.target.value),
									className: "flex h-11 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-2 text-sm text-white",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											className: "bg-[#0A1B3D] text-white",
											children: "Prefer not to say"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "m",
											className: "bg-[#0A1B3D] text-white",
											children: "Male"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "f",
											className: "bg-[#0A1B3D] text-white",
											children: "Female"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "x",
											className: "bg-[#0A1B3D] text-white",
											children: "Other"
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs text-white/65",
									children: "Cell number (airtime SMS)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: phone,
									onChange: (e) => setPhone(e.target.value),
									placeholder: "082 123 4567",
									inputMode: "tel",
									className: field
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-white/40",
									children: "Optional. Lets texts ride GSM when there's no data — not pictures."
								})
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy || (needsProfile || mode === "signup" && step === "profile") && idStatus === "bad",
						className: "h-12 w-full rounded-xl bg-white text-[15px] font-semibold text-[#0A1B3D] hover:bg-white/92",
						children: busy ? "…" : mode === "login" ? "Sign in" : step === "auth" ? "Continue" : "Create my ID"
					}),
					mode === "signup" && step === "profile" && !needsProfile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: () => setStep("auth"),
						className: "w-full text-xs text-white/50 hover:bg-white/10 hover:text-white",
						children: "Back"
					}),
					!standalone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							className: "h-11 rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10",
							onClick: () => {
								sfx.tap();
								openPhoneInstall("ios");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-4 w-4" }), " iPhone"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							className: "h-11 rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10",
							onClick: () => {
								sfx.tap();
								openPhoneInstall("android");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabletSmartphone, { className: "h-4 w-4" }), " Android"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-center text-[10px] text-white/40",
						children: [
							"By continuing you agree to our",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/legal/terms",
								className: "underline hover:text-white",
								children: "Terms"
							}),
							" ",
							"and",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/legal/privacy",
								className: "underline hover:text-white",
								children: "Privacy Policy"
							}),
							"."
						]
					})
				]
			})
		]
	});
}
//#endregion
export { openPhoneInstall as i, Label as n, isStandaloneApp as r, AuthScreen as t };
