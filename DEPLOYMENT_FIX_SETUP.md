# Vercel Production Deployment Fix - Setup Guide

## Problem
Your Vercel project had a recurring issue where deployments were not being automatically assigned to production domains. This caused changes to not appear on the live site even after being pushed to GitHub.

## Solution
This package includes two complementary systems to ensure deployments are always properly assigned to production:

### 1. GitHub Actions Workflow (Automatic)
**File:** `.github/workflows/deploy-to-production.yml`

This workflow automatically:
- Triggers on every push to the `main` branch
- Deploys to Vercel with production flag
- Assigns the deployment to all production domains

**No setup required** - this runs automatically on every push.

### 2. Deployment Monitoring & Fixer (Continuous)
**Files:** 
- `scripts/ensure-production-deployment.sh` - Main monitoring script
- `scripts/setup-systemd-timer.sh` - Automated setup script
- `scripts/vercel-deployment-fix.service` - Systemd service file
- `scripts/vercel-deployment-fix.timer` - Systemd timer (runs every 5 minutes)

This system continuously monitors and fixes deployment assignments.

## Setup Instructions (Systemd Timer)

### Quick Setup (Recommended)

Run the automated setup script on your server:

```bash
cd /home/ubuntu/nexus-biomedical-website
sudo bash scripts/setup-systemd-timer.sh
```

This will:
1. Create the systemd service file
2. Create the systemd timer file
3. Set up log rotation
4. Enable and start the timer
5. Verify everything is working

### Manual Setup

If you prefer to set up manually:

1. Copy the service and timer files to systemd:
```bash
sudo cp scripts/vercel-deployment-fix.service /etc/systemd/system/
sudo cp scripts/vercel-deployment-fix.timer /etc/systemd/system/
```

2. Reload systemd and enable the timer:
```bash
sudo systemctl daemon-reload
sudo systemctl enable vercel-deployment-fix.timer
sudo systemctl start vercel-deployment-fix.timer
```

3. Verify it's running:
```bash
sudo systemctl status vercel-deployment-fix.timer
sudo systemctl list-timers
```

4. View logs:
```bash
sudo journalctl -u vercel-deployment-fix.service -f
```

## How It Works

### GitHub Actions Workflow
1. You push code to `main` branch
2. Workflow triggers automatically
3. Code is deployed to Vercel with `production: true` flag
4. Script waits for deployment to be READY
5. Script assigns deployment to all production domains

### Monitoring Script
1. Runs every 5 minutes via systemd timer
2. Fetches the latest READY deployment from Vercel
3. Checks each production domain's current assignment
4. If any domain is not assigned to the latest deployment, it fixes it
5. Logs all actions to `/var/log/vercel-deployment-fix.log`

## Environment Variables

The system uses these environment variables (already configured in setup script):
- `VERCEL_TOKEN` - Vercel API token (non-expiring)
- `PROJECT_ID` - Vercel project ID
- `LOG_FILE` - Where to write logs

## Useful Commands

### View Logs
```bash
# Real-time logs
sudo journalctl -u vercel-deployment-fix.service -f

# Last 50 lines
sudo journalctl -u vercel-deployment-fix.service -n 50

# Logs from last hour
sudo journalctl -u vercel-deployment-fix.service --since "1 hour ago"
```

### Check Timer Status
```bash
# Timer status
sudo systemctl status vercel-deployment-fix.timer

# List all timers
sudo systemctl list-timers

# Next execution time
sudo systemctl list-timers vercel-deployment-fix.timer
```

### Control the Timer
```bash
# Stop the timer
sudo systemctl stop vercel-deployment-fix.timer

# Start the timer
sudo systemctl start vercel-deployment-fix.timer

# Restart the timer
sudo systemctl restart vercel-deployment-fix.timer

# Disable the timer (won't start on reboot)
sudo systemctl disable vercel-deployment-fix.timer

# Enable the timer (will start on reboot)
sudo systemctl enable vercel-deployment-fix.timer
```

### Run Manually
```bash
cd /home/ubuntu/nexus-biomedical-website
VERCEL_TOKEN=BDOcUkY1DxTmfEB4KslLuUe4 PROJECT_ID=prj_HGiyDIsgDOoKxdyfCfXIm0YmDvxk bash scripts/ensure-production-deployment.sh
```

## Verification

To verify everything is working:

1. Check GitHub Actions:
   - Go to your GitHub repository
   - Click "Actions" tab
   - Verify "Deploy to Production" workflow runs on each push

2. Check Deployment Monitoring:
   - View the log file: `sudo tail -f /var/log/vercel-deployment-fix.log`
   - Or check systemd logs: `sudo journalctl -u vercel-deployment-fix.service -f`

3. Test a deployment:
   - Make a small change to your code
   - Push to `main` branch
   - Verify the workflow runs
   - Check that your change appears on the live site within 2-3 minutes

## Troubleshooting

### Systemd timer not running
```bash
sudo systemctl status vercel-deployment-fix.timer
sudo systemctl restart vercel-deployment-fix.timer
```

### Service failing
```bash
# Check the logs
sudo journalctl -u vercel-deployment-fix.service -n 50

# Run the script manually to see detailed output
cd /home/ubuntu/nexus-biomedical-website
VERCEL_TOKEN=BDOcUkY1DxTmfEB4KslLuUe4 PROJECT_ID=prj_HGiyDIsgDOoKxdyfCfXIm0YmDvxk bash scripts/ensure-production-deployment.sh
```

### Deployments still not showing up
1. Check the GitHub Actions workflow logs
2. Check the monitoring script logs: `sudo journalctl -u vercel-deployment-fix.service -f`
3. Verify Vercel API token is still valid
4. Run the script manually to see detailed output

### Timer not executing
```bash
# Check if timer is enabled
sudo systemctl is-enabled vercel-deployment-fix.timer

# Check if service is active
sudo systemctl is-active vercel-deployment-fix.timer

# List all timers to see next execution
sudo systemctl list-timers
```

## What This Fixes

✅ Deployments are now automatically assigned to production  
✅ Changes appear on the live site immediately after push  
✅ If GitHub integration breaks, monitoring system still works  
✅ Automatic recovery if domains get unassigned  
✅ Continuous verification every 5 minutes  
✅ Automatic restart on server reboot  

## Support

If you encounter issues:
1. Check the logs: `sudo journalctl -u vercel-deployment-fix.service -f`
2. Run the script manually to see detailed output
3. Verify your Vercel API token hasn't expired
4. Check that the PROJECT_ID is correct
5. Ensure the script has execute permissions: `ls -l scripts/ensure-production-deployment.sh`

## Next Steps

1. **Run the setup script on your server:**
   ```bash
   sudo bash scripts/setup-systemd-timer.sh
   ```

2. **Verify it's working:**
   ```bash
   sudo systemctl status vercel-deployment-fix.timer
   sudo journalctl -u vercel-deployment-fix.service -f
   ```

3. **Test by making a change and pushing to main:**
   - Make a small code change
   - Push to main
   - Verify it deploys within 2-3 minutes
   - Check the logs to confirm the monitoring script ran

4. **Monitor the logs regularly:**
   ```bash
   sudo journalctl -u vercel-deployment-fix.service -f
   ```
