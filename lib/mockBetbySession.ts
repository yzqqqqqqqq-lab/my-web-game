export interface MockSessionTicketRequest {
  business_user_id?: string;
  business_user_token?: string;
  currency_type?: string;
  exchange_rate?: number;
  biz_business_info?: Record<string, unknown>;
  account_info?: Record<string, unknown>;
  connection_info?: Record<string, unknown>;
}

export const mockSessionTicketRequestHeaders = {
  Accept: "*/*",
  "s-business-id": "7886390001",
  "s-product-id": "9590",
  "s-skip-crypto": "true",
  "Content-Type": "application/json",
} as const;

export interface MockSessionTicketResponse {
  code: number;
  message: string;
  data: {
    mock: true;
    sessionTicket: string;
    session_ticket: string;
    expiresIn: number;
    currencyType: string;
    businessUserId: string;
    createdAt: string;
  };
}

export const defaultMockSessionTicketRequest: MockSessionTicketRequest = {
  business_user_id: "10187",
  business_user_token: "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VyX2lkIjo0NTkxLCJ",
  currency_type: "USD",
  exchange_rate: 100,
  biz_business_info: {},
  account_info: {
    create_time: "",
    role: "PRIVATE",
    birthday: "1990-01-01",
    email: "example@email.com",
    phone: "15601691300",
    area_code: "+86",
    first_name: "张",
    last_name: "三",
    vip_level: 0,
    register_time: "",
    adgroup: "1",
    adset: "1",
  },
  connection_info: {
    user_agent: "Mozilla/5.0",
    device_id: "device12345",
    ip: "192.168.1.1",
    country: "CN",
    state: "CA",
    zip_code: "518000",
    media_source: "渠道A",
    campaign: "子渠道B",
    package_name: "com.snail.sport",
    version_code: 100,
    mobile_app_version: "v1.0",
    mobile_device_brand: "md",
    sm_id: "111",
    os: "2",
    language: "en-US",
    initial_country: "US",
    hot_version_code: 1,
    channel: "Google Play",
    user_channel: "应用市场",
    sn_support_language: "zh,en,ja",
    android_id: "9774d56d682e549c",
    google_aid: "38400000-8cf0-11bd-b23e-10b96e40000d",
    net: "WIFI",
    install_days: 15,
    install_time: "",
    dpi: 420,
    screen_width: 1080,
    screen_height: 2400,
    trace_id: "trace_123456",
  },
};

export function extractSessionTicketFromResponse(
  response: MockSessionTicketResponse,
) {
  return response?.data?.sessionTicket || response?.data?.session_ticket || "";
}

function buildSessionTicketSeed(payload: MockSessionTicketRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  return `${payload.business_user_id ?? "guest"}${payload.currency_type ?? "USD"}${nonce}`;
}

export function createMockSessionTicketResponse(
  payload: MockSessionTicketRequest = defaultMockSessionTicketRequest,
): MockSessionTicketResponse {
  const sessionTicket = buildSessionTicketSeed(payload);

  return {
    code: 0,
    message: "ok",
    data: {
      mock: true,
      sessionTicket,
      session_ticket: sessionTicket,
      expiresIn: 3600,
      currencyType: payload.currency_type ?? "USD",
      businessUserId: payload.business_user_id ?? "guest",
      createdAt: new Date().toISOString(),
    },
  };
}
