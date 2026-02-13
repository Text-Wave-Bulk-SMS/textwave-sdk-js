/**
 * TextWave SMS API SDK
 *
 * Official JavaScript/TypeScript SDK for the TextWave Bulk SMS API.
 *
 * @example
 * ```typescript
 * import { TextWave } from 'textwave-sdk';
 *
 * const client = new TextWave('your_api_key');
 * await client.sendSms('254712345678', 'Hello!');
 * ```
 *
 * @see https://textwave.co.ke
 */
interface SendSmsOptions {
    /** Phone number(s) in international format (e.g., '254712345678') */
    to: string | string[];
    /** SMS message content (max 1600 characters) */
    message: string;
    /** Custom sender ID (max 11 characters, alphanumeric) */
    senderId?: string;
}
interface SendSmsResult {
    phone: string;
    status: 'sent' | 'failed' | 'queued';
    messageId?: string;
    error?: string;
}
interface SendSmsResponse {
    status: 'complete' | 'partial' | 'failed';
    message: string;
    data: {
        totalSent: number;
        totalFailed: number;
        creditsUsed: number;
        results: SendSmsResult[];
    };
}
interface Message {
    id: string;
    phone: string;
    message: string;
    status: 'pending' | 'sent' | 'delivered' | 'failed';
    senderId: string;
    channel: 'web' | 'api';
    smsCount: number;
    cost: number;
    createdAt: string;
    sentAt?: string;
    deliveredAt?: string;
}
interface HistoryOptions {
    page?: number;
    limit?: number;
    status?: 'sent' | 'delivered' | 'failed' | 'pending';
}
interface HistoryResponse {
    status: 'success';
    data: {
        messages: Message[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}
interface WalletBalance {
    smsCredits: number;
    totalCreditsUsed: number;
}
interface BalanceResponse {
    status: 'success';
    data: WalletBalance;
}
interface Transaction {
    id: string;
    type: 'credit' | 'debit';
    smsCredits: number;
    creditsAfter: number;
    description: string;
    createdAt: string;
}
interface TransactionsResponse {
    status: 'success';
    data: {
        transactions: Transaction[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}
interface TextWaveError extends Error {
    code?: string;
    status?: number;
}
declare class TextWave {
    private apiKey;
    private baseUrl;
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
    constructor(apiKey: string, baseUrl?: string);
    /**
     * Make an authenticated request to the TextWave API
     */
    private request;
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
    sendSms(to: string | string[], message: string, senderId?: string): Promise<SendSmsResponse>;
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
    getHistory(options?: HistoryOptions): Promise<HistoryResponse>;
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
    getBalance(): Promise<BalanceResponse>;
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
    getTransactions(page?: number, limit?: number): Promise<TransactionsResponse>;
}

export { type BalanceResponse, type HistoryOptions, type HistoryResponse, type Message, type SendSmsOptions, type SendSmsResponse, type SendSmsResult, TextWave, type TextWaveError, type Transaction, type TransactionsResponse, type WalletBalance, TextWave as default };
