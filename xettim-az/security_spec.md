# Security Specification - xettim.az

## Data Invariants
1. A number must have a valid Azerbaijani prefix (010, 050, 051, 055, 070, 077, 099).
2. `full_number` must be exactly 10 digits and start with 0.
3. Prices must be positive numbers.
4. Only admins can create, update, or delete numbers.
5. Public can read all numbers.
6. Admins are defined in the `admins` collection by their UID.

## The Dirty Dozen (Attack Vectors)
1. **Unauthenticated Write**: An anonymous user attempts to create a new number.
2. **Authenticated Non-Admin Write**: A signed-in user (not in `admins`) attempts to delete a number.
3. **Price Poisoning**: An admin attempts to set a price to -500.
4. **Prefix Injection**: Attempting to set prefix to "999".
5. **ID Spoofing**: Attempting to create a document where the `id` field doesn't match the document ID. (Wait, Firestore doesn't strictly enforce this unless we write a rule for it).
6. **Ghost Field Injection**: Adding `isPromoted: true` to a number update.
7. **Role Escalation**: A normal user attempts to add themselves to the `admins` collection.
8. **Invalid Format**: Setting `full_number` to "123" (too short).
9. **Status Bypass**: Changing a sold number back to available (terminal state check - if applicable, but here admin might need to revert, so we should consider if we need terminal state locking for the *public*).
10. **Admin Identity Theft**: User A tries to modify User B's admin record.
11. **Denial of Wallet**: Attempting to write a 1MB string into the `full_number` field.
12. **Query Scraping**: Attempting to list all numbers with an insecure rule (though listing all public numbers is usually intended here).

## Test Runner Logic
Testing will be handled by `firestore.rules`.
