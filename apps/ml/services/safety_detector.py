"""
Safety Detector Service
Maintains existing safety detection functionality
"""

from typing import Dict, List, Optional, Any
import asyncio
import logging

logger = logging.getLogger(__name__)

class SafetyDetector:
    """
    Safety detection service for content analysis
    Maintains existing functionality while allowing for future enhancements
    """
    
    def __init__(self):
        self.initialized = False
        
        # Safety categories and their indicators
        self.safety_categories = {
            "violence": ["fight", "attack", "weapon", "hurt", "kill"],
            "inappropriate_language": ["profanity", "offensive", "hate"],
            "mature_content": ["sexual", "drug", "alcohol", "gambling"],
            "cyberbullying": ["bully", "harassment", "threat", "intimidation"],
            "privacy_risk": ["personal information", "address", "phone", "password"]
        }
    
    async def initialize(self):
        """Initialize the safety detector"""
        try:
            logger.info("Initializing safety detector...")
            self.initialized = True
            logger.info("Safety detector initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize safety detector: {e}")
            raise
    
    async def detect_safety(self, content: str, content_type: str = "text") -> Dict[str, Any]:
        """
        Detect safety issues in content
        Returns safety score, confidence, flags, and evidence
        """
        if not self.initialized:
            await self.initialize()
        
        try:
            # Analyze content for safety issues
            safety_flags = []
            safety_evidence = []
            content_lower = content.lower()
            
            # Check each safety category
            for category, indicators in self.safety_categories.items():
                found_indicators = [ind for ind in indicators if ind in content_lower]
                if found_indicators:
                    safety_flags.append(category)
                    safety_evidence.extend(found_indicators)
            
            # Calculate safety score (inverse of risk)
            risk_score = len(safety_flags) * 20  # Each flag reduces safety by 20 points
            safety_score = max(100 - risk_score, 0)
            
            # Calculate confidence based on content analysis depth
            confidence = min(0.8 + (len(content) / 1000) * 0.1, 0.95)
            
            return {
                "safety_score": safety_score,
                "safety_confidence": confidence,
                "safety_flags": safety_flags,
                "safety_evidence": safety_evidence,
                "content_type": content_type,
                "analysis_timestamp": "2024-01-01T00:00:00Z"  # Would use actual timestamp
            }
            
        except Exception as e:
            logger.error(f"Safety detection failed: {e}")
            return {
                "safety_score": 50,
                "safety_confidence": 0.5,
                "safety_flags": [],
                "safety_evidence": [],
                "content_type": content_type,
                "analysis_timestamp": "2024-01-01T00:00:00Z"
            }