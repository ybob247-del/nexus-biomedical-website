#!/bin/bash

# Vercel Production Deployment Fix - Systemd Timer Setup Script
# This script installs and enables the systemd timer to monitor Vercel deployments every 5 minutes

set -e

echo "=========================================="
echo "Vercel Deployment Fix - Systemd Setup"
echo "=========================================="
echo ""

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo "❌ This script must be run as root (use: sudo bash setup-systemd-timer.sh)"
   exit 1
fi

# Get the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "📁 Project directory: $PROJECT_DIR"

# Verify the monitoring script exists
if [ ! -f "$PROJECT_DIR/scripts/ensure-production-deployment.sh" ]; then
    echo "❌ Error: ensure-production-deployment.sh not found at $PROJECT_DIR/scripts/"
    exit 1
fi

echo "✓ Monitoring script found"
echo ""

# Create systemd service file
echo "📝 Creating systemd service file..."
cat > /etc/systemd/system/vercel-deployment-fix.service << EOF
[Unit]
Description=Vercel Production Deployment Fixer
After=network.target

[Service]
Type=oneshot
User=ubuntu
WorkingDirectory=$PROJECT_DIR
Environment="VERCEL_TOKEN=BDOcUkY1DxTmfEB4KslLuUe4"
Environment="PROJECT_ID=prj_HGiyDIsgDOoKxdyfCfXIm0YmDvxk"
Environment="LOG_FILE=/var/log/vercel-deployment-fix.log"
ExecStart=/bin/bash $PROJECT_DIR/scripts/ensure-production-deployment.sh
StandardOutput=journal
StandardError=journal
SyslogIdentifier=vercel-deployment-fix
EOF

echo "✓ Service file created"

# Create systemd timer file
echo "📝 Creating systemd timer file..."
cat > /etc/systemd/system/vercel-deployment-fix.timer << EOF
[Unit]
Description=Run Vercel Production Deployment Fixer every 5 minutes
Requires=vercel-deployment-fix.service

[Timer]
OnBootSec=1min
OnUnitActiveSec=5min
AccuracySec=1s
Persistent=true

[Install]
WantedBy=timers.target
EOF

echo "✓ Timer file created"
echo ""

# Create log file with proper permissions
echo "📝 Creating log file..."
touch /var/log/vercel-deployment-fix.log
chmod 666 /var/log/vercel-deployment-fix.log
echo "✓ Log file created at /var/log/vercel-deployment-fix.log"
echo ""

# Reload systemd daemon
echo "🔄 Reloading systemd daemon..."
systemctl daemon-reload
echo "✓ Systemd daemon reloaded"
echo ""

# Enable the timer
echo "⚙️  Enabling the timer..."
systemctl enable vercel-deployment-fix.timer
echo "✓ Timer enabled"
echo ""

# Start the timer
echo "▶️  Starting the timer..."
systemctl start vercel-deployment-fix.timer
echo "✓ Timer started"
echo ""

# Verify the timer is running
echo "✅ Verifying installation..."
echo ""
echo "Timer status:"
systemctl status vercel-deployment-fix.timer --no-pager
echo ""

echo "Service status:"
systemctl status vercel-deployment-fix.service --no-pager || echo "(Service will run on next timer trigger)"
echo ""

# Show next execution time
echo "📅 Next scheduled execution:"
systemctl list-timers vercel-deployment-fix.timer --no-pager
echo ""

echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "The Vercel deployment fixer is now running every 5 minutes."
echo ""
echo "📋 Useful commands:"
echo "  - View logs:           sudo journalctl -u vercel-deployment-fix.service -f"
echo "  - Check timer status:  sudo systemctl status vercel-deployment-fix.timer"
echo "  - Stop the timer:      sudo systemctl stop vercel-deployment-fix.timer"
echo "  - Restart the timer:   sudo systemctl restart vercel-deployment-fix.timer"
echo "  - View all timers:     sudo systemctl list-timers"
echo ""
