"""Request logging middleware — logs every request with timing."""

import logging
import time
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logger = logging.getLogger("bbc.access")


class RequestLoggerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())[:8]
        request.state.request_id = request_id
        start = time.perf_counter()

        response = await call_next(request)

        elapsed = int((time.perf_counter() - start) * 1000)
        logger.info(
            f"{request.method} {request.url.path} | "
            f"{response.status_code} | {elapsed}ms | rid={request_id}"
        )
        response.headers["X-Request-ID"] = request_id
        return response
