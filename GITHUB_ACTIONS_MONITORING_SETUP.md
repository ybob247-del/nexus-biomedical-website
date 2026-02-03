# GitHub Actions Deployment Monitoring Setup

## Overview

This guide explains how to set up GitHub Actions to automatically monitor your Vercel deployments every 5 minutes.

## What This Does

The GitHub Actions workflow:
- Runs every 5 minutes automatically
- Checks if your Vercel domains are assigned to the latest deployment
- Automatically fixes any unassigned domains
- Logs all actions for monitoring
- Costs nothing (included with your GitHub paid plan)

## Setup Instructions

### Step 1: Add Secrets to GitHub

1. Go to: https://github.com/ybob247-del/nexus-biomedical-website/settings/secrets/actions
2. Click **New repository secret**

Add these two secrets:

**Secret 1:**
- Name: `VERCEL_TOKEN`
- Value: `BDOcUkY1DxTmfEB4KslLuUe4`

**Secret 2:**
- Name: `VERCEL_PROJECT_ID`
- Value: `prj_HGiyDIsgDOoKxdyfCfXIm0YmDvxk`

### Step 2: Verify Setup

The workflow file is already in your repository at:
`.github/workflows/monitor-vercel-deployments.yml`

### Step 3: Monitor

1. Go to: https://github.com/ybob247-del/nexus-biomedical-website/actions
2. Click **Monitor Vercel Deployments**
3. You'll see all runs with their status

## How to View Logs

1. Go to **Actions** tab
2. Click **Monitor Vercel Deployments**
3. Click on any run
4. Click **monitor-deployments** job
5. Expand **Run deployment monitoring script** to see output

## Manual Trigger

To run immediately without waiting 5 minutes:
1. Go to **Actions** tab
2. Click **Monitor Vercel Deployments**
3. Click **Run workflow**
4. Click **Run workflow** button

## Cost

**FREE** - Included with your GitHub paid plan.

## Next Steps

1. Add the two secrets to GitHub (see Step 1)
2. Go to Actions tab to verify it's running
3. Check logs to confirm it's working
