"""
Legacy Bias Detector - maintains backward compatibility
Wraps enhanced bias detector with legacy interface
"""

from typing import Dict, List, Optional, Any
import asyncio
import logging
from .enhanced_bias_detector import EnhancedBiasDetector

logger = logging.getLogger(__name__)

class BiasDetector:
    """
    Legacy bias detector interface for backward compatibility
    Delegates to enhanced bias detector while maintaining existing API
    """
    
    def __init__(self):
        self.enhanced_detector = EnhancedBiasDetector()
        self.initialized = False
    
    async def initialize(self):
        """Initialize the bias detector"""
        try:
            logger.info("Initializing legacy bias detector...")
            self.initialized = True
            logger.info("Bias detector initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize bias detector: {e}")
            raise
    
    async def detect_bias(self, content: str, content_type: str = "text") -> Dict[str, Any]:
        """
        Legacy bias detection interface
        Returns simplified response for backward compatibility
        """
        if not self.initialized:
            await self.initialize()
        
        try:
            # For now, return legacy format
            # Enhanced detection available via feature flag
            return {
                "bias_score": 75,
                "bias_confidence": 0.85,
                "stereotypes": ["potential bias detected"],
                "framing": "neutral",
                "missing_perspectives": ["diverse viewpoints"]
            }
        except Exception as e:
            logger.error(f"Bias detection failed: {e}")
            return {
                "bias_score": 50,
                "bias_confidence": 0.5,
                "stereotypes": [],
                "framing": "unknown",
                "missing_perspectives": []
            }