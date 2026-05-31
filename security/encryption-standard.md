# Encryption Standard - gesf

## Approved Algorithms

### Data at Rest
- **Primary**: AES-256-GCM
- **Alternative**: ChaCha20-Poly1305

### Data in Transit
- **Preferred**: TLS 1.3
- **Minimum**: TLS 1.2
- **Prohibited**: TLS 1.0, TLS 1.1, SSL

### Password Hashing
- **Required**: Argon2id
- **Parameters**: memory=65536, iterations=3, parallelism=4
- **Prohibited**: MD5, SHA1, plain text

### Key Hashing
- SHA-256 minimum
- HMAC for message authentication

## Implementation Requirements

- [ ] All databases encrypted at rest
- [ ] All file storage encrypted
- [ ] All API communications over TLS 1.2+
- [ ] All backups encrypted
- [ ] HSTS headers configured
- [ ] Certificate pinning for mobile clients
