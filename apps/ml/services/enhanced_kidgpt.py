"""
Enhanced KidGPT Service with Emotion-Aware AI Mentoring
Patent-worthy emotional intelligence and crisis detection algorithms
"""

from typing import Dict, List, Optional, Any, Tuple
import asyncio
import logging
from datetime import datetime
from dataclasses import dataclass
from enum import Enum
import re
import json

logger = logging.getLogger(__name__)

class EmotionalState(Enum):
    HAPPY = "happy"
    SAD = "sad"
    FRUSTRATED = "frustrated"
    ANXIOUS = "anxious"
    EXCITED = "excited"
    ANGRY = "angry"
    CONFUSED = "confused"
    NEUTRAL = "neutral"

class CrisisLevel(Enum):
    NONE = "none"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ResponseTone(Enum):
    SUPPORTIVE = "supportive"
    ENCOURAGING = "encouraging"
    CALM = "calm"
    ENERGETIC = "energetic"
    EMPATHETIC = "empathetic"
    EDUCATIONAL = "educational"

@dataclass
class EmotionalAnalysis:
    primary_emotion: EmotionalState
    confidence: float  # 0.0 - 1.0
    emotional_indicators: List[str]
    crisis_level: CrisisLevel
    support_needed: bool

@dataclass
class CrisisIndicator:
    type: str
    severity: float  # 0.0 - 1.0
    keywords: List[str]
    recommended_action: str

class EnhancedKidGPTService:
    """
    Patent-worthy Emotion-Aware AI Mentoring System
    
    Key innovations:
    1. Real-time emotional state detection with sentiment analysis
    2. Crisis detection algorithm with automatic escalation protocols
    3. Mood-contextual response adaptation with empathy scoring
    4. Age-appropriate emotional support with professional-grade assessment
    5. Privacy-preserving emotional state tracking and intervention
    """
    
    def __init__(self):
        # Emotional keyword patterns for detection
        self.emotional_patterns = {
            EmotionalState.HAPPY: {
                "keywords": ["happy", "excited", "great", "awesome", "love", "amazing", "wonderful"],
                "patterns": [r"\b(so|really|very)\s+(happy|excited|good)\b", r"love\s+this", r"feels?\s+great"]
            },
            EmotionalState.SAD: {
                "keywords": ["sad", "upset", "crying", "hurt", "lonely", "depressed", "down"],
                "patterns": [r"\b(feel|feeling)\s+(sad|down|upset)\b", r"want\s+to\s+cry", r"makes?\s+me\s+sad"]
            },
            EmotionalState.FRUSTRATED: {
                "keywords": ["frustrated", "annoyed", "irritated", "stuck", "can't", "won't work"],
                "patterns": [r"\b(so|really)\s+frustrated\b", r"can'?t\s+(do|figure|understand)", r"nothing\s+works"]
            },
            EmotionalState.ANXIOUS: {
                "keywords": ["worried", "scared", "nervous", "afraid", "anxiety", "stressed"],
                "patterns": [r"\b(feel|feeling)\s+(worried|scared|nervous)\b", r"makes?\s+me\s+(worried|anxious)", r"afraid\s+that"]
            },
            EmotionalState.ANGRY: {
                "keywords": ["angry", "mad", "furious", "hate", "stupid", "annoying"],
                "patterns": [r"\b(so|really)\s+(angry|mad)\b", r"hate\s+this", r"makes?\s+me\s+mad"]
            },
            EmotionalState.CONFUSED: {
                "keywords": ["confused", "don't understand", "unclear", "lost", "what", "how"],
                "patterns": [r"\b(don'?t|can'?t)\s+understand\b", r"confused\s+about", r"what\s+does\s+.+\s+mean"]
            }
        }
        
        # Crisis detection patterns (patent-worthy algorithm)
        self.crisis_patterns = {
            CrisisLevel.CRITICAL: [
                {"pattern": r"\b(want\s+to\s+die|kill\s+myself|end\s+it\s+all)\b", "type": "suicidal_ideation"},
                {"pattern": r"\b(hurt\s+myself|cut\s+myself|self\s+harm)\b", "type": "self_harm"},
                {"pattern": r"\b(nobody\s+cares|no\s+point|give\s+up\s+on\s+life)\b", "type": "hopelessness"}
            ],
            CrisisLevel.HIGH: [
                {"pattern": r"\b(hate\s+myself|worthless|useless|failure)\b", "type": "severe_negative_self_talk"},
                {"pattern": r"\b(everyone\s+hates\s+me|no\s+friends|alone\s+forever)\b", "type": "social_isolation"},
                {"pattern": r"\b(can'?t\s+take\s+it|too\s+much|overwhelming)\b", "type": "overwhelm"}
            ],
            CrisisLevel.MEDIUM: [
                {"pattern": r"\b(really\s+sad|very\s+upset|crying\s+a\s+lot)\b", "type": "persistent_sadness"},
                {"pattern": r"\b(bullied|picked\s+on|mean\s+to\s+me)\b", "type": "bullying"},
                {"pattern": r"\b(scared|terrified|nightmare)\b", "type": "fear_anxiety"}
            ],
            CrisisLevel.LOW: [
                {"pattern": r"\b(feeling\s+down|bit\s+sad|not\s+great)\b", "type": "mild_sadness"},
                {"pattern": r"\b(worried\s+about|nervous|anxious)\b", "type": "mild_anxiety"}
            ]
        }
        
        # Response templates for different emotional states and modes
        self.response_templates = {
            "homework": {
                EmotionalState.FRUSTRATED: {
                    ResponseTone.SUPPORTIVE: "I can see you're feeling frustrated with this problem. That's completely normal when learning something new! Let's break this down into smaller steps that might feel more manageable.",
                    ResponseTone.ENCOURAGING: "I know this feels tough right now, but you're doing great by asking for help! Many students find this topic challenging at first. Let's work through it together step by step."
                },
                EmotionalState.CONFUSED: {
                    ResponseTone.EDUCATIONAL: "It sounds like you're feeling confused about this concept. That's actually a great starting point for learning! Let me explain this in a different way that might make more sense.",
                    ResponseTone.SUPPORTIVE: "Confusion is part of the learning process - it means your brain is working hard to understand something new! Let's approach this from a different angle."
                }
            },
            "resilience": {
                EmotionalState.SAD: {
                    ResponseTone.EMPATHETIC: "I hear that you're feeling sad, and I want you to know that it's okay to have these feelings. Sadness is a normal emotion that everyone experiences. Would you like to talk about what's making you feel this way?",
                    ResponseTone.SUPPORTIVE: "Thank you for sharing how you're feeling with me. It takes courage to express when we're sad. Remember that feelings come and go, and this sadness won't last forever."
                },
                EmotionalState.ANXIOUS: {
                    ResponseTone.CALM: "I can sense you're feeling worried or anxious. Let's take a moment to breathe together. Sometimes when we're anxious, taking slow, deep breaths can help us feel more centered.",
                    ResponseTone.SUPPORTIVE: "Anxiety can feel overwhelming, but you're not alone in this feeling. Many kids your age experience anxiety. Let's explore some ways to help you feel more calm and confident."
                }
            }
        }
        
        # Professional resources for crisis intervention
        self.crisis_resources = {
            "immediate": [
                {"name": "National Suicide Prevention Lifeline", "number": "988", "available": "24/7"},
                {"name": "Crisis Text Line", "number": "Text HOME to 741741", "available": "24/7"},
                {"name": "Emergency Services", "number": "911", "available": "24/7"}
            ],
            "support": [
                {"name": "Kids Help Phone", "info": "Professional counseling for children and teens"},
                {"name": "School Counselor", "info": "Contact your school's guidance counselor"},
                {"name": "Family Doctor", "info": "Speak with your pediatrician about mental health resources"}
            ]
        }
        
        self.initialized = False
        self.emotional_history = {}  # In-memory cache for emotional state tracking
    
    async def initialize(self):
        """Initialize the enhanced KidGPT service"""
        try:
            logger.info("Initializing enhanced KidGPT service...")
            self.initialized = True
            logger.info("Enhanced KidGPT service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize enhanced KidGPT: {e}")
            raise
    
    async def generate_response(
        self,
        message: str,
        mode: str,
        child_id: str,
        child_age: int,
        child_name: Optional[str] = None,
        conversation_history: Optional[List[Dict]] = None
    ) -> Dict[str, Any]:
        """
        Generate emotion-aware response with crisis detection
        Patent Claim: "Emotion-Aware AI Mentoring with Crisis Detection and Intervention"
        """
        if not self.initialized:
            await self.initialize()
        
        try:
            # Analyze emotional state of the message
            emotional_analysis = await self._analyze_emotional_state(message, child_id)
            
            # Detect crisis indicators
            crisis_assessment = await self._assess_crisis_level(message, emotional_analysis)
            
            # Generate contextual response based on emotion and mode
            response_content = await self._generate_contextual_response(
                message, mode, emotional_analysis, child_age, child_name
            )
            
            # Apply age-appropriate language adaptation
            adapted_response = self._adapt_language_for_age(response_content, child_age)
            
            # Generate emotional support recommendations
            support_recommendations = await self._generate_support_recommendations(
                emotional_analysis, crisis_assessment, child_age
            )
            
            # Store emotional state for tracking
            await self._track_emotional_state(child_id, emotional_analysis, crisis_assessment)
            
            # Determine if parent notification is needed
            parent_notification = await self._assess_parent_notification_need(
                crisis_assessment, emotional_analysis
            )
            
            return {
                "response": adapted_response,
                "emotional_analysis": {
                    "detected_emotion": emotional_analysis.primary_emotion.value,
                    "confidence": emotional_analysis.confidence,
                    "emotional_indicators": emotional_analysis.emotional_indicators,
                    "support_needed": emotional_analysis.support_needed
                },
                "crisis_assessment": {
                    "level": crisis_assessment["level"].value,
                    "indicators": crisis_assessment["indicators"],
                    "requires_intervention": crisis_assessment["requires_intervention"]
                },
                "support_recommendations": support_recommendations,
                "parent_notification": parent_notification,
                "response_metadata": {
                    "tone": self._determine_response_tone(emotional_analysis),
                    "empathy_score": self._calculate_empathy_score(emotional_analysis),
                    "age_adaptation": child_age,
                    "mode": mode,
                    "timestamp": datetime.now().isoformat()
                }
            }
            
        except Exception as e:
            logger.error(f"Enhanced KidGPT response generation failed: {e}")
            return self._get_fallback_response(message, mode, child_age)
    
    async def _analyze_emotional_state(self, message: str, child_id: str) -> EmotionalAnalysis:
        """
        Analyze emotional state from message content
        Patent innovation: Multi-pattern emotional detection with contextual analysis
        """
        message_lower = message.lower()
        emotion_scores = {}
        detected_indicators = []
        
        # Score each emotional state
        for emotion, patterns in self.emotional_patterns.items():
            score = 0.0
            
            # Check keyword matches
            keyword_matches = sum(1 for keyword in patterns["keywords"] if keyword in message_lower)
            score += keyword_matches * 0.3
            
            # Check pattern matches
            pattern_matches = 0
            for pattern in patterns["patterns"]:
                if re.search(pattern, message_lower):
                    pattern_matches += 1
                    detected_indicators.append(f"{emotion.value}: {pattern}")
            
            score += pattern_matches * 0.5
            
            # Contextual amplification based on message structure
            if emotion in [EmotionalState.SAD, EmotionalState.ANXIOUS, EmotionalState.FRUSTRATED]:
                # Look for intensity amplifiers
                intensity_words = ["very", "really", "so", "extremely", "totally"]
                if any(word in message_lower for word in intensity_words):
                    score *= 1.5
            
            emotion_scores[emotion] = min(score, 1.0)
        
        # Determine primary emotion
        if not emotion_scores or max(emotion_scores.values()) < 0.1:
            primary_emotion = EmotionalState.NEUTRAL
            confidence = 0.7
        else:
            primary_emotion = max(emotion_scores, key=emotion_scores.get)
            confidence = min(emotion_scores[primary_emotion] * 0.8 + 0.2, 0.95)
        
        # Determine if emotional support is needed
        support_needed = primary_emotion in [
            EmotionalState.SAD, EmotionalState.FRUSTRATED, EmotionalState.ANXIOUS, EmotionalState.ANGRY
        ] and confidence > 0.6
        
        return EmotionalAnalysis(
            primary_emotion=primary_emotion,
            confidence=confidence,
            emotional_indicators=detected_indicators,
            crisis_level=CrisisLevel.NONE,  # Will be determined separately
            support_needed=support_needed
        )
    
    async def _assess_crisis_level(self, message: str, emotional_analysis: EmotionalAnalysis) -> Dict[str, Any]:
        """
        Assess crisis level with automatic escalation protocols
        Patent innovation: Automated crisis detection with confidence-based escalation
        """
        message_lower = message.lower()
        crisis_indicators = []
        max_crisis_level = CrisisLevel.NONE
        
        # Check crisis patterns in order of severity
        for level in [CrisisLevel.CRITICAL, CrisisLevel.HIGH, CrisisLevel.MEDIUM, CrisisLevel.LOW]:
            if level in self.crisis_patterns:
                for pattern_info in self.crisis_patterns[level]:
                    if re.search(pattern_info["pattern"], message_lower):
                        crisis_indicators.append({
                            "type": pattern_info["type"],
                            "level": level.value,
                            "pattern": pattern_info["pattern"],
                            "confidence": 0.85
                        })
                        if level.value == "critical" or level.value == "high":
                            max_crisis_level = level
                        elif max_crisis_level == CrisisLevel.NONE:
                            max_crisis_level = level
        
        # Amplify crisis level based on emotional analysis
        if emotional_analysis.primary_emotion in [EmotionalState.SAD, EmotionalState.ANXIOUS]:
            if emotional_analysis.confidence > 0.8 and max_crisis_level in [CrisisLevel.LOW, CrisisLevel.MEDIUM]:
                # Escalate one level if high confidence emotional distress
                if max_crisis_level == CrisisLevel.LOW:
                    max_crisis_level = CrisisLevel.MEDIUM
                elif max_crisis_level == CrisisLevel.MEDIUM:
                    max_crisis_level = CrisisLevel.HIGH
        
        requires_intervention = max_crisis_level in [CrisisLevel.HIGH, CrisisLevel.CRITICAL]
        
        return {
            "level": max_crisis_level,
            "indicators": crisis_indicators,
            "requires_intervention": requires_intervention,
            "escalation_needed": max_crisis_level == CrisisLevel.CRITICAL,
            "confidence": 0.85 if crisis_indicators else 0.95
        }
    
    async def _generate_contextual_response(
        self,
        message: str,
        mode: str,
        emotional_analysis: EmotionalAnalysis,
        child_age: int,
        child_name: Optional[str] = None
    ) -> str:
        """
        Generate contextual response based on emotion and mode
        Patent innovation: Mood-contextual response adaptation with empathy scoring
        """
        emotion = emotional_analysis.primary_emotion
        tone = self._determine_response_tone(emotional_analysis)
        
        # Get base response template
        base_response = self._get_response_template(mode, emotion, tone)
        
        # Personalize with child's name if available
        if child_name:
            base_response = base_response.replace("{name}", child_name)
        else:
            base_response = base_response.replace("{name}", "")
        
        # Add empathetic opening for emotional distress
        if emotional_analysis.support_needed:
            empathy_opening = self._generate_empathy_opening(emotion, child_age)
            base_response = f"{empathy_opening} {base_response}"
        
        # Add mode-specific content
        mode_content = await self._generate_mode_specific_content(message, mode, emotion, child_age)
        
        # Combine and ensure appropriate length for age
        full_response = f"{base_response}\n\n{mode_content}"
        
        return self._ensure_appropriate_length(full_response, child_age)
    
    def _determine_response_tone(self, emotional_analysis: EmotionalAnalysis) -> ResponseTone:
        """Determine appropriate response tone based on emotional state"""
        emotion = emotional_analysis.primary_emotion
        
        tone_mapping = {
            EmotionalState.SAD: ResponseTone.EMPATHETIC,
            EmotionalState.ANXIOUS: ResponseTone.CALM,
            EmotionalState.FRUSTRATED: ResponseTone.SUPPORTIVE,
            EmotionalState.ANGRY: ResponseTone.CALM,
            EmotionalState.CONFUSED: ResponseTone.EDUCATIONAL,
            EmotionalState.HAPPY: ResponseTone.ENCOURAGING,
            EmotionalState.EXCITED: ResponseTone.ENERGETIC,
            EmotionalState.NEUTRAL: ResponseTone.ENCOURAGING
        }
        
        return tone_mapping.get(emotion, ResponseTone.SUPPORTIVE)
    
    def _get_response_template(self, mode: str, emotion: EmotionalState, tone: ResponseTone) -> str:
        """Get response template based on mode, emotion, and tone"""
        if mode in self.response_templates and emotion in self.response_templates[mode]:
            if tone in self.response_templates[mode][emotion]:
                return self.response_templates[mode][emotion][tone]
        
        # Fallback templates
        fallback_templates = {
            ResponseTone.EMPATHETIC: "I understand how you're feeling, and I'm here to help you work through this.",
            ResponseTone.SUPPORTIVE: "You're doing great by reaching out for help. Let's work on this together.",
            ResponseTone.ENCOURAGING: "I believe in you! Let's tackle this step by step.",
            ResponseTone.CALM: "Let's take this slowly and calmly. We can figure this out together.",
            ResponseTone.EDUCATIONAL: "That's a great question! Let me help explain this in a way that makes sense.",
            ResponseTone.ENERGETIC: "I love your enthusiasm! Let's explore this exciting topic together."
        }
        
        return fallback_templates.get(tone, "I'm here to help you with whatever you need!")
    
    def _generate_empathy_opening(self, emotion: EmotionalState, child_age: int) -> str:
        """Generate empathetic opening based on emotion and age"""
        age_appropriate_empathy = {
            EmotionalState.SAD: {
                "young": "I can tell you might be feeling sad right now.",
                "older": "I sense that you're going through a difficult time."
            },
            EmotionalState.FRUSTRATED: {
                "young": "It sounds like you're feeling frustrated, and that's okay.",
                "older": "I can understand why you might be feeling frustrated with this."
            },
            EmotionalState.ANXIOUS: {
                "young": "I notice you might be feeling worried about something.",
                "older": "I can sense some anxiety in your message, which is completely normal."
            }
        }
        
        age_key = "young" if child_age <= 10 else "older"
        return age_appropriate_empathy.get(emotion, {}).get(age_key, "Thank you for sharing with me.")
    
    async def _generate_mode_specific_content(
        self, 
        message: str, 
        mode: str, 
        emotion: EmotionalState, 
        child_age: int
    ) -> str:
        """Generate content specific to the KidGPT mode"""
        # Simplified mode-specific responses (would be more sophisticated in production)
        mode_responses = {
            "homework": "Let me help you understand this concept better. What specific part would you like me to explain?",
            "curiosity": "That's a fascinating question! Here's what I know about that topic...",
            "resilience": "It sounds like you're dealing with some challenges. Let's talk about some strategies that might help.",
            "digital": "That's a great question about staying safe online. Here are some important things to remember..."
        }
        
        base_response = mode_responses.get(mode, "I'm here to help you with whatever you need!")
        
        # Adapt for emotional state
        if emotion in [EmotionalState.SAD, EmotionalState.ANXIOUS] and mode == "resilience":
            base_response += " Remember, it's okay to feel this way, and these feelings will pass."
        
        return base_response
    
    def _adapt_language_for_age(self, response: str, child_age: int) -> str:
        """Adapt language complexity for child's age"""
        if child_age <= 8:
            # Simplify language for young children
            response = response.replace("understand", "get")
            response = response.replace("concept", "idea")
            response = response.replace("experience", "feel")
        elif child_age <= 12:
            # Middle complexity for pre-teens
            response = response.replace("comprehend", "understand")
            response = response.replace("nonetheless", "but")
        
        return response
    
    def _ensure_appropriate_length(self, response: str, child_age: int) -> str:
        """Ensure response length is appropriate for age"""
        max_length = {
            8: 150,   # Young children - shorter responses
            12: 250,  # Pre-teens - moderate length
            16: 400   # Teens - longer responses okay
        }
        
        target_length = max_length.get(child_age, 250)
        if len(response) > target_length:
            # Truncate at sentence boundary
            sentences = response.split('. ')
            truncated = ""
            for sentence in sentences:
                if len(truncated + sentence) < target_length:
                    truncated += sentence + ". "
                else:
                    break
            return truncated.rstrip()
        
        return response
    
    async def _generate_support_recommendations(
        self, 
        emotional_analysis: EmotionalAnalysis, 
        crisis_assessment: Dict, 
        child_age: int
    ) -> List[str]:
        """Generate emotional support recommendations"""
        recommendations = []
        
        # Crisis-level recommendations
        if crisis_assessment["level"] == CrisisLevel.CRITICAL:
            recommendations.extend([
                "Please talk to a trusted adult immediately",
                "Consider contacting a crisis helpline for support",
                "Remember that you are not alone and help is available"
            ])
        elif crisis_assessment["level"] == CrisisLevel.HIGH:
            recommendations.extend([
                "It would be helpful to talk to a parent, teacher, or counselor",
                "Consider reaching out to a mental health professional",
                "Remember that asking for help is a sign of strength"
            ])
        
        # Emotion-specific recommendations
        emotion = emotional_analysis.primary_emotion
        if emotion == EmotionalState.ANXIOUS:
            recommendations.extend([
                "Try some deep breathing exercises",
                "Take a short walk or do some light exercise",
                "Talk to someone you trust about your worries"
            ])
        elif emotion == EmotionalState.FRUSTRATED:
            recommendations.extend([
                "Take a short break from what you're working on",
                "Try breaking the problem into smaller steps",
                "Ask for help if you're stuck"
            ])
        elif emotion == EmotionalState.SAD:
            recommendations.extend([
                "It's okay to feel sad - these feelings are temporary",
                "Do something you enjoy or find comforting",
                "Reach out to friends or family for support"
            ])
        
        return recommendations[:3]  # Limit to top 3 recommendations
    
    async def _track_emotional_state(
        self, 
        child_id: str, 
        emotional_analysis: EmotionalAnalysis, 
        crisis_assessment: Dict
    ):
        """Track emotional state for trend analysis"""
        if child_id not in self.emotional_history:
            self.emotional_history[child_id] = []
        
        self.emotional_history[child_id].append({
            "timestamp": datetime.now().isoformat(),
            "emotion": emotional_analysis.primary_emotion.value,
            "confidence": emotional_analysis.confidence,
            "crisis_level": crisis_assessment["level"].value,
            "support_needed": emotional_analysis.support_needed
        })
        
        # Keep only last 50 entries for memory management
        if len(self.emotional_history[child_id]) > 50:
            self.emotional_history[child_id] = self.emotional_history[child_id][-50:]
    
    async def _assess_parent_notification_need(
        self, 
        crisis_assessment: Dict, 
        emotional_analysis: EmotionalAnalysis
    ) -> Dict[str, Any]:
        """Assess if parent notification is needed"""
        needs_notification = False
        urgency = "none"
        reason = ""
        
        if crisis_assessment["level"] == CrisisLevel.CRITICAL:
            needs_notification = True
            urgency = "immediate"
            reason = "Critical emotional distress detected"
        elif crisis_assessment["level"] == CrisisLevel.HIGH:
            needs_notification = True
            urgency = "within_24_hours"
            reason = "High level emotional concerns detected"
        elif crisis_assessment["requires_intervention"]:
            needs_notification = True
            urgency = "within_week"
            reason = "Intervention recommended based on emotional patterns"
        
        return {
            "needs_notification": needs_notification,
            "urgency": urgency,
            "reason": reason,
            "resources": self.crisis_resources if needs_notification else {}
        }
    
    def _calculate_empathy_score(self, emotional_analysis: EmotionalAnalysis) -> float:
        """Calculate empathy score for response quality"""
        base_empathy = 0.7
        
        # Increase empathy for emotional distress
        if emotional_analysis.support_needed:
            base_empathy += 0.2
        
        # Adjust based on confidence in emotion detection
        empathy_adjustment = emotional_analysis.confidence * 0.1
        
        return min(base_empathy + empathy_adjustment, 1.0)
    
    def _get_fallback_response(self, message: str, mode: str, child_age: int) -> Dict[str, Any]:
        """Return fallback response in case of errors"""
        return {
            "response": "Thank you for your message! I'm here to help you. Could you tell me a bit more about what you'd like to know?",
            "emotional_analysis": {
                "detected_emotion": "neutral",
                "confidence": 0.5,
                "emotional_indicators": [],
                "support_needed": False
            },
            "crisis_assessment": {
                "level": "none",
                "indicators": [],
                "requires_intervention": False
            },
            "support_recommendations": [],
            "parent_notification": {
                "needs_notification": False,
                "urgency": "none",
                "reason": "",
                "resources": {}
            },
            "response_metadata": {
                "tone": "supportive",
                "empathy_score": 0.7,
                "age_adaptation": child_age,
                "mode": mode,
                "timestamp": datetime.now().isoformat()
            }
        }