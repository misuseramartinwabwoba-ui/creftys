#!/bin/bash
mkdir -p packages/$1/src
echo "export * from './$1';" > packages/$1/src/index.ts
echo "export const $1 = {};" > packages/$1/src/$1.ts
echo "✅ Created packages/$1"
