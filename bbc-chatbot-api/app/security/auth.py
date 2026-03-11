"""HTTP Basic Auth — protects all /api/* endpoints.
/health remains public for Railway healthcheck.
If API_USER or API_PASS are empty, auth is DISABLED (dev mode).
"""

import logging
import secrets
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from typing import Optional
from config.settings import settings

logger = logging.getLogger(__name__)
security = HTTPBasic(auto_error=False)


def verify_credentials(
    request: Request,
    credentials: Optional[HTTPBasicCredentials] = Depends(security),
) -> str:
    """Verify HTTP Basic credentials. Returns username on success.
    
    If API_USER/API_PASS are empty (dev mode), allows all requests.
    """
    # Dev mode: no auth configured → allow everything
    if not settings.api_user or not settings.api_pass:
        return "dev"

    if credentials is None:
        logger.warning(f"No credentials provided | path={request.url.path}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Basic"},
        )

    correct_user = secrets.compare_digest(
        credentials.username.encode("utf-8"),
        settings.api_user.encode("utf-8"),
    )
    correct_pass = secrets.compare_digest(
        credentials.password.encode("utf-8"),
        settings.api_pass.encode("utf-8"),
    )

    if not (correct_user and correct_pass):
        logger.warning(f"Invalid credentials | user={credentials.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )

    return credentials.username
