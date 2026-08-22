import { nid } from "@/lib/utils";
import type { MsgChannel } from "@/lib/mxit/types";

export type AirtimeQueued = {
  id: string;
  convId: string;
  content: string;
  createdAt: string;
  channel?: Extract<MsgChannel, "sms" | "gprs">;
};

const KEY = "qxio-airtime-queue-v1";

function read(): AirtimeQueued[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AirtimeQueued[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: AirtimeQueued[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, 80)));
  } catch {
    /* quota */
  }
}

export function enqueueAirtime(
  item: Omit<AirtimeQueued, "id" | "createdAt"> & { id?: string },
) {
  const row: AirtimeQueued = {
    id: item.id || nid(),
    convId: item.convId,
    content: item.content,
    createdAt: new Date().toISOString(),
    channel: item.channel || "sms",
  };
  write([...read(), row]);
  return row;
}

export function pendingAirtime() {
  return read();
}

export async function flushAirtimeQueue(send: (item: AirtimeQueued) => Promise<void>) {
  const items = read();
  if (!items.length) return 0;
  const kept: AirtimeQueued[] = [];
  let flushed = 0;
  for (const item of items) {
    try {
      await send(item);
      flushed += 1;
    } catch {
      kept.push(item);
    }
  }
  write(kept);
  return flushed;
}
