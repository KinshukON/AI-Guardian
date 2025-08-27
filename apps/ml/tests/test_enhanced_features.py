"""
Comprehensive Test Suite for Enhanced AIGuardian Features
Tests backward compatibility and new patent-worthy features
"""

import pytest
import asyncio
import json
from unittest.mock import Mock, patch
from typing import Dict, Any

# Import the services we want to test
import sys
sys.path.append('../')

from services.enhanced_bias_detector import EnhancedBiasDetector, CulturalContext, BiasType
from services.predictive_risk_assessor import PredictiveRiskAssessor, RiskLevel, RiskFactor
from services.enhanced_kidgpt import EnhancedKidGPTService, EmotionalState, CrisisLevel
from services.content_analyzer import ContentAnalyzer
from services.feature_flags import FeatureFlagService, FeatureFlag
from services.kidgpt import KidGPTService

class TestEnhancedBiasDetector:
    """Test suite for Enhanced Multi-Dimensional Bias Detection System"""
    
    @pytest.fixture
    async def bias_detector(self):
        detector = EnhancedBiasDetector()
        return detector
    
    @pytest.mark.asyncio
    async def test_comprehensive_bias_detection_backward_compatibility(self, bias_detector):
        """Test that enhanced bias detection maintains backward compatibility"""
        test_content = "This is a sample content for testing bias detection."
        child_age = 12
        
        result = await bias_detector.detect_comprehensive_bias(test_content, child_age)
        
        # Ensure backward compatible fields are present
        assert "bias_score" in result
        assert "bias_confidence" in result
        assert "stereotypes" in result
        assert "framing" in result
        assert "missing_perspectives" in result
        
        # Ensure enhanced fields are present
        assert "cultural_analysis" in result
        assert "intersectional_factors" in result
        assert "balanced_perspectives" in result
        assert "perspective_synthesis" in result
        assert "patent_metadata" in result
        
        # Validate data types and ranges
        assert isinstance(result["bias_score"], int)
        assert 0 <= result["bias_score"] <= 100
        assert isinstance(result["bias_confidence"], float)
        assert 0.0 <= result["bias_confidence"] <= 1.0
    
    @pytest.mark.asyncio
    async def test_cultural_bias_analysis(self, bias_detector):
        """Test cultural bias analysis with different contexts"""
        test_content = "Individual achievement and personal success are the most important values."
        
        # Test Western context
        western_result = await bias_detector.analyze_cultural_bias(test_content, "western")
        assert western_result["cultural_context"] == "western"
        assert "representation_score" in western_result
        assert "cultural_markers" in western_result
        assert "missing_perspectives" in western_result
        
        # Test Eastern context
        eastern_result = await bias_detector.analyze_cultural_bias(test_content, "eastern")
        assert eastern_result["cultural_context"] == "eastern"
        
        # Cultural analysis should differ based on context
        assert western_result["cultural_markers"] != eastern_result["cultural_markers"]
    
    @pytest.mark.asyncio
    async def test_intersectional_bias_analysis(self, bias_detector):
        """Test intersectional bias detection"""
        test_content = "Women are naturally better caregivers and men are natural leaders."
        
        result = await bias_detector.analyze_intersectional_bias(test_content)
        
        assert "individual_biases" in result
        assert "intersectional_amplifications" in result
        assert "intersectional_insights" in result
        assert "overall_intersectional_score" in result
        
        # Should detect gender bias
        gender_bias = result["individual_biases"].get("gender", {})
        assert gender_bias.get("confidence", 0) > 0.5
    
    @pytest.mark.asyncio
    async def test_balanced_perspective_generation(self, bias_detector):
        """Test balanced perspective generation"""
        test_content = "Competition is the best way to motivate people to achieve their goals."
        bias_data = {"stereotypes": ["competitive individualism"]}
        cultural_data = {"underrepresented_groups": ["collectivist cultures"]}
        
        result = await bias_detector.generate_balanced_perspective(
            test_content, bias_data, cultural_data
        )
        
        assert hasattr(result, 'primary_perspective')
        assert hasattr(result, 'alternative_perspective')
        assert hasattr(result, 'synthesis')
        assert hasattr(result, 'citations')
        
        # Check that alternative perspective addresses bias
        assert result.primary_perspective["summary"]
        assert result.alternative_perspective["summary"]
        assert result.synthesis["balanced_summary"]

class TestPredictiveRiskAssessor:
    """Test suite for Predictive Risk Assessment Engine"""
    
    @pytest.fixture
    async def risk_assessor(self):
        assessor = PredictiveRiskAssessor()
        await assessor.initialize()
        return assessor
    
    @pytest.mark.asyncio
    async def test_comprehensive_risk_assessment(self, risk_assessor):
        """Test comprehensive risk assessment functionality"""
        test_content = "This is test content with some violent themes."
        child_id = "test_child_123"
        child_age = 10
        
        result = await risk_assessor.assess_risk(test_content, "text", child_id, child_age)
        
        # Validate required fields
        assert "composite_risk_score" in result
        assert "risk_level" in result
        assert "risk_confidence" in result
        assert "risk_factors" in result
        assert "intervention_triggers" in result
        assert "risk_trend" in result
        assert "predictions" in result
        assert "recommendations" in result
        assert "patent_metadata" in result
        
        # Validate data types and ranges
        assert isinstance(result["composite_risk_score"], float)
        assert 0.0 <= result["composite_risk_score"] <= 1.0
        assert result["risk_level"] in ["low", "medium", "high", "critical"]
        
        # Validate risk factors
        risk_factors = result["risk_factors"]
        required_factors = ["content_safety", "behavioral_pattern", "temporal_factor", 
                          "emotional_indicator", "cumulative_exposure"]
        for factor in required_factors:
            assert factor in risk_factors
            assert 0.0 <= risk_factors[factor] <= 1.0
    
    @pytest.mark.asyncio
    async def test_age_based_risk_adaptation(self, risk_assessor):
        """Test that risk assessment adapts based on child age"""
        test_content = "Content with mild violence"
        child_id = "test_child_123"
        
        # Test young child (higher risk sensitivity)
        young_result = await risk_assessor.assess_risk(test_content, "text", child_id, 8)
        
        # Test teenager (lower risk sensitivity)
        teen_result = await risk_assessor.assess_risk(test_content, "text", child_id, 16)
        
        # Young children should generally have higher risk scores for the same content
        assert young_result["composite_risk_score"] >= teen_result["composite_risk_score"]
    
    @pytest.mark.asyncio
    async def test_intervention_triggers(self, risk_assessor):
        """Test intervention trigger generation"""
        # High-risk content
        high_risk_content = "Very violent and inappropriate content with multiple risk factors"
        child_id = "test_child_123"
        child_age = 10
        
        result = await risk_assessor.assess_risk(high_risk_content, "text", child_id, child_age)
        
        if result["risk_level"] in ["high", "critical"]:
            assert len(result["intervention_triggers"]) > 0
            
            # Check intervention trigger structure
            for trigger in result["intervention_triggers"]:
                assert "risk_level" in trigger
                assert "trigger_type" in trigger
                assert "description" in trigger
                assert "recommended_actions" in trigger
                assert "urgency" in trigger

class TestEnhancedKidGPT:
    """Test suite for Emotion-Aware AI Mentoring"""
    
    @pytest.fixture
    async def enhanced_kidgpt(self):
        service = EnhancedKidGPTService()
        await service.initialize()
        return service
    
    @pytest.mark.asyncio
    async def test_emotional_state_detection(self, enhanced_kidgpt):
        """Test emotional state detection"""
        # Test sad emotion
        sad_message = "I'm feeling really sad and upset today. Everything seems terrible."
        child_id = "test_child_123"
        child_age = 12
        
        result = await enhanced_kidgpt.generate_response(
            sad_message, "resilience", child_id, child_age
        )
        
        assert "emotional_analysis" in result
        emotional_analysis = result["emotional_analysis"]
        
        assert "detected_emotion" in emotional_analysis
        assert "confidence" in emotional_analysis
        assert "support_needed" in emotional_analysis
        
        # Should detect sadness
        assert emotional_analysis["detected_emotion"] in ["sad", "frustrated", "anxious"]
        assert emotional_analysis["confidence"] > 0.6
        assert emotional_analysis["support_needed"] is True
    
    @pytest.mark.asyncio
    async def test_crisis_detection(self, enhanced_kidgpt):
        """Test crisis detection algorithms"""
        # Test various crisis levels
        crisis_messages = [
            ("I hate myself and feel worthless", "high"),
            ("I'm a bit sad today", "low"),
            ("Everything is fine and I'm happy", "none")
        ]
        
        child_id = "test_child_123"
        child_age = 14
        
        for message, expected_level in crisis_messages:
            result = await enhanced_kidgpt.generate_response(
                message, "resilience", child_id, child_age
            )
            
            assert "crisis_assessment" in result
            crisis_assessment = result["crisis_assessment"]
            
            assert "level" in crisis_assessment
            assert "requires_intervention" in crisis_assessment
            
            # Crisis level should match expectations
            if expected_level == "none":
                assert crisis_assessment["level"] == "none"
                assert crisis_assessment["requires_intervention"] is False
            elif expected_level == "high":
                assert crisis_assessment["level"] in ["medium", "high", "critical"]
                assert crisis_assessment["requires_intervention"] is True
    
    @pytest.mark.asyncio
    async def test_age_appropriate_responses(self, enhanced_kidgpt):
        """Test age-appropriate response generation"""
        message = "I don't understand this math problem"
        child_id = "test_child_123"
        
        # Test young child response
        young_result = await enhanced_kidgpt.generate_response(
            message, "homework", child_id, 8
        )
        
        # Test teenager response
        teen_result = await enhanced_kidgpt.generate_response(
            message, "homework", child_id, 16
        )
        
        # Responses should be different lengths and complexity
        young_response = young_result["response"]
        teen_response = teen_result["response"]
        
        assert len(young_response) <= len(teen_response) * 1.2  # Young response should be shorter
        
        # Check age adaptation metadata
        assert young_result["response_metadata"]["age_adaptation"] == 8
        assert teen_result["response_metadata"]["age_adaptation"] == 16

class TestFeatureFlagService:
    """Test suite for Feature Flag System"""
    
    @pytest.fixture
    async def feature_service(self):
        service = FeatureFlagService()
        await service.initialize()
        return service
    
    @pytest.mark.asyncio
    async def test_feature_flag_initialization(self, feature_service):
        """Test feature flag service initialization"""
        assert feature_service.initialized is True
        
        # All required flags should be present
        required_flags = [
            FeatureFlag.ENHANCED_BIAS_DETECTION,
            FeatureFlag.PREDICTIVE_RISK_ASSESSMENT,
            FeatureFlag.EMOTION_AWARE_KIDGPT,
            FeatureFlag.CULTURAL_BIAS_ANALYSIS,
            FeatureFlag.CRISIS_DETECTION
        ]
        
        for flag in required_flags:
            assert flag in feature_service.flags
    
    @pytest.mark.asyncio
    async def test_age_based_feature_targeting(self, feature_service):
        """Test age-based feature targeting"""
        # Test different age groups
        test_cases = [
            (8, "AGE_8_10"),
            (12, "AGE_11_13"),
            (15, "AGE_14_16"),
            (18, "AGE_17_PLUS")
        ]
        
        for age, expected_band in test_cases:
            band = feature_service._get_age_band(age)
            assert band == expected_band
    
    @pytest.mark.asyncio
    async def test_rollout_percentage_logic(self, feature_service):
        """Test percentage-based rollout"""
        child_id = "test_child_123"
        
        # Test consistent percentage calculation
        percentage1 = feature_service._calculate_user_percentage(child_id)
        percentage2 = feature_service._calculate_user_percentage(child_id)
        
        assert percentage1 == percentage2  # Should be consistent
        assert 0 <= percentage1 <= 99  # Should be in valid range
    
    @pytest.mark.asyncio
    async def test_feature_flag_updates(self, feature_service):
        """Test feature flag updates"""
        test_flag = FeatureFlag.ENHANCED_BIAS_DETECTION
        
        # Update flag configuration
        await feature_service.update_flag(
            test_flag,
            enabled=False,
            rollout_percentage=50
        )
        
        config = feature_service.get_flag_config(test_flag)
        assert config["enabled"] is False
        assert config["rollout_percentage"] == 50

class TestBackwardCompatibility:
    """Test suite for ensuring backward compatibility"""
    
    @pytest.mark.asyncio
    async def test_content_analyzer_backward_compatibility(self):
        """Test that content analyzer maintains backward compatibility"""
        analyzer = ContentAnalyzer()
        await analyzer.initialize()
        
        # Test with minimal parameters (old API)
        result = await analyzer.analyze(
            content="Test content",
            content_type="text",
            child_age=12
        )
        
        # All legacy fields should be present
        required_fields = [
            "safety_score", "safety_confidence", "safety_flags", "safety_evidence",
            "quality_score", "quality_confidence", "factuality", "depth", "clarity",
            "bias_score", "bias_confidence", "stereotypes", "framing", "missing_perspectives",
            "age_fit", "recommendations", "overall_confidence"
        ]
        
        for field in required_fields:
            assert field in result, f"Missing required field: {field}"
    
    @pytest.mark.asyncio
    async def test_kidgpt_backward_compatibility(self):
        """Test that KidGPT maintains backward compatibility"""
        service = KidGPTService()
        await service.initialize()
        
        # Test with minimal parameters (old API)
        result = await service.generate_response(
            message="Hello",
            mode="homework",
            child_age=12
        )
        
        # Legacy fields should be present
        required_fields = ["response", "mode", "confidence", "citations", "safety_flags"]
        
        for field in required_fields:
            assert field in result, f"Missing required field: {field}"

class TestPerformanceAndSafety:
    """Test suite for performance and safety validation"""
    
    @pytest.mark.asyncio
    async def test_response_time_performance(self):
        """Test that enhanced features don't significantly impact performance"""
        import time
        
        analyzer = ContentAnalyzer()
        await analyzer.initialize()
        
        test_content = "This is a test content for performance analysis."
        
        # Measure response time
        start_time = time.time()
        result = await analyzer.analyze(
            content=test_content,
            content_type="text",
            child_age=12,
            child_id="test_child_123",
            cultural_context="western"
        )
        end_time = time.time()
        
        response_time = end_time - start_time
        
        # Response should complete within reasonable time (adjust as needed)
        assert response_time < 10.0, f"Response time too slow: {response_time}s"
        assert result is not None
    
    @pytest.mark.asyncio
    async def test_crisis_detection_accuracy(self):
        """Test crisis detection accuracy and safety"""
        service = EnhancedKidGPTService()
        await service.initialize()
        
        # Test cases with expected crisis levels
        crisis_test_cases = [
            ("I want to hurt myself", "high"),
            ("I feel a bit sad", "low"),
            ("I'm having a great day", "none"),
            ("Nobody cares about me and I hate everything", "medium"),
        ]
        
        child_id = "test_child_123"
        child_age = 14
        
        for message, expected_min_level in crisis_test_cases:
            result = await service.generate_response(
                message, "resilience", child_id, child_age
            )
            
            crisis_level = result["crisis_assessment"]["level"]
            
            # Ensure crisis detection is appropriately sensitive
            if expected_min_level == "high":
                assert crisis_level in ["medium", "high", "critical"]
            elif expected_min_level == "none":
                assert crisis_level in ["none", "low"]

# Test data integrity and validation
class TestDataIntegrity:
    """Test suite for data integrity and validation"""
    
    @pytest.mark.asyncio
    async def test_enhanced_analysis_data_structure(self):
        """Test that enhanced analysis maintains proper data structure"""
        bias_detector = EnhancedBiasDetector()
        
        result = await bias_detector.detect_comprehensive_bias(
            "Test content", 12, "western"
        )
        
        # Validate nested structure integrity
        assert isinstance(result["cultural_analysis"], dict)
        assert isinstance(result["intersectional_factors"], dict)
        
        # Validate that scores are in correct ranges
        cultural_analysis = result["cultural_analysis"]
        assert 0.0 <= cultural_analysis["representation_score"] <= 1.0
        assert isinstance(cultural_analysis["cultural_markers"], list)
        assert isinstance(cultural_analysis["missing_perspectives"], list)
    
    @pytest.mark.asyncio
    async def test_risk_assessment_data_validation(self):
        """Test risk assessment data validation"""
        assessor = PredictiveRiskAssessor()
        await assessor.initialize()
        
        result = await assessor.assess_risk(
            "Test content", "text", "test_child_123", 12
        )
        
        # Validate all risk factors are present and in range
        risk_factors = result["risk_factors"]
        
        for factor_name, factor_value in risk_factors.items():
            assert isinstance(factor_value, (int, float))
            assert 0.0 <= factor_value <= 1.0, f"Risk factor {factor_name} out of range: {factor_value}"
        
        # Validate composite score calculation
        composite_score = result["composite_risk_score"]
        assert isinstance(composite_score, float)
        assert 0.0 <= composite_score <= 1.0

# Integration tests
class TestIntegration:
    """Integration test suite"""
    
    @pytest.mark.asyncio
    async def test_end_to_end_enhanced_analysis(self):
        """Test complete end-to-end enhanced analysis workflow"""
        # Initialize all services
        analyzer = ContentAnalyzer()
        await analyzer.initialize()
        
        # Perform comprehensive analysis
        test_content = "This is a story about a young hero who overcomes challenges through individual determination and personal strength."
        
        result = await analyzer.analyze(
            content=test_content,
            content_type="text",
            child_age=13,
            child_id="test_child_123",
            cultural_context="western"
        )
        
        # Verify all enhanced features are present when enabled
        if result.get("enhanced_bias_analysis"):
            assert "cultural_analysis" in result["enhanced_bias_analysis"]
            assert "balanced_perspectives" in result["enhanced_bias_analysis"]
        
        if result.get("risk_assessment"):
            assert "composite_risk_score" in result["risk_assessment"]
            assert "risk_level" in result["risk_assessment"]
        
        # Verify backward compatibility
        legacy_fields = ["safety_score", "quality_score", "bias_score"]
        for field in legacy_fields:
            assert field in result

if __name__ == "__main__":
    # Run tests
    pytest.main([__file__, "-v", "--tb=short"])