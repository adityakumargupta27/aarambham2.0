import type { IncomingMessage, ServerResponse } from "node:http";

type RequestWithBody = IncomingMessage & { body?: unknown };

function send(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

async function readJson(req: RequestWithBody): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === "object") return req.body as Record<string, unknown>;
  let raw = "";
  for await (const chunk of req) raw += chunk;
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}

export default async function handler(req: RequestWithBody, res: ServerResponse) {
  const url = new URL(req.url || "/", "https://aarambham.local");
  const path = url.pathname.replace(/^\/api/, "");
  const query = url.searchParams;

  if (req.method === "GET" && path === "/v1/health") {
    return send(res, 200, { status: "healthy", timestamp: new Date().toISOString(), version: "1.0.0" });
  }
  const data = await import("../server/data");
  if (req.method === "GET" && path === "/v1/overview/metrics") return send(res, 200, data.SERVER_OVERVIEW_METRICS);
  if (req.method === "GET" && path === "/v1/datasources") return send(res, 200, data.SERVER_DATASOURCES);
  if (req.method === "GET" && path === "/v1/constituencies") {
    const q = (query.get("q") || "").toLowerCase();
    const state = query.get("state") || "";
    const surplus = query.get("surplus") === "true";
    return send(res, 200, data.SERVER_CONSTITUENCIES.filter((item) =>
      (!q || item.constituency.toLowerCase().includes(q) || item.mpName.toLowerCase().includes(q)) &&
      (!state || state === "All" || item.state === state) &&
      (!surplus || item.status === "High Accumulation" || item.status === "Accumulation Watch")
    ));
  }
  if (req.method === "GET" && path === "/v1/rajya-sabha") return send(res, 200, data.SERVER_RAJYA_SABHA);
  if (req.method === "GET" && path === "/v1/all-mps") return send(res, 200, [...data.SERVER_CONSTITUENCIES, ...data.SERVER_RAJYA_SABHA]);
  if (req.method === "GET" && path === "/v1/projects") return send(res, 200, data.SERVER_PROJECTS);
  if (req.method === "GET" && path === "/v1/tenders") return send(res, 200, data.SERVER_TENDERS);
  if (req.method === "GET" && path === "/v1/contracts") return send(res, 200, data.SERVER_CONTRACTS);
  if (req.method === "GET" && path === "/v1/contractors") return send(res, 200, data.SERVER_CONTRACTORS);
  if (req.method === "GET" && path === "/v1/investigations") return send(res, 200, data.SERVER_INVESTIGATIONS);
  if (req.method === "POST" && path === "/v1/ai/query") {
    const body = await readJson(req);
    const { processGroundedQuery } = await import("../server/aiInvestigator");
    return send(res, 200, await processGroundedQuery(typeof body.question === "string" ? body.question : ""));
  }
  return send(res, 404, { error: "Not found" });
}
