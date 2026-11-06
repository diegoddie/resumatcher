import os
import jwt
from fastapi import Header, HTTPException

ALLOWED_ORIGINS = ["http://localhost:3000", "https://resumatcher.vercel.app", "https://resumatcher.xyz", "https://www.resumatcher.xyz"]

_jwks_client: jwt.PyJWKClient | None = None

def _get_jwks_client() -> jwt.PyJWKClient:
    global _jwks_client
    if _jwks_client is None:
        jwks_url = os.getenv("CLERK_JWKS_URL")
        if not jwks_url:
            raise HTTPException(status_code=500, detail="CLERK_JWKS_URL is not configured")
        _jwks_client = jwt.PyJWKClient(jwks_url)
    return _jwks_client

def get_current_user_id(authorization: str | None = Header(default=None)) -> str:
    """ Verify the Clerk session token sent by the frontend and return the Clerk user id. """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")

    token = authorization.removeprefix("Bearer ").strip()

    try:
        signing_key = _get_jwks_client().get_signing_key_from_jwt(token)
        claims = jwt.decode(token, signing_key.key, algorithms=["RS256"], options={"require": ["exp", "sub"]}, leeway=5)
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")

    # azp is the origin the token was issued to
    if claims.get("azp") and claims["azp"] not in ALLOWED_ORIGINS:
        raise HTTPException(status_code=401, detail="Invalid token origin")

    return claims["sub"]
