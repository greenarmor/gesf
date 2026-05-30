# Managing Policy Packs

Policy packs are collections of compliance controls grouped by framework. GESF ships with 7 packs. You can list, install, and remove them.

## List Available Packs

```bash
ges policy list
```

Output:

```
  Available Policy Packs:

  gdpr            GDPR Compliance Pack
                  22 controls | saas, ai-application, mcp-server, ...

  owasp           OWASP ASVS Pack
                  6 controls | saas, ai-application, ...

  ai              AI System Pack
                  6 controls | ai-application, mcp-server

  blockchain      Blockchain Pack
                  6 controls | blockchain, wallet

  government      Government Pack
                  5 controls | government-system

  cis             CIS Controls Pack
                  5 controls | saas, healthcare-system, ...

  nist            NIST CSF Pack
                  6 controls | saas, healthcare-system, ...
```

## Install a Pack

Add a policy pack that wasn't installed during `ges init`:

```bash
ges policy install ai
```

Output:

```
  ✓ Installed policy pack: ai (6 controls)
```

This creates `controls/ai/controls.json` with all AI-specific controls.

## Remove a Pack

Remove a pack you no longer need:

```bash
ges policy remove blockchain
```

Output:

```
  ✓ Removed policy pack: blockchain
```

This deletes the `controls/blockchain/` directory.

## When to Install Extra Packs

| Scenario | Command |
|----------|---------|
| You started with a generic web app and now add AI features | `ges policy install ai` |
| Your SaaS expands to serve government clients | `ges policy install government` |
| You're building a wallet feature into your app | `ges policy install blockchain` |
| You accidentally removed a pack | `ges policy install gdpr` |

!!! example "Exercise: Install and Remove Packs"

    1. Initialize a new project:

    ```bash
    mkdir /tmp/pack-test && cd /tmp/pack-test
    echo '{"name":"pack-test"}' > package.json
    ges init -n "Pack Test" -t generic-web-application -f "GDPR,OWASP"
    ls controls/
    ```

    2. Install the AI pack:

    ```bash
    ges policy install ai
    ls controls/
    cat controls/ai/controls.json | head -20
    ```

    3. Install the Blockchain pack:

    ```bash
    ges policy install blockchain
    ls controls/
    ```

    4. Remove the Blockchain pack:

    ```bash
    ges policy remove blockchain
    ls controls/
    ```

    5. Verify only `gdpr`, `owasp`, `cis`, and `ai` remain

!!! example "Exercise: Explore Control Definitions"

    Pick a control pack and read through its controls:

    ```bash
    # Pretty-print the GDPR controls
    cat controls/gdpr/controls.json | python3 -m json.tool | head -50
    ```

    For each control, identify:
    - The control ID (e.g., `GDPR-ART32-002`)
    - The GDPR article it maps to
    - The severity level
    - The check items (what the scanner looks for)
    - The implementation guidance

    !!! question "Questions"
        - How many GDPR Article 32 controls are there?
        - Which control has the most check items?
        - Which controls would apply to a database-heavy application?
