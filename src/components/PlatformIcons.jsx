import React from 'react'

export const RxGuardIcon = ({ size = 48 }) => (
  <div style={{ fontSize: `${size}px`, lineHeight: 1 }}>💊</div>
)

export const ClinicalIQIcon = ({ size = 48 }) => (
  <div style={{ fontSize: `${size}px`, lineHeight: 1 }}>🏥</div>
)

export const ReguReadyIcon = ({ size = 48 }) => (
  <div style={{ fontSize: `${size}px`, lineHeight: 1 }}>📋</div>
)

export const ElderWatchIcon = ({ size = 48 }) => (
  <div style={{ fontSize: `${size}px`, lineHeight: 1 }}>👴</div>
)

export const PediCalcIcon = ({ size = 48 }) => (
  <div style={{ fontSize: `${size}px`, lineHeight: 1 }}>👶</div>
)

export const SkinScanIcon = ({ size = 48 }) => (
  <div style={{ fontSize: `${size}px`, lineHeight: 1 }}>🔬</div>
)

export const platformIcons = {
  'RxGuard™': RxGuardIcon,
  'ClinicalIQ™': ClinicalIQIcon,
  'ReguReady™': ReguReadyIcon,
  'ElderWatch™': ElderWatchIcon,
  'PediCalc Pro™': PediCalcIcon,
  'SkinScan Pro™': SkinScanIcon
}

