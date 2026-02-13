"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  TextWave: () => TextWave,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var TextWave = class {
  /**
   * Create a new TextWave client
   * 
   * @param apiKey - Your TextWave API key (get it from dashboard → Settings → API Keys)
   * @param baseUrl - API base URL (default: https://api.textwave.co.ke/v1)
   * 
   * @example
   * ```typescript
   * const client = new TextWave('tw_xxxxxxxxxxxxxxxx');
   * ```
   */
  constructor(apiKey, baseUrl = "https://api.textwave.co.ke/v1") {
    if (!apiKey) {
      throw new Error("API key is required. Get one at https://textwave.co.ke");
    }
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }
  /**
   * Make an authenticated request to the TextWave API
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Authorization": `ApiKey ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers
      }
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || "API request failed");
      error.code = data.code;
      error.status = response.status;
      throw error;
    }
    return data;
  }
  /**
   * Send SMS to one or more phone numbers
   * 
   * @param to - Phone number(s) in international format
   * @param message - SMS message content (max 1600 chars)
   * @param senderId - Optional custom sender ID (max 11 chars)
   * @returns Send results with delivery status
   * 
   * @example
   * ```typescript
   * // Single recipient
   * await client.sendSms('254712345678', 'Hello from TextWave!');
   * 
   * // Multiple recipients
   * await client.sendSms(
   *   ['254712345678', '254723456789'],
   *   'Bulk message to everyone!'
   * );
   * 
   * // With custom sender ID
   * await client.sendSms('254712345678', 'Hello!', 'MyBrand');
   * ```
   */
  async sendSms(to, message, senderId) {
    const body = { to, message };
    if (senderId) {
      body.senderId = senderId;
    }
    return this.request("/sms/send", {
      method: "POST",
      body: JSON.stringify(body)
    });
  }
  /**
   * Get message history
   * 
   * @param options - Query options (page, limit, status filter)
   * @returns Paginated message history
   * 
   * @example
   * ```typescript
   * // Get first page
   * const history = await client.getHistory();
   * 
   * // With pagination and filter
   * const delivered = await client.getHistory({
   *   page: 2,
   *   limit: 50,
   *   status: 'delivered'
   * });
   * ```
   */
  async getHistory(options = {}) {
    const params = new URLSearchParams();
    if (options.page) params.set("page", String(options.page));
    if (options.limit) params.set("limit", String(options.limit));
    if (options.status) params.set("status", options.status);
    const query = params.toString() ? `?${params}` : "";
    return this.request(`/sms/history${query}`);
  }
  /**
   * Get wallet balance and SMS credits
   * 
   * @returns Current SMS credit balance
   * 
   * @example
   * ```typescript
   * const balance = await client.getBalance();
   * console.log(`Credits: ${balance.data.smsCredits}`);
   * ```
   */
  async getBalance() {
    return this.request("/wallet/balance");
  }
  /**
   * Get transaction history
   * 
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 20)
   * @returns Paginated transaction history
   * 
   * @example
   * ```typescript
   * const transactions = await client.getTransactions(1, 10);
   * transactions.data.transactions.forEach(tx => {
   *   console.log(`${tx.type}: ${tx.smsCredits} SMS`);
   * });
   * ```
   */
  async getTransactions(page = 1, limit = 20) {
    return this.request(`/wallet/transactions?page=${page}&limit=${limit}`);
  }
};
var index_default = TextWave;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TextWave
});
