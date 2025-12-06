export function mapTransactionRows(transactions: any[]) {
  if (!transactions || transactions.length === 0) return [];

  return transactions.map((t) => ({
    Date: t.date,
    Customer: t.customerName,
    Freelancer: t.freelancer,
    Debit: t.debit,
    Credit: t.credit,
    Fee: t.fee,
    Net: t.net,
    Bank: t.bank_name,
    "Account Number": t.account_number,
    Status: t.status,
    Reference: t.ref,
  }));
}
