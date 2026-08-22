export async function compressImage(file: File, maxEdge = 480): Promise<string> {
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
  const data = canvas.toDataURL("image/jpeg", 0.72);
  if (data.length > 380_000) {
    return canvas.toDataURL("image/jpeg", 0.5);
  }
  return data;
}

export function voiceSupported() {
  return typeof window !== "undefined" && typeof MediaRecorder !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
}

export async function startVoiceNote(): Promise<{
  stop: () => Promise<string>;
  cancel: () => void;
}> {
  if (!voiceSupported()) throw new Error("Voice notes need a mic");
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
    ? "audio/webm;codecs=opus"
    : MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : "";
  const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
  const chunks: BlobPart[] = [];
  rec.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data);
  };
  rec.start();
  const stopTracks = () => stream.getTracks().forEach((t) => t.stop());
  return {
    cancel: () => {
      try {
        rec.stop();
      } catch {
        /* */
      }
      stopTracks();
    },
    stop: () =>
      new Promise((resolve, reject) => {
        rec.onstop = async () => {
          stopTracks();
          try {
            const blob = new Blob(chunks, { type: rec.mimeType || "audio/webm" });
            if (blob.size < 200) throw new Error("Too short");
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(new Error("Could not save voice note"));
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
      }),
  };
}
