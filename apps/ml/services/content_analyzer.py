"""
Content Analyzer Service
Main orchestrator for content analysis including enhanced features
"""

from typing import Dict, List, Optional, Any
import asyncio
import logging
from datetime import datetime
from .enhanced_bias_detector import EnhancedBiasDetector
from .bias_detector import BiasDetector
from .safety_detector import SafetyDetector
from .quality_scorer import QualityScorer
from .predictive_risk_assessor import PredictiveRiskAssessor
from .feature_flags import (
    feature_flag_service, 
    FeatureFlag,
    is_enhanced_bias_detection_enabled,
    is_predictive_risk_assessment_enabled,
    is_cultural_bias_analysis_enabled
)

logger = logging.getLogger(__name__)

class ContentAnalyzer:
    """
    Enhanced Content Analyzer with feature flag support
    Orchestrates all analysis services while maintaining backward compatibility
    """
    
    def __init__(self):
        self.safety_detector = SafetyDetector()
        self.bias_detector = BiasDetector()
        self.quality_scorer = QualityScorer()
        self.enhanced_bias_detector = EnhancedBiasDetector()
        self.risk_assessor = PredictiveRiskAssessor()
        self.initialized = False
    
    async def initialize(self):
        """Initialize all analysis services"""
        try:
            logger.info("Initializing content analyzer...")
            
            # Initialize feature flag service first
            await feature_flag_service.initialize()
            
            await self.safety_detector.initialize()
            await self.bias_detector.initialize()
            await self.quality_scorer.initialize()
            await self.risk_assessor.initialize()
            
            self.initialized = True
            logger.info("Content analyzer initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize content analyzer: {e}")
            raise
    
    async def analyze(
        self, 
        content: str, 
        content_type: str, 
        child_age: int,
        source: Optional[str] = None,
        uri: Optional[str] = None,
        child_id: Optional[str] = None,
        cultural_context: str = "western"
    ) -> Dict[str, Any]:
        """
        Enhanced content analysis with feature flag support
        Returns backward-compatible response with optional enhancements
        """
        if not self.initialized:
            await self.initialize()
        
        try:
            # Core analysis (always present for backward compatibility)
            safety_result = await self.safety_detector.detect_safety(content, content_type)
            quality_result = await self.quality_scorer.score_quality(content, content_type)
            
            # Choose bias detection based on feature flag
            if await is_enhanced_bias_detection_enabled(child_age, child_id or ""):
                bias_result = await self.enhanced_bias_detector.detect_comprehensive_bias(
                    content, child_age, cultural_context
                )
            else:
                bias_result = await self.bias_detector.detect_bias(content, content_type)
            
            # Predictive risk assessment (new feature)
            risk_assessment = None
            if await is_predictive_risk_assessment_enabled(child_age, child_id or "") and child_id:
                risk_assessment = await self.risk_assessor.assess_risk(
                    content, content_type, child_id, child_age
                )
            
            # Build response (backward compatible + enhanced features)
            response = {
                # Core fields (backward compatibility)
                "safety_score": safety_result["safety_score"],
                "safety_confidence": safety_result["safety_confidence"],
                "safety_flags": safety_result["safety_flags"],
                "safety_evidence": safety_result["safety_evidence"],
                
                "quality_score": quality_result["quality_score"],
                "quality_confidence": quality_result["quality_confidence"],
                "factuality": quality_result["factuality"],
                "depth": quality_result["depth"],
                "clarity": quality_result["clarity"],
                
                "bias_score": bias_result["bias_score"],
                "bias_confidence": bias_result["bias_confidence"],
                "stereotypes": bias_result["stereotypes"],
                "framing": bias_result["framing"],
                "missing_perspectives": bias_result["missing_perspectives"],
                
                "age_fit": self._determine_age_fit(content, child_age),
                "recommendations": self._generate_recommendations(
                    safety_result, quality_result, bias_result, child_age
                ),
                "overall_confidence": self._calculate_overall_confidence(
                    safety_result, quality_result, bias_result
                )
            }
            
            # Add enhanced features if enabled
            if await is_enhanced_bias_detection_enabled(child_age, child_id or ""):
                response.update({
                    "enhanced_bias_analysis": {
                        "cultural_analysis": bias_result.get("cultural_analysis"),
                        "intersectional_factors": bias_result.get("intersectional_factors"),
                        "balanced_perspectives": bias_result.get("balanced_perspectives"),
                        "perspective_synthesis": bias_result.get("perspective_synthesis")
                    }
                })
            
            if risk_assessment:
                response.update({
                    "risk_assessment": risk_assessment
                })
            
            return response
            
        except Exception as e:
            logger.error(f"Content analysis failed: {e}")
            # Return minimal safe response for backward compatibility
            return self._get_fallback_response()
    
    async def log_analysis(self, content_type: str, analysis_result: Dict[str, Any]):
        """Log analysis results for monitoring and improvement"""
        try:
            logger.info(f"Analysis completed for {content_type} content")
            # In production, this would log to analytics service
        except Exception as e:
            logger.error(f"Failed to log analysis: {e}")
    
    def _determine_age_fit(self, content: str, child_age: int) -> str:
        """Determine age appropriateness"""
        # Simplified logic - would be more sophisticated in production
        if child_age <= 8:
            return "elementary"
        elif child_age <= 12:
            return "middle_school"
        elif child_age <= 16:
            return "high_school"
        else:
            return "mature"
    
    def _generate_recommendations(
        self, 
        safety: Dict, 
        quality: Dict, 
        bias: Dict, 
        child_age: int
    ) -> List[str]:
        """Generate recommendations based on analysis results"""
        recommendations = []
        
        if safety["safety_score"] < 70:
            recommendations.append("Consider reviewing content for safety concerns")
        
        if quality["quality_score"] < 60:
            recommendations.append("Content may benefit from additional factual verification")
        
        if bias["bias_score"] < 70:
            recommendations.append("Consider exploring multiple perspectives on this topic")
        
        if child_age <= 10 and any(flag in safety["safety_flags"] for flag in ["violence", "mature_content"]):
            recommendations.append("Content may not be age-appropriate")
        
        return recommendations
    
    def _calculate_overall_confidence(
        self, 
        safety: Dict, 
        quality: Dict, 
        bias: Dict
    ) -> float:
        """Calculate overall confidence score"""
        confidences = [
            safety["safety_confidence"],
            quality["quality_confidence"],
            bias["bias_confidence"]
        ]
        return sum(confidences) / len(confidences)
    
    def _get_fallback_response(self) -> Dict[str, Any]:
        """Return fallback response in case of errors"""
        return {
            "safety_score": 50,
            "safety_confidence": 0.5,
            "safety_flags": [],
            "safety_evidence": [],
            "quality_score": 50,
            "quality_confidence": 0.5,
            "factuality": 50,
            "depth": 50,
            "clarity": 50,
            "bias_score": 50,
            "bias_confidence": 0.5,
            "stereotypes": [],
            "framing": "unknown",
            "missing_perspectives": [],
            "age_fit": "unknown",
            "recommendations": ["Unable to analyze content at this time"],
            "overall_confidence": 0.5
        }