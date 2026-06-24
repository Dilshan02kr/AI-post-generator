from app.services.gemini_service import generate_post

try:
    result = generate_post(
        title="Test",
        content="Say hello in one short sentence.",
        style="professional"
    )

    print("SERVICE SUCCESS:")
    print(result)

except Exception as e:
    print("SERVICE ERROR:")
    print(type(e))
    print(e)

    if hasattr(e, "code"):
        print("App error code:", e.code)

    if hasattr(e, "message"):
        print("App error message:", e.message)

    if hasattr(e, "details"):
        print("App error details:", e.details)