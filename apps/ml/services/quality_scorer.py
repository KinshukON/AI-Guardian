"""
Quality Scorer Service
Evaluates content quality including factuality, depth, and clarity
"""

from typing import Dict, List, Optional, Any
import asyncio
import logging
import re

logger = logging.getLogger(__name__)

class QualityScorer:
    """
    Content quality scoring service
    Evaluates factuality, depth, clarity, and overall quality
    """
    
    def __init__(self):
        self.initialized = False
        
        # Quality indicators
        self.quality_indicators = {
            "factuality": {
                "positive": ["research", "study", "evidence", "fact", "data", "source"],
                "negative": ["opinion", "believe", "might", "could be", "probably"]
            },
            "depth": {
                "positive": ["analysis", "detailed", "comprehensive", "thorough", "explains"],
                "negative": ["brief", "summary", "quick", "simple"]
            },
            "clarity": {
                "positive": ["clear", "explains", "example", "step-by-step", "understand"],
                "negative": ["confusing", "unclear", "complex", "jargon"]
            }
        }
    
    async def initialize(self):
        """Initialize the quality scorer"""
        try:
            logger.info("Initializing quality scorer...")
            self.initialized = True
            logger.info("Quality scorer initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize quality scorer: {e}")
            raise
    
    async def score_quality(self, content: str, content_type: str = "text") -> Dict[str, Any]:
        """
        Score content quality across multiple dimensions
        Returns quality scores and confidence metrics
        """
        if not self.initialized:
            await self.initialize()
        
        try:
            # Calculate individual quality metrics
            factuality = self._score_factuality(content)
            depth = self._score_depth(content)
            clarity = self._score_clarity(content)
            
            # Calculate overall quality score
            quality_score = int((factuality + depth + clarity) / 3)
            
            # Calculate confidence based on content analysis
            confidence = self._calculate_confidence(content, content_type)
            
            return {
                "quality_score": quality_score,
                "quality_confidence": confidence,
                "factuality": factuality,
                "depth": depth,
                "clarity": clarity,
                "content_type": content_type,
                "word_count": len(content.split()),
                "analysis_timestamp": "2024-01-01T00:00:00Z"
            }
            
        except Exception as e:
            logger.error(f"Quality scoring failed: {e}")
            return {
                "quality_score": 50,
                "quality_confidence": 0.5,
                "factuality": 50,
                "depth": 50,
                "clarity": 50,
                "content_type": content_type,
                "word_count": 0,
                "analysis_timestamp": "2024-01-01T00:00:00Z"
            }
    
    def _score_factuality(self, content: str) -> int:
        """Score content factuality"""
        content_lower = content.lower()
        indicators = self.quality_indicators["factuality"]
        
        positive_count = sum(1 for word in indicators["positive"] if word in content_lower)
        negative_count = sum(1 for word in indicators["negative"] if word in content_lower)
        
        # Base score of 70, adjust based on indicators
        base_score = 70
        score = base_score + (positive_count * 5) - (negative_count * 3)
        
        return max(min(score, 100), 0)
    
    def _score_depth(self, content: str) -> int:
        """Score content depth and thoroughness"""
        content_lower = content.lower()
        indicators = self.quality_indicators["depth"]
        
        positive_count = sum(1 for word in indicators["positive"] if word in content_lower)
        negative_count = sum(1 for word in indicators["negative"] if word in content_lower)
        
        # Factor in content length
        word_count = len(content.split())
        length_bonus = min(word_count / 100, 10)  # Up to 10 points for length
        
        base_score = 60
        score = base_score + (positive_count * 6) - (negative_count * 4) + length_bonus
        
        return max(min(int(score), 100), 0)
    
    def _score_clarity(self, content: str) -> int:
        """Score content clarity and readability"""
        content_lower = content.lower()
        indicators = self.quality_indicators["clarity"]
        
        positive_count = sum(1 for word in indicators["positive"] if word in content_lower)
        negative_count = sum(1 for word in indicators["negative"] if word in content_lower)
        
        # Simple readability assessment
        sentences = len(re.split(r'[.!?]+', content))
        words = len(content.split())
        avg_words_per_sentence = words / max(sentences, 1)
        
        # Penalize very long sentences
        readability_penalty = max(0, (avg_words_per_sentence - 20) / 2)
        
        base_score = 75
        score = base_score + (positive_count * 5) - (negative_count * 5) - readability_penalty
        
        return max(min(int(score), 100), 0)
    
    def _calculate_confidence(self, content: str, content_type: str) -> float:
        """Calculate confidence in quality assessment"""
        word_count = len(content.split())
        
        # Base confidence
        confidence = 0.7
        
        # Increase confidence with more content to analyze
        if word_count > 50:
            confidence += 0.1
        if word_count > 200:
            confidence += 0.1
        
        # Adjust for content type
        if content_type in ["text", "article"]:
            confidence += 0.05
        
        return min(confidence, 0.95)