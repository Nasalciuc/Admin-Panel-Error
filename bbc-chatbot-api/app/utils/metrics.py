"""Logging helper for pipeline metrics."""

import logging
import time
from dataclasses import dataclass
from typing import Optional

logger = logging.getLogger("bbc.metrics")


@dataclass
class PipelineMetric:
    conversation_id: str
    intent: str
    model_used: str
    cost: float
    latency_ms: int
    kb_hits: int
    tunnel: str


def log_metric(metric: PipelineMetric) -> None:
    """Structured log for each pipeline execution. V2 will push to Supabase."""
    logger.info(
        f"METRIC | conv={metric.conversation_id} "
        f"intent={metric.intent} model={metric.model_used} "
        f"cost=${metric.cost:.4f} latency={metric.latency_ms}ms "
        f"kb_hits={metric.kb_hits} tunnel={metric.tunnel}"
    )


class Timer:
    """Simple context-manager timer for measuring pipeline steps."""

    def __init__(self) -> None:
        self._start: float = 0
        self.elapsed_ms: int = 0

    def __enter__(self) -> "Timer":
        self._start = time.perf_counter()
        return self

    def __exit__(self, *args) -> None:
        self.elapsed_ms = int((time.perf_counter() - self._start) * 1000)
