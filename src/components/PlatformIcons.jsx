import React from 'react'

export const RxGuardIcon = ({ color = '#00A8CC', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="40" height="40" rx="8" stroke={color} strokeWidth="2.5" fill="none"/>
    <path d="M24 12L24 36M12 24L36 24" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <circle cx="24" cy="24" r="6" stroke={color} strokeWidth="2.5" fill="none"/>
    <path d="M14 14L20 20M28 28L34 34M34 14L28 20M20 28L14 34" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
  </svg>
)

export const ClinicalIQIcon = ({ color = '#00D084', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 8C15.163 8 8 15.163 8 24C8 32.837 15.163 40 24 40C32.837 40 40 32.837 40 24C40 15.163 32.837 8 24 8Z" stroke={color} strokeWidth="2.5" fill="none"/>
    <path d="M24 16V24L30 30" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="24" cy="24" r="2" fill={color}/>
    <path d="M12 24H8M40 24H36M24 12V8M24 40V36" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
  </svg>
)

export const ReguReadyIcon = ({ color = '#5B2C87', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8H36C37.1046 8 38 8.89543 38 10V38C38 39.1046 37.1046 40 36 40H12C10.8954 40 10 39.1046 10 38V10C10 8.89543 10.8954 8 12 8Z" stroke={color} strokeWidth="2.5" fill="none"/>
    <path d="M16 16H32M16 24H32M16 32H26" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="34" cy="32" r="6" fill={color} opacity="0.2"/>
    <path d="M31 32L33 34L37 30" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const ElderWatchIcon = ({ color = '#FFB800', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 8C15.163 8 8 15.163 8 24C8 32.837 15.163 40 24 40C32.837 40 40 32.837 40 24C40 15.163 32.837 8 24 8Z" stroke={color} strokeWidth="2.5" fill="none"/>
    <path d="M24 14V24L30 27" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 8V4M24 44V40M8 24H4M44 24H40" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <circle cx="24" cy="24" r="14" stroke={color} strokeWidth="1.5" opacity="0.3" strokeDasharray="4 4"/>
  </svg>
)

export const PediCalcIcon = ({ color = '#FF4757', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="6" width="28" height="36" rx="4" stroke={color} strokeWidth="2.5" fill="none"/>
    <rect x="14" y="10" width="20" height="6" rx="2" fill={color} opacity="0.2"/>
    <circle cx="17" cy="22" r="2" fill={color}/>
    <circle cx="24" cy="22" r="2" fill={color}/>
    <circle cx="31" cy="22" r="2" fill={color}/>
    <circle cx="17" cy="28" r="2" fill={color}/>
    <circle cx="24" cy="28" r="2" fill={color}/>
    <circle cx="31" cy="28" r="2" fill={color}/>
    <rect x="17" y="34" width="14" height="4" rx="2" fill={color}/>
  </svg>
)

export const SkinScanIcon = ({ color = '#0A1B3D', size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="32" height="32" rx="6" stroke={color} strokeWidth="2.5" fill="none"/>
    <circle cx="24" cy="24" r="8" stroke={color} strokeWidth="2.5" fill="none"/>
    <path d="M24 16V14M24 34V32M16 24H14M34 24H32" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 18L16 16M30 18L32 16M18 30L16 32M30 30L32 32" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <circle cx="24" cy="24" r="3" fill={color} opacity="0.3"/>
  </svg>
)

export const platformIcons = {
  'RxGuard™': RxGuardIcon,
  'ClinicalIQ™': ClinicalIQIcon,
  'ReguReady™': ReguReadyIcon,
  'ElderWatch™': ElderWatchIcon,
  'PediCalc Pro™': PediCalcIcon,
  'SkinScan Pro™': SkinScanIcon
}

