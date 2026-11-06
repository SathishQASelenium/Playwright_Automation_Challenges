/**
 * MoneyUtil - parses the signed transaction amounts shown on the Applitools
 * dashboard and separates earned money from spent money.
 *
 * Input format: "+ 1,250 USD", "+ 952.23 USD", "- 320 USD".
 *
 *   const summary = summarizeAmounts(['+ 1,250 USD', '- 320 USD']);
 *   summary.earned // 1250
 *   summary.spent  // 320 (absolute value of the negative amounts)
 *   summary.net    // 930 (earned - spent)
 *
 * The demo dashboard's signed amounts net to 1996.22, which is the total the
 * challenge asks us to verify.
 */

export type MoneyDirection = 'earned' | 'spent';

export interface ParsedAmount {
    raw: string;
    amount: number;
    direction: MoneyDirection;
}

export interface MoneySummary {
    /** Sum of all positive amounts. */
    earned: number;
    /** Sum of the absolute value of all negative amounts. */
    spent: number;
    /** earned - spent, i.e. the signed total of every transaction. */
    net: number;
    transactions: ParsedAmount[];
}

const AMOUNT_PATTERN = /^([+-])?\s*([\d,]+(?:\.\d+)?)\s*(?:USD)?$/i;

function roundToCents(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function parseAmount(raw: string): ParsedAmount {
    const normalized = raw.replace(/\s+/g, ' ').trim();
    const match = AMOUNT_PATTERN.exec(normalized);

    if (!match) {
        throw new Error(`Unable to parse transaction amount: "${raw}"`);
    }

    const [, sign, digits] = match;
    const value = Number(digits.replace(/,/g, ''));

    if (!Number.isFinite(value)) {
        throw new Error(`Transaction amount is not a number: "${raw}"`);
    }

    const amount = sign === '-' ? -value : value;

    return {
        raw,
        amount,
        direction: amount < 0 ? 'spent' : 'earned',
    };
}

export function summarizeAmounts(rawAmounts: string[]): MoneySummary {
    if (rawAmounts.length === 0) {
        throw new Error('No transaction amounts to summarize');
    }

    const transactions = rawAmounts.map(parseAmount);

    const earned = roundToCents(
        transactions
            .filter((transaction) => transaction.direction === 'earned')
            .reduce((sum, transaction) => sum + transaction.amount, 0),
    );

    const spent = roundToCents(
        transactions
            .filter((transaction) => transaction.direction === 'spent')
            .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0),
    );

    return {
        earned,
        spent,
        net: roundToCents(earned - spent),
        transactions,
    };
}
