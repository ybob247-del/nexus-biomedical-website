#!/bin/bash

##############################################################################
# Vercel Production Deployment Fixer
# 
# This script ensures that the latest READY deployment is always assigned
# to all production domains. Run this as a cron job every 5 minutes.
#
# Setup:
#   crontab -e
#   */5 * * * * /path/to/ensure-production-deployment.sh >> /var/log/vercel-deployment-fix.log 2>&1
##############################################################################

set -e

# Configuration
VERCEL_TOKEN="${VERCEL_TOKEN:-BDOcUkY1DxTmfEB4KslLuUe4}"
PROJECT_ID="${PROJECT_ID:-prj_HGiyDIsgDOoKxdyfCfXIm0YmDvxk}"
DOMAINS=("www.nexusbiomedical.ai" "nexusbiomedical.ai" "nexus-biomedical-website.vercel.app")
LOG_FILE="${LOG_FILE:-/tmp/vercel-deployment-fix.log}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log_error() {
  echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a "$LOG_FILE"
}

log_success() {
  echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
  echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a "$LOG_FILE"
}

# Get the latest READY deployment
get_latest_deployment() {
  local response=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
    "https://api.vercel.com/v6/deployments?projectId=$PROJECT_ID&limit=1&state=READY")
  
  local deployment=$(echo "$response" | jq -r '.deployments[0].uid // empty')
  
  if [ -z "$deployment" ]; then
    log_error "Could not fetch latest deployment"
    return 1
  fi
  
  echo "$deployment"
}

# Check if a domain is assigned to a deployment
check_domain_assignment() {
  local domain=$1
  local expected_deployment=$2
  
  local response=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
    "https://api.vercel.com/v10/projects/$PROJECT_ID/domains/$domain")
  
  local current_deployment=$(echo "$response" | jq -r '.deploymentId // empty')
  
  if [ "$current_deployment" == "$expected_deployment" ]; then
    return 0  # Correctly assigned
  else
    return 1  # Needs fixing
  fi
}

# Assign deployment to domain
assign_deployment_to_domain() {
  local domain=$1
  local deployment=$2
  
  local response=$(curl -s -X PATCH -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"deploymentId\":\"$deployment\"}" \
    "https://api.vercel.com/v10/projects/$PROJECT_ID/domains/$domain")
  
  local result=$(echo "$response" | jq -r '.name // empty')
  
  if [ -n "$result" ]; then
    return 0
  else
    return 1
  fi
}

# Main execution
main() {
  log "Starting Vercel production deployment verification..."
  
  # Get latest deployment
  LATEST_DEPLOYMENT=$(get_latest_deployment)
  if [ $? -ne 0 ]; then
    log_error "Failed to get latest deployment"
    exit 1
  fi
  
  log "Latest READY deployment: $LATEST_DEPLOYMENT"
  
  # Check and fix each domain
  NEEDS_FIXING=0
  for domain in "${DOMAINS[@]}"; do
    if check_domain_assignment "$domain" "$LATEST_DEPLOYMENT"; then
      log_success "$domain is correctly assigned to $LATEST_DEPLOYMENT"
    else
      log_warning "$domain needs to be reassigned to $LATEST_DEPLOYMENT"
      
      if assign_deployment_to_domain "$domain" "$LATEST_DEPLOYMENT"; then
        log_success "Successfully assigned $domain to $LATEST_DEPLOYMENT"
        NEEDS_FIXING=$((NEEDS_FIXING + 1))
      else
        log_error "Failed to assign $domain to $LATEST_DEPLOYMENT"
      fi
    fi
  done
  
  if [ $NEEDS_FIXING -gt 0 ]; then
    log_warning "Fixed $NEEDS_FIXING domain(s) that were not properly assigned"
  else
    log_success "All domains are correctly assigned to production deployment"
  fi
  
  log "Vercel production deployment verification complete"
}

# Run main function
main
