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

export interface SendSmsOptions {
    /** Phone number(s) in international format (e.g., '254712345678') */
    to: string | string[];
    /** SMS message content (max 1600 characters) */
    message: string;
    /** Custom sender ID (max 11 characters, alphanumeric) */
    senderId?: string;
}

export interface SendSmsResult {
    phone: string;
    status: 'sent' | 'failed' | 'queued';
    messageId?: string;
    error?: string;
}

export interface SendSmsResponse {
    status: 'complete' | 'partial' | 'failed';
    message: string;
    data: {
        totalSent: number;
        totalFailed: number;
        creditsUsed: number;
        results: SendSmsResult[];
    };
}

export interface Message {
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

export interface HistoryOptions {
    page?: number;
    limit?: number;
    status?: 'sent' | 'delivered' | 'failed' | 'pending';
}

export interface HistoryResponse {
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

export interface WalletBalance {
    smsCredits: number;
    totalCreditsUsed: number;
}

export interface BalanceResponse {
    status: 'success';
    data: WalletBalance;
}

export interface Transaction {
    id: string;
    type: 'credit' | 'debit';
    smsCredits: number;
    creditsAfter: number;
    description: string;
    createdAt: string;
}

export interface TransactionsResponse {
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

export interface TextWaveError extends Error {
    code?: string;
    status?: number;
}

export class TextWave {
    private apiKey: string;
    private baseUrl: string;

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
    constructor(apiKey: string, baseUrl: string = 'https://api.textwave.co.ke/v1') {
        if (!apiKey) {
            throw new Error('API key is required. Get one at https://textwave.co.ke');
        }
        this.apiKey = apiKey;
        this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    }

    /**
     * Make an authenticated request to the TextWave API
     */
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `ApiKey ${this.apiKey}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.message || 'API request failed') as TextWaveError;
            error.code = data.code;
            error.status = response.status;
            throw error;
        }

        return data as T;
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
    async sendSms(to: string | string[], message: string, senderId?: string): Promise<SendSmsResponse> {
        const body: SendSmsOptions = { to, message };
        if (senderId) {
            body.senderId = senderId;
        }

        return this.request<SendSmsResponse>('/sms/send', {
            method: 'POST',
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
    async getHistory(options: HistoryOptions = {}): Promise<HistoryResponse> {
        const params = new URLSearchParams();
        if (options.page) params.set('page', String(options.page));
        if (options.limit) params.set('limit', String(options.limit));
        if (options.status) params.set('status', options.status);

        const query = params.toString() ? `?${params}` : '';
        return this.request<HistoryResponse>(`/sms/history${query}`);
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
    async getBalance(): Promise<BalanceResponse> {
        return this.request<BalanceResponse>('/wallet/balance');
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
    async getTransactions(page: number = 1, limit: number = 20): Promise<TransactionsResponse> {
        return this.request<TransactionsResponse>(`/wallet/transactions?page=${page}&limit=${limit}`);
    }
}

// Default export
export default TextWave;
