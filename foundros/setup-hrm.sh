#!/usr/bin/env bash
# FoundrOS → RAW-SATAN/hrm one-time setup script
# Run this on your LOCAL machine (not server)
# Usage: bash setup-hrm.sh

set -e
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

echo -e "${GREEN}=== FoundrOS Setup ===${NC}"

# ── 1. Push code to hrm ──────────────────────────────────────────────────────
echo -e "\n${YELLOW}[1/3] Pushing code to github.com/RAW-SATAN/hrm ...${NC}"

TMPDIR=$(mktemp -d)
git clone https://github.com/RAW-SATAN/iluminatees \
  --branch claude/create-new-project-2opRy \
  --depth=100 "$TMPDIR/source" 2>&1

cd "$TMPDIR/source"
git subtree push --prefix=foundros https://github.com/RAW-SATAN/hrm main
echo -e "${GREEN}✓ Code pushed to RAW-SATAN/hrm${NC}"

# ── 2. Run Neon DB migration ──────────────────────────────────────────────────
echo -e "\n${YELLOW}[2/3] Running Neon DB migration ...${NC}"

DB_URL="postgresql://neondb_owner:npg_zPnhrVu52byR@ep-lingering-union-anr8n5cn.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require"
SQL_FILE="$TMPDIR/source/foundros/drizzle/0000_long_speed.sql"

if command -v psql &> /dev/null; then
  psql "$DB_URL" -f "$SQL_FILE"
  echo -e "${GREEN}✓ DB tables created via psql${NC}"
else
  echo -e "${YELLOW}  psql not found. Installing via npm...${NC}"
  cd "$TMPDIR/source/foundros"
  DATABASE_URL_UNPOOLED="$DB_URL" npx drizzle-kit push
  echo -e "${GREEN}✓ DB tables created via drizzle-kit${NC}"
fi

# ── 3. Create .env.local in hrm clone ────────────────────────────────────────
echo -e "\n${YELLOW}[3/3] Setting up .env.local ...${NC}"

HRM_DIR="$TMPDIR/hrm-local"
git clone https://github.com/RAW-SATAN/hrm "$HRM_DIR" 2>&1 || true

cat > "$HRM_DIR/app/.env.local" << 'ENVEOF'
DATABASE_URL=postgresql://neondb_owner:npg_zPnhrVu52byR@ep-lingering-union-anr8n5cn-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
DATABASE_URL_UNPOOLED=postgresql://neondb_owner:npg_zPnhrVu52byR@ep-lingering-union-anr8n5cn.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEXTAUTH_SECRET=YxPYdVBWIBar/XlmyZmxVrTWFLplIevWCcJJPRnr9TQ=
NEXTAUTH_URL=http://localhost:3000
ANTHROPIC_API_KEY=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
SUPER_ADMIN_EMAIL=amandffd@gmail.com
CRON_SECRET=foundros-cron-2024
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Add these when ready:
# BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
# RAZORPAY_KEY_ID=rzp_test_...
# RAZORPAY_KEY_SECRET=...
# NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
# RESEND_API_KEY=re_...
ENVEOF

echo -e "${GREEN}✓ .env.local created at $HRM_DIR/app/.env.local${NC}"
echo ""
echo -e "${GREEN}══════════════════════════════════${NC}"
echo -e "${GREEN}  ALL DONE!${NC}"
echo -e "${GREEN}══════════════════════════════════${NC}"
echo ""
echo "  Your local copy: $HRM_DIR"
echo ""
echo "  To run locally:"
echo "    cd $HRM_DIR/app"
echo "    npm install"
echo "    npm run dev"
echo ""
echo -e "${YELLOW}  Still needed:${NC}"
echo "  • Vercel Blob token → vercel.com > Storage > Blob > Create"
echo "  • Razorpay keys    → dashboard.razorpay.com"
echo "  • Resend API key   → resend.com"
