"""
Legacy KidGPT Service - maintains backward compatibility
Wraps enhanced KidGPT service with legacy interface
"""

from typing import Dict, List, Optional, Any
import asyncio
import logging
from .enhanced_kidgpt import EnhancedKidGPTService
from .feature_flags import (
    feature_flag_service,
    is_emotion_aware_kidgpt_enabled,
    is_crisis_detection_enabled
)

logger = logging.getLogger(__name__)

class KidGPTService:
    """
    Legacy KidGPT service interface for backward compatibility
    Delegates to enhanced KidGPT service while maintaining existing API
    """
    
    def __init__(self):
        self.enhanced_service = EnhancedKidGPTService()
        self.initialized = False
    
    async def initialize(self):
        """Initialize the KidGPT service"""
        try:
            logger.info("Initializing legacy KidGPT service...")
            await self.enhanced_service.initialize()
            self.initialized = True
            logger.info("KidGPT service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize KidGPT service: {e}")
            raise
    
    async def generate_response(
        self,
        message: str,
        mode: str,
        child_age: int,
        child_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Legacy response generation interface
        Returns simplified response for backward compatibility
        """
        if not self.initialized:
            await self.initialize()
        
        try:
            if await is_emotion_aware_kidgpt_enabled(child_age, child_id or "") and child_id:
                # Use enhanced service with emotional awareness
                enhanced_response = await self.enhanced_service.generate_response(
                    message=message,
                    mode=mode,
                    child_id=child_id,
                    child_age=child_age
                )
                
                # Return backward-compatible response with optional enhancements
                return {
                    "response": enhanced_response["response"],
                    "mode": mode,
                    "confidence": 0.85,
                    "citations": [],  # Legacy field
                    "safety_flags": [],  # Legacy field
                    
                    # Enhanced features (new)
                    "enhanced_features": {
                        "emotional_analysis": enhanced_response.get("emotional_analysis"),
                        "crisis_assessment": enhanced_response.get("crisis_assessment"),
                        "support_recommendations": enhanced_response.get("support_recommendations"),
                        "parent_notification": enhanced_response.get("parent_notification")
                    }
                }
            else:
                # Use legacy simple response generation
                return await self._generate_legacy_response(message, mode, child_age)
                
        except Exception as e:
            logger.error(f"KidGPT response generation failed: {e}")
            return self._get_fallback_response(message, mode)
    
    async def _generate_legacy_response(self, message: str, mode: str, child_age: int) -> Dict[str, Any]:
        """Generate legacy-style response without emotional features"""
        # Simple response generation for backward compatibility
        mode_responses = {
            "homework": "I'd be happy to help you with your homework! Let me break this down for you step by step.",
            "curiosity": "That's a great question! Here's what I can tell you about that topic.",
            "resilience": "I understand you might be going through something challenging. Let's talk about some strategies that might help.",
            "digital": "That's an important question about digital safety. Here are some key things to remember."
        }
        
        base_response = mode_responses.get(mode, "I'm here to help you! What would you like to know?")
        
        return {
            "response": base_response,
            "mode": mode,
            "confidence": 0.8,
            "citations": [],
            "safety_flags": []
        }
    
    def _get_fallback_response(self, message: str, mode: str) -> Dict[str, Any]:
        """Return fallback response in case of errors"""
        return {
            "response": "Thank you for your question! I'm here to help you learn and grow. Could you tell me more about what you'd like to know?",
            "mode": mode,
            "confidence": 0.5,
            "citations": [],
            "safety_flags": []
        }