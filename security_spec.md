# Firestore Security Specifications

## 1. Data Invariants
- A `SavedScenario` must belong strictly to the user creating it (`userId` == `request.auth.uid`).
- A `SavedScenario` can only be read, created, or deleted by its owner.
- System fields like `createdAt` must match server timestamps.
- Values for country, notes, gsvVal, and itcVal must be strictly sized strings.

## 2. Dirty Dozen Payloads
1. Unauthorized Creation: Missing Auth token.
2. Identity Poisoning: Auth UID is `userA`, but payload `userId` is `userB`.
3. Size Exhaustion: `notes` string is 2MB long.
4. Type Mismatch: `year` is a string instead of a number.
5. Missing Fields: Payload missing `gsvVal`.
6. Phantom Fields: Payload contains unexpected `adminRole: true`.
7. Cross-User Read: `userA` attempts to read `userB`'s scenarios.
...

## 3. Test Runner
We will use rules tests to verify.
