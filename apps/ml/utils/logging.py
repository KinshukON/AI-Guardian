"""
Logging utilities for ML service
"""

import logging
import sys
from datetime import datetime

def setup_logging() -> logging.Logger:
    """
    Setup logging configuration for ML service
    """
    # Create logger
    logger = logging.getLogger("ml_service")
    logger.setLevel(logging.INFO)
    
    # Create console handler
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.INFO)
    
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    handler.setFormatter(formatter)
    
    # Add handler to logger
    if not logger.handlers:
        logger.addHandler(handler)
    
    return logger