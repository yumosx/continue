# Build Dependencies & Secrets

Secrets and environment variables used by the JetBrains / IntelliJ plugin CI.

---

## JetBrains Extension

| Secret                           | Purpose                                                               | Referenced In            |
| -------------------------------- | --------------------------------------------------------------------- | ------------------------ |
| `APPLE_CERT_DATA`                | Base64-encoded Apple signing certificate (p12) for macOS code signing | `jetbrains-release.yaml` |
| `APPLE_CERT_PASSWORD`            | Password for the Apple signing certificate                            | `jetbrains-release.yaml` |
| `APPLE_NOTARY_USER`              | Apple notarization username (currently commented out)                 | `jetbrains-release.yaml` |
| `APPLE_NOTARY_PASSWORD`          | Apple notarization password (currently commented out)                 | `jetbrains-release.yaml` |
| `JETBRAINS_PUBLISH_TOKEN`        | Token for publishing to JetBrains Marketplace                         | `jetbrains-release.yaml` |
| `JETBRAINS_CERTIFICATE_CHAIN`    | Certificate chain for signing the JetBrains plugin                    | `jetbrains-release.yaml` |
| `JETBRAINS_PRIVATE_KEY`          | Private key for signing the JetBrains plugin                          | `jetbrains-release.yaml` |
| `JETBRAINS_PRIVATE_KEY_PASSWORD` | Password for the JetBrains signing private key                        | `jetbrains-release.yaml` |

---

## AI Provider API Keys (Testing)

Used for integration tests in PR checks.

| Secret                                | Purpose                                | Referenced In    |
| ------------------------------------- | -------------------------------------- | ---------------- |
| `OPENAI_API_KEY`                      | OpenAI API key                         | `pr-checks.yaml` |
| `ANTHROPIC_API_KEY`                   | Anthropic API key                      | `pr-checks.yaml` |
| `GEMINI_API_KEY`                      | Google Gemini API key                  | `pr-checks.yaml` |
| `MISTRAL_API_KEY`                     | Mistral API key                        | `pr-checks.yaml` |
| `AZURE_OPENAI_API_KEY`                | Azure OpenAI API key                   | `pr-checks.yaml` |
| `AZURE_FOUNDRY_CODESTRAL_API_KEY`     | Azure AI Foundry Codestral API key     | `pr-checks.yaml` |
| `AZURE_FOUNDRY_MISTRAL_SMALL_API_KEY` | Azure AI Foundry Mistral Small API key | `pr-checks.yaml` |
| `AZURE_OPENAI_GPT41_API_KEY`          | Azure OpenAI GPT-4.1 API key           | `pr-checks.yaml` |
| `VOYAGE_API_KEY`                      | Voyage AI embeddings API key           | `pr-checks.yaml` |
| `RELACE_API_KEY`                      | Relace API key                         | `pr-checks.yaml` |
| `INCEPTION_API_KEY`                   | Inception API key                      | `pr-checks.yaml` |

---

## CI/CD & GitHub

| Secret            | Purpose                                  | Referenced In            |
| ----------------- | ---------------------------------------- | ------------------------ |
| `GITHUB_TOKEN`    | Default GitHub Actions token (automatic) | Many workflows           |
| `CI_GITHUB_TOKEN` | Elevated GitHub PAT for CI operations    | `jetbrains-release.yaml` |

Workflow files live under `.github/workflows/`.
