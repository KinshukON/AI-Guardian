import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScore(score: number): string {
  if (score >= 90) return "Excellent"
  if (score >= 80) return "Good"
  if (score >= 70) return "Fair"
  if (score >= 60) return "Poor"
  return "Very Poor"
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-success-600"
  if (score >= 60) return "text-warning-600"
  return "text-danger-600"
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-success-100"
  if (score >= 60) return "bg-warning-100"
  return "bg-danger-100"
}

export function formatConfidence(confidence: number): string {
  if (confidence >= 0.9) return "Very High"
  if (confidence >= 0.7) return "High"
  if (confidence >= 0.5) return "Medium"
  if (confidence >= 0.3) return "Low"
  return "Very Low"
}

export function getAgeBandLabel(age: number): string {
  if (age <= 10) return "8-10"
  if (age <= 13) return "11-13"
  if (age <= 16) return "14-16"
  return "17+"
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
} 