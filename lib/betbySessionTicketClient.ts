import {
  defaultMockSessionTicketRequest,
  extractSessionTicketFromResponse,
  mockSessionTicketRequestHeaders,
  type MockSessionTicketResponse,
} from "@/lib/mockBetbySession";

const BETBY_SESSION_TICKET_STORAGE_KEY = "betby:sports:session-ticket";

interface SessionTicketProxyError {
  code?: number;
  message?: string;
  error?: string;
  upstreamUrl?: string;
}

interface StoredBetbySessionTicketState {
  error: string;
  sessionTicket: string;
  updatedAt: number;
}

let inflightSessionTicketPromise: Promise<string> | null = null;
let inMemorySessionTicketState: StoredBetbySessionTicketState | null = null;

function persistSessionTicketState(state: StoredBetbySessionTicketState) {
  inMemorySessionTicketState = state;

  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(
      BETBY_SESSION_TICKET_STORAGE_KEY,
      JSON.stringify(state),
    );
  } catch (error) {
    console.error("[betby-sdk] failed to persist sessionTicket state", error);
  }
}

export function readBetbySessionTicketState() {
  if (inMemorySessionTicketState) {
    return inMemorySessionTicketState;
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(BETBY_SESSION_TICKET_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as StoredBetbySessionTicketState;

    inMemorySessionTicketState = parsed;
    return parsed;
  } catch (error) {
    console.error("[betby-sdk] failed to read sessionTicket state", error);
    return null;
  }
}

export function clearBetbySessionTicketState(options?: {
  preserveInMemory?: boolean;
}) {
  if (!options?.preserveInMemory) {
    inMemorySessionTicketState = null;
  }

  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.removeItem(BETBY_SESSION_TICKET_STORAGE_KEY);
  } catch (error) {
    console.error("[betby-sdk] failed to clear sessionTicket state", error);
  }
}

export async function fetchBetbySessionTicketOnClient() {
  if (inflightSessionTicketPromise) {
    return inflightSessionTicketPromise;
  }

  inflightSessionTicketPromise = fetch(
    "/bus-api/business/oauth/create/sessionTicket",
    {
      method: "POST",
      headers: mockSessionTicketRequestHeaders,
      body: JSON.stringify(defaultMockSessionTicketRequest),
      cache: "no-store",
    },
  )
    .then(async (response) => {
      if (!response.ok) {
        let details = `Failed to fetch sessionTicket: ${response.status}`;

        try {
          const errorPayload = (await response.json()) as SessionTicketProxyError;
          const parts = [
            errorPayload.message,
            errorPayload.error,
            errorPayload.upstreamUrl
              ? `upstream=${errorPayload.upstreamUrl}`
              : "",
          ].filter(Boolean);

          if (parts.length > 0) {
            details = parts.join(" | ");
          }
        } catch {
          const fallbackText = await response.text();

          if (fallbackText) {
            details = `${details} | ${fallbackText}`;
          }
        }

        throw new Error(details);
      }

      const data = (await response.json()) as MockSessionTicketResponse;
      const sessionTicket = extractSessionTicketFromResponse(data);

      persistSessionTicketState({
        error: "",
        sessionTicket,
        updatedAt: Date.now(),
      });

      return sessionTicket;
    })
    .catch((error) => {
      const message =
        error instanceof Error ? error.message : "Unknown sessionTicket error";

      persistSessionTicketState({
        error: message,
        sessionTicket: "",
        updatedAt: Date.now(),
      });

      throw error;
    })
    .finally(() => {
      inflightSessionTicketPromise = null;
    });

  return inflightSessionTicketPromise;
}
