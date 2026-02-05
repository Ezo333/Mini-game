#!/bin/bash

# Make all helper scripts executable
chmod +x quick-start.sh
chmod +x check-setup.sh
chmod +x fix-extension-error.sh
chmod +x show-fix.sh
chmod +x fix-build.sh

echo "✅ All scripts are now executable!"
echo ""
echo "Available scripts:"
echo "  ./quick-start.sh          - Interactive start menu"
echo "  ./check-setup.sh          - Verify setup status"
echo "  ./fix-extension-error.sh  - Fix browser extension errors"
echo "  ./show-fix.sh             - Show browser extension fix guide"
echo "  ./fix-build.sh            - Fix build errors and restart"
