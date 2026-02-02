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
- `scripts/vercel-deployment-fix.service` - Systemd service file
- `scripts/vercel-deployment-fix.timer` - Systemd timer (runs every 5 minutes)

This system continuously monitors and fixes deployment assignments.

## Setup Instructions

### Option A: Using Systemd (Recommended for Linux/Ubuntu)

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

### Option B: Using Cron (For any Unix-like system)

1. Edit your crontab:
```bash
crontab -e
```

2. Add this line:
```
*/5 * * * * cd /home/ubuntu/nexus-biomedical-website && VERCEL_TOKEN=BDOcUkY1DxTmfEB4KslLuUe4 PROJECT_ID=prj_HGiyDIsgDOoKxdyfCfXIm0YmDvxk bash scripts/ensure-production-deployment.sh >> /tmp/vercel-deployment-fix.log 2>&1
```

3. Verify it was added:
```bash
crontab -l | grep ensure-production
```

### Option C: Manual Execution

Run the script manually whenever needed:
```bash
cd /home/ubuntu/nexus-biomedical-website
VERCEL_TOKEN=BDOcUkY1DxTmfEB4KslLuUe4 PROJECT_ID=prj_HGiyDIsgDOoKxdyfCfXIm0YmDvxk bash scripts/ensure-production-deployment.sh
```

## How It Works

### GitHub Actions Workflow
1. You push code to `main` branch
2. Workflow triggers automatically
3. Code is deployed to Vercel with `production: true` flag
4. Script waits for deployment to be READY
5. Script assigns deployment to all production domains

### Monitoring Script
1. Runs every 5 minutes (via systemd timer or cron)
2. Fetches the latest READY deployment from Vercel
3. Checks each production domain's current assignment
4. If any domain is not assigned to the latest deployment, it fixes it
5. Logs all actions to `/tmp/vercel-deployment-fix.log`

## Environment Variables

The system uses these environment variables (already configured):
- `VERCEL_TOKEN` - Vercel API token (non-expiring)
- `PROJECT_ID` - Vercel project ID
- `LOG_FILE` - Where to write logs

## Verification

To verify everything is working:

1. Check GitHub Actions:
   - Go to your GitHub repository
   - Click "Actions" tab
   - Verify "Deploy to Production" workflow runs on each push

2. Check Deployment Monitoring:
   - View the log file: `tail -f /tmp/vercel-deployment-fix.log`
   - Or check systemd logs: `sudo journalctl -u vercel-deployment-fix.service -f`

3. Test a deployment:
   - Make a small change to your code
   - Push to `main` branch
   - Verify the workflow runs
   - Check that your change appears on the live site within 2-3 minutes

## Troubleshooting

### Deployments still not showing up
1. Check the GitHub Actions workflow logs
2. Check the monitoring script logs: `cat /tmp/vercel-deployment-fix.log`
3. Verify Vercel API token is still valid
4. Run the script manually to see detailed output

### Systemd timer not running
```bash
sudo systemctl status vercel-deployment-fix.timer
sudo systemctl restart vercel-deployment-fix.timer
```

### Cron job not running
```bash
crontab -l  # Verify it's there
sudo service cron status  # Check if cron service is running
sudo service cron restart  # Restart cron if needed
```

## What This Fixes

✅ Deployments are now automatically assigned to production  
✅ Changes appear on the live site immediately after push  
✅ If GitHub integration breaks, monitoring system still works  
✅ Automatic recovery if domains get unassigned  
✅ Continuous verification every 5 minutes  

## Support

If you encounter issues:
1. Check the logs
2. Run the script manually to see detailed output
3. Verify your Vercel API token hasn't expired
4. Check that the PROJECT_ID is correct
