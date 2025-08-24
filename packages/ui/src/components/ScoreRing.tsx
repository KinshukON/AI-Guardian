import React from 'react'
import { cn } from '../lib/utils'

interface ScoreRingProps {
  score: number
  confidence: number
  label: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showConfidence?: boolean
}

const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  confidence,
  label,
  size = 'md',
  className,
  showConfidence = true,
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }
  
  const strokeWidth = size === 'sm' ? 4 : size === 'md' ? 6 : 8
  const radius = (size === 'sm' ? 32 : size === 'md' ? 48 : 64) - strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  
  const scorePercentage = Math.min(Math.max(score, 0), 100) / 100
  const scoreDashArray = scorePercentage * circumference
  const scoreDashOffset = circumference - scoreDashArray
  
  const confidencePercentage = Math.min(Math.max(confidence, 0), 1)
  const confidenceDashArray = confidencePercentage * circumference
  const confidenceDashOffset = circumference - confidenceDashArray
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'stroke-success-500'
    if (score >= 60) return 'stroke-warning-500'
    return 'stroke-danger-500'
  }
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'stroke-accent-500'
    if (confidence >= 0.6) return 'stroke-primary-500'
    return 'stroke-primary-300'
  }

  return (
    <div className={cn('flex flex-col items-center space-y-2', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius / 4}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
          />
          
          {/* Confidence ring */}
          {showConfidence && (
            <circle
              cx="50"
              cy="50"
              r={radius / 4}
              fill="none"
              stroke={getConfidenceColor(confidence)}
              strokeWidth={strokeWidth}
              strokeDasharray={confidenceDashArray}
              strokeDashoffset={confidenceDashOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          )}
          
          {/* Score ring */}
          <circle
            cx="50"
            cy="50"
            r={radius / 4}
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth={strokeWidth}
            strokeDasharray={scoreDashArray}
            strokeDashoffset={scoreDashOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Center score */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={cn(
              'font-bold text-primary-900',
              size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-3xl'
            )}>
              {Math.round(score)}
            </div>
            {showConfidence && (
              <div className={cn(
                'text-xs text-primary-600',
                size === 'sm' ? 'text-xs' : 'text-sm'
              )}>
                {Math.round(confidence * 100)}%
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Label */}
      <div className="text-center">
        <div className={cn(
          'font-medium text-primary-900',
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
        )}>
          {label}
        </div>
        {showConfidence && (
          <div className={cn(
            'text-primary-600',
            size === 'sm' ? 'text-xs' : 'text-sm'
          )}>
            Confidence
          </div>
        )}
      </div>
    </div>
  )
}

export default ScoreRing 