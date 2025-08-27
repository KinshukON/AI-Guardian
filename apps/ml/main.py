from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn
import os
from datetime import datetime
from dotenv import load_dotenv

from services.content_analyzer import ContentAnalyzer
from services.kidgpt import KidGPTService
from services.safety_detector import SafetyDetector
from services.bias_detector import BiasDetector
from services.quality_scorer import QualityScorer
from utils.auth import verify_api_key
from utils.logging import setup_logging

# Load environment variables
load_dotenv()

# Setup logging
logger = setup_logging()

# Initialize FastAPI app
app = FastAPI(
    title="AI Guardian ML Service",
    description="Machine Learning service for content analysis, safety detection, and KidGPT responses",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Initialize services
content_analyzer = ContentAnalyzer()
safety_detector = SafetyDetector()
bias_detector = BiasDetector()
quality_scorer = QualityScorer()
kidgpt_service = KidGPTService()

# Pydantic models
class ContentAnalysisRequest(BaseModel):
    content: str
    content_type: str  # 'text', 'video', 'chat', 'url'
    child_age: int
    source: Optional[str] = None
    uri: Optional[str] = None

class ContentAnalysisResponse(BaseModel):
    safety_score: int
    safety_confidence: float
    safety_flags: List[str]
    safety_evidence: List[str]
    
    quality_score: int
    quality_confidence: float
    factuality: int
    depth: int
    clarity: int
    
    bias_score: int
    bias_confidence: float
    stereotypes: List[str]
    framing: str
    missing_perspectives: List[str]
    
    age_fit: str
    recommendations: List[str]
    overall_confidence: float

class KidGPTRequest(BaseModel):
    message: str
    mode: str  # 'homework', 'curiosity', 'resilience', 'digital'
    child_id: Optional[str] = None
    child_age: Optional[int] = None
    explain_like_12: bool = False

class KidGPTResponse(BaseModel):
    content: str
    citations: Optional[List[Dict[str, str]]] = None
    safety_flags: Optional[List[str]] = None
    mode: str  # 'regular' or 'simple'
    confidence: float

class HealthResponse(BaseModel):
    status: str
    services: Dict[str, str]
    timestamp: str

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    try:
        logger.info("Initializing ML services...")
        
        # Initialize models (this would load the actual ML models)
        await content_analyzer.initialize()
        await safety_detector.initialize()
        await bias_detector.initialize()
        await quality_scorer.initialize()
        await kidgpt_service.initialize()
        
        logger.info("ML services initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize ML services: {e}")
        raise

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        services={
            "content_analyzer": "ready",
            "safety_detector": "ready",
            "bias_detector": "ready",
            "quality_scorer": "ready",
            "kidgpt": "ready"
        },
        timestamp=__import__("datetime").datetime.now().isoformat()
    )

@app.post("/analyze", response_model=ContentAnalysisResponse)
async def analyze_content(
    request: ContentAnalysisRequest,
    background_tasks: BackgroundTasks,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Analyze content for safety, quality, and bias
    """
    # Verify API key
    if not verify_api_key(credentials.credentials):
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    try:
        logger.info(f"Analyzing content of type: {request.content_type}")
        
        # Perform content analysis
        analysis_result = await content_analyzer.analyze(
            content=request.content,
            content_type=request.content_type,
            child_age=request.child_age,
            source=request.source,
            uri=request.uri
        )
        
        # Log analysis for monitoring
        background_tasks.add_task(
            content_analyzer.log_analysis,
            request.content_type,
            analysis_result
        )
        
        return analysis_result
        
    except Exception as e:
        logger.error(f"Content analysis failed: {e}")
        raise HTTPException(status_code=500, detail="Content analysis failed")

@app.post("/coach", response_model=KidGPTResponse)
async def ask_kidgpt(
    request: KidGPTRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Get a response from KidGPT (values-aligned AI mentor)
    """
    # Verify API key
    if not verify_api_key(credentials.credentials):
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    try:
        logger.info(f"KidGPT request in mode: {request.mode}")
        
        # Get KidGPT response
        response = await kidgpt_service.generate_response(
            message=request.message,
            mode=request.mode,
            child_age=request.child_age or 12,
            child_id=request.child_id
        )
        
        return response
        
    except Exception as e:
        logger.error(f"KidGPT request failed: {e}")
        raise HTTPException(status_code=500, detail="KidGPT request failed")

@app.post("/safety/check")
async def check_safety(
    content: str,
    content_type: str = "text",
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Quick safety check endpoint
    """
    if not verify_api_key(credentials.credentials):
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    try:
        safety_result = await safety_detector.check_safety(content, content_type)
        return safety_result
    except Exception as e:
        logger.error(f"Safety check failed: {e}")
        raise HTTPException(status_code=500, detail="Safety check failed")

@app.post("/bias/detect")
async def detect_bias(
    content: str,
    content_type: str = "text",
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Bias detection endpoint
    """
    if not verify_api_key(credentials.credentials):
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    try:
        bias_result = await bias_detector.detect_bias(content, content_type)
        return bias_result
    except Exception as e:
        logger.error(f"Bias detection failed: {e}")
        raise HTTPException(status_code=500, detail="Bias detection failed")

@app.post("/quality/score")
async def score_quality(
    content: str,
    content_type: str = "text",
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Learning quality scoring endpoint
    """
    if not verify_api_key(credentials.credentials):
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    try:
        quality_result = await quality_scorer.score_quality(content, content_type)
        return quality_result
    except Exception as e:
        logger.error(f"Quality scoring failed: {e}")
        raise HTTPException(status_code=500, detail="Quality scoring failed")

@app.get("/models/status")
async def get_models_status(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Get status of ML models
    """
    if not verify_api_key(credentials.credentials):
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    try:
        return {
            "content_analyzer": await content_analyzer.get_status(),
            "safety_detector": await safety_detector.get_status(),
            "bias_detector": await bias_detector.get_status(),
            "quality_scorer": await quality_scorer.get_status(),
            "kidgpt": await kidgpt_service.get_status()
        }
    except Exception as e:
        logger.error(f"Failed to get models status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get models status")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8001))
    host = os.getenv("HOST", "0.0.0.0")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    ) 