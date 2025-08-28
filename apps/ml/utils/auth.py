"""
Authentication utilities for ML service
"""

import os
from typing import Optional

def verify_api_key(api_key: str) -> bool:
    """
    Verify API key for ML service authentication
    """
    expected_key = os.getenv("ML_API_KEY", "dev-key-123")
    return api_key == expected_key