# Manual CI/CD Setup

For GitLab CI, CircleCI, Jenkins, or any CI system that supports Node.js.

## GitLab CI

```yaml
compliance:
  stage: test
  image: node:22
  before_script:
    - npm install -g @greenarmor/ges
  script:
    - ges audit --ci
    - ges score --ci
  artifacts:
    paths:
      - reports/
```

## CircleCI

```yaml
jobs:
  compliance:
    docker:
      - image: cimg/node:22
    steps:
      - checkout
      - run: npm install -g @greenarmor/ges
      - run: ges audit --ci
      - run: ges report --format markdown --output reports/compliance.md
      - store_artifacts:
          path: reports
```

## Jenkins

```groovy
pipeline {
  agent any
  stages {
    stage('Compliance') {
      steps {
        sh 'npm install -g @greenarmor/ges'
        sh 'ges audit --ci'
        sh 'ges report --format markdown --output reports/compliance.md'
      }
      post {
        always {
          archiveArtifacts artifacts: 'reports/**', allowEmptyArchive: true
        }
      }
    }
  }
}
```

## Generic Shell

For any CI system:

```bash
npm install -g @greenarmor/ges
ges audit --ci
ges score --ci
ges report --format markdown --output reports/compliance.md
```

## Recommended Pipeline Structure

```text
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Build       │───►│  Test        │───►│  Compliance  │───►│  Deploy      │
│              │    │              │    │              │    │              │
│  npm build   │    │  npm test    │    │  ges audit   │    │  (only if    │
│              │    │              │    │  ges scan    │    │   all pass)  │
└──────────────┘    └──────────────┘    │  ges report  │    └──────────────┘
                                        └──────────────┘
```

Place the compliance stage **before** deployment so that critical findings block releases.

!!! example "Exercise: Add GESF to Your CI Pipeline"

    1. Choose your CI system from the examples above
    2. Add the compliance stage to your pipeline config
    3. Push a commit that triggers the pipeline
    4. Verify the compliance stage runs and reports findings
    5. Intentionally introduce a vulnerability and verify the pipeline fails

!!! example "Exercise: Generate Reports in CI"

    Add report generation to your CI pipeline and store the results as artifacts:

    ```bash
    # In your CI script
    ges audit --ci --json > reports/audit-results.json
    ges report -f markdown -o reports/compliance.md
    ges report -f html -o reports/compliance.html
    ```

    This gives you:
    - Machine-readable results (`audit-results.json`)
    - Developer-friendly report (`compliance.md`)
    - Stakeholder-friendly report (`compliance.html`)
