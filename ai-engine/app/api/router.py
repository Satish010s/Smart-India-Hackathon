from fastapi import APIRouter

api_router = APIRouter()

# Sub-routers will be registered here as features are implemented, e.g.:
# from app.quantum.simulators.router import router as quantum_router
# from app.ai.tutor.router import router as tutor_router
# api_router.include_router(quantum_router, prefix="/quantum", tags=["quantum"])
# api_router.include_router(tutor_router, prefix="/ai", tags=["ai"])
