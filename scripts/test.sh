#!/usr/bin/env bash
set -euo pipefail

echo "🔨 Testing production bundle"
npm run test
echo "✅ Tests complete. You can preview locally with npm run start"
