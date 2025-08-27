"""
Feature Flags Service for Safe Rollout
Manages feature flag configuration and evaluation
"""

from typing import Dict, List, Optional, Any
import os
import json
import asyncio
import logging
from datetime import datetime
from enum import Enum

logger = logging.getLogger(__name__)

class FeatureFlag(Enum):
    ENHANCED_BIAS_DETECTION = "ENHANCED_BIAS_DETECTION"
    PREDICTIVE_RISK_ASSESSMENT = "PREDICTIVE_RISK_ASSESSMENT"
    EMOTION_AWARE_KIDGPT = "EMOTION_AWARE_KIDGPT"
    CULTURAL_BIAS_ANALYSIS = "CULTURAL_BIAS_ANALYSIS"
    CRISIS_DETECTION = "CRISIS_DETECTION"
    REAL_TIME_INTERVENTION = "REAL_TIME_INTERVENTION"

class FeatureFlagService:
    """
    Feature Flag Service for safe rollout of enhanced features
    Supports percentage-based rollout, age group targeting, and A/B testing
    """
    
    def __init__(self):
        self.flags = {}
        self.initialized = False
        
        # Default feature flag configuration
        self.default_flags = {
            FeatureFlag.ENHANCED_BIAS_DETECTION: {
                "enabled": True,
                "rollout_percentage": 100,
                "target_age_groups": ["AGE_8_10", "AGE_11_13", "AGE_14_16", "AGE_17_PLUS"],
                "description": "Enhanced multi-dimensional bias detection with cultural awareness"
            },
            FeatureFlag.PREDICTIVE_RISK_ASSESSMENT: {
                "enabled": True,
                "rollout_percentage": 100,
                "target_age_groups": ["AGE_8_10", "AGE_11_13", "AGE_14_16", "AGE_17_PLUS"],
                "description": "Predictive risk assessment with behavioral pattern recognition"
            },
            FeatureFlag.EMOTION_AWARE_KIDGPT: {
                "enabled": True,
                "rollout_percentage": 100,
                "target_age_groups": ["AGE_8_10", "AGE_11_13", "AGE_14_16", "AGE_17_PLUS"],
                "description": "Emotion-aware AI mentoring with crisis detection"
            },
            FeatureFlag.CULTURAL_BIAS_ANALYSIS: {
                "enabled": True,
                "rollout_percentage": 80,  # Gradual rollout
                "target_age_groups": ["AGE_11_13", "AGE_14_16", "AGE_17_PLUS"],
                "description": "Cultural bias analysis with perspective synthesis"
            },
            FeatureFlag.CRISIS_DETECTION: {
                "enabled": True,
                "rollout_percentage": 100,
                "target_age_groups": ["AGE_8_10", "AGE_11_13", "AGE_14_16", "AGE_17_PLUS"],
                "description": "Crisis detection with automatic escalation"
            },
            FeatureFlag.REAL_TIME_INTERVENTION: {
                "enabled": False,  # Disabled by default for safety
                "rollout_percentage": 0,
                "target_age_groups": [],
                "description": "Real-time intervention with parent notification"
            }
        }
    
    async def initialize(self):
        """Initialize feature flag service"""
        try:
            logger.info("Initializing feature flag service...")
            
            # Load flags from environment or use defaults
            self.flags = self._load_feature_flags()
            
            self.initialized = True
            logger.info("Feature flag service initialized successfully")
            
            # Log current flag status
            for flag, config in self.flags.items():
                logger.info(f"Feature flag {flag.value}: enabled={config['enabled']}, rollout={config['rollout_percentage']}%")
                
        except Exception as e:
            logger.error(f"Failed to initialize feature flag service: {e}")
            raise
    
    def is_enabled(
        self, 
        flag: FeatureFlag, 
        child_age: Optional[int] = None,
        child_id: Optional[str] = None,
        user_percentage: Optional[float] = None
    ) -> bool:
        """
        Check if a feature flag is enabled for the given context
        
        Args:
            flag: The feature flag to check
            child_age: Age of the child (for age group targeting)
            child_id: Child ID (for percentage-based rollout)
            user_percentage: User percentage (0-100) for rollout calculation
        
        Returns:
            bool: True if feature is enabled for this context
        """
        if not self.initialized:
            logger.warning("Feature flag service not initialized, using default configuration")
            return False
        
        flag_config = self.flags.get(flag, {})
        
        # Check if flag is globally enabled
        if not flag_config.get("enabled", False):
            return False
        
        # Check age group targeting
        if child_age is not None:
            age_band = self._get_age_band(child_age)
            target_age_groups = flag_config.get("target_age_groups", [])
            if target_age_groups and age_band not in target_age_groups:
                return False
        
        # Check rollout percentage
        rollout_percentage = flag_config.get("rollout_percentage", 0)
        if rollout_percentage < 100:
            # Use child_id for consistent rollout or generate percentage
            if child_id:
                child_percentage = self._calculate_user_percentage(child_id)
            elif user_percentage is not None:
                child_percentage = user_percentage
            else:
                # Fallback to random percentage (not recommended for production)
                import random
                child_percentage = random.randint(0, 100)
            
            if child_percentage > rollout_percentage:
                return False
        
        return True
    
    def get_enabled_flags(
        self, 
        child_age: Optional[int] = None,
        child_id: Optional[str] = None
    ) -> List[FeatureFlag]:
        """Get list of enabled flags for the given context"""
        enabled_flags = []
        
        for flag in FeatureFlag:
            if self.is_enabled(flag, child_age, child_id):
                enabled_flags.append(flag)
        
        return enabled_flags
    
    def get_flag_config(self, flag: FeatureFlag) -> Dict[str, Any]:
        """Get configuration for a specific flag"""
        return self.flags.get(flag, {})
    
    def get_all_flags(self) -> Dict[FeatureFlag, Dict[str, Any]]:
        """Get all flag configurations"""
        return self.flags.copy()
    
    async def update_flag(
        self, 
        flag: FeatureFlag, 
        enabled: Optional[bool] = None,
        rollout_percentage: Optional[int] = None,
        target_age_groups: Optional[List[str]] = None
    ):
        """
        Update feature flag configuration
        (In production, this would update the database)
        """
        if flag not in self.flags:
            self.flags[flag] = self.default_flags.get(flag, {}).copy()
        
        config = self.flags[flag]
        
        if enabled is not None:
            config["enabled"] = enabled
        if rollout_percentage is not None:
            config["rollout_percentage"] = max(0, min(100, rollout_percentage))
        if target_age_groups is not None:
            config["target_age_groups"] = target_age_groups
        
        logger.info(f"Updated feature flag {flag.value}: {config}")
    
    def _load_feature_flags(self) -> Dict[FeatureFlag, Dict[str, Any]]:
        """Load feature flags from environment variables or configuration"""
        flags = {}
        
        # Start with default configuration
        for flag, config in self.default_flags.items():
            flags[flag] = config.copy()
        
        # Override with environment variables if present
        for flag in FeatureFlag:
            env_key = f"FEATURE_FLAG_{flag.value}"
            env_value = os.getenv(env_key)
            
            if env_value is not None:
                try:
                    # Try to parse as JSON for complex configuration
                    if env_value.startswith('{'):
                        flag_config = json.loads(env_value)
                        flags[flag].update(flag_config)
                    else:
                        # Simple boolean toggle
                        flags[flag]["enabled"] = env_value.lower() in ['true', '1', 'yes', 'on']
                except json.JSONDecodeError:
                    logger.warning(f"Invalid JSON for feature flag {flag.value}: {env_value}")
                    # Treat as boolean
                    flags[flag]["enabled"] = env_value.lower() in ['true', '1', 'yes', 'on']
        
        return flags
    
    def _get_age_band(self, age: int) -> str:
        """Convert age to age band string"""
        if age <= 10:
            return "AGE_8_10"
        elif age <= 13:
            return "AGE_11_13"
        elif age <= 16:
            return "AGE_14_16"
        else:
            return "AGE_17_PLUS"
    
    def _calculate_user_percentage(self, child_id: str) -> float:
        """
        Calculate consistent percentage for user-based rollout
        Uses hash of child_id to ensure consistency
        """
        import hashlib
        
        # Create hash of child_id
        hash_object = hashlib.md5(child_id.encode())
        hash_hex = hash_object.hexdigest()
        
        # Convert first 8 characters to integer and calculate percentage
        hash_int = int(hash_hex[:8], 16)
        percentage = (hash_int % 100)
        
        return percentage

# Global feature flag service instance
feature_flag_service = FeatureFlagService()

# Convenience functions for common usage patterns
async def is_enhanced_bias_detection_enabled(child_age: int, child_id: str) -> bool:
    """Check if enhanced bias detection is enabled"""
    return feature_flag_service.is_enabled(
        FeatureFlag.ENHANCED_BIAS_DETECTION, 
        child_age=child_age, 
        child_id=child_id
    )

async def is_predictive_risk_assessment_enabled(child_age: int, child_id: str) -> bool:
    """Check if predictive risk assessment is enabled"""
    return feature_flag_service.is_enabled(
        FeatureFlag.PREDICTIVE_RISK_ASSESSMENT,
        child_age=child_age,
        child_id=child_id
    )

async def is_emotion_aware_kidgpt_enabled(child_age: int, child_id: str) -> bool:
    """Check if emotion-aware KidGPT is enabled"""
    return feature_flag_service.is_enabled(
        FeatureFlag.EMOTION_AWARE_KIDGPT,
        child_age=child_age,
        child_id=child_id
    )

async def is_cultural_bias_analysis_enabled(child_age: int, child_id: str) -> bool:
    """Check if cultural bias analysis is enabled"""
    return feature_flag_service.is_enabled(
        FeatureFlag.CULTURAL_BIAS_ANALYSIS,
        child_age=child_age,
        child_id=child_id
    )

async def is_crisis_detection_enabled(child_age: int, child_id: str) -> bool:
    """Check if crisis detection is enabled"""
    return feature_flag_service.is_enabled(
        FeatureFlag.CRISIS_DETECTION,
        child_age=child_age,
        child_id=child_id
    )