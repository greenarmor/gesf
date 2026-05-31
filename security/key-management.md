# Key Management Policy - gesf

## Approved Algorithms

- **Symmetric Encryption**: AES-256-GCM, ChaCha20-Poly1305
- **Asymmetric Encryption**: RSA-4096, Ed25519
- **Hashing**: SHA-256, SHA-384, SHA-512
- **Password Hashing**: Argon2id (recommended), bcrypt

## Key Lifecycle

1. **Generation**: Use cryptographically secure random generators
2. **Distribution**: Via secure key management system
3. **Storage**: Encrypted at rest, access controlled
4. **Rotation**: Regular rotation schedule (90 days minimum)
5. **Revocation**: Immediate revocation capability
6. **Destruction**: Secure deletion with verification

## Key Storage

- [ ] HashiCorp Vault
- [ ] AWS KMS
- [ ] Azure Key Vault
- [ ] GCP Secret Manager

## Rotation Schedule

| Key Type | Rotation Period |
|----------|----------------|
| Encryption keys | 90 days |
| API keys | 180 days |
| TLS certificates | 90 days (auto-renew) |
| Database credentials | 90 days |
