import {
  defaultMockSessionTicketRequest,
  extractSessionTicketFromResponse,
  mockSessionTicketRequestHeaders,
  type MockSessionTicketResponse,
  type MockSessionTicketRequest,
} from "@/lib/mockBetbySession";

const upstreamUrl =
  process.env.BETBY_SESSION_TICKET_API_URL ??
  "https://spm-test.kingsna.com/bus-api/business/oauth/create/sessionTicket";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestId = crypto.randomUUID().slice(0, 8);
  let body: MockSessionTicketRequest = defaultMockSessionTicketRequest;

  try {
    const parsedBody = (await request.json()) as MockSessionTicketRequest;
    body = {
      ...defaultMockSessionTicketRequest,
      ...parsedBody,
    };
  } catch {
    body = defaultMockSessionTicketRequest;
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: "POST",
      headers: mockSessionTicketRequestHeaders,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const responseText = await upstreamResponse.text();
    const contentType =
      upstreamResponse.headers.get("content-type") ?? "application/json";

    try {
      const responseJson = JSON.parse(responseText) as MockSessionTicketResponse;
      const sessionTicket = extractSessionTicketFromResponse(responseJson);
      console.log("[sessionTicket proxy]", {
        requestId,
        status: upstreamResponse.status,
        upstreamUrl,
        sessionTicket,
      });
    } catch {
      console.log("[sessionTicket proxy]", {
        requestId,
        status: upstreamResponse.status,
        upstreamUrl,
        responseText,
      });
    }

    return new Response(responseText, {
      status: upstreamResponse.status,
      headers: {
        "content-type": contentType,
        "x-session-ticket-request-id": requestId,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown upstream error";

    console.error("[sessionTicket proxy]", {
      requestId,
      upstreamUrl,
      error: message,
    });

    return Response.json(
      {
        code: 502,
        message: "Failed to proxy sessionTicket request",
        error: message,
        upstreamUrl,
      },
      {
        status: 502,
        headers: {
          "x-session-ticket-request-id": requestId,
        },
      },
    );
  }
}
