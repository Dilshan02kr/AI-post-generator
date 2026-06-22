def generate_post(
        title: str,
        content: str,
        style: str
):
    return f"""Here is Gemini's generated post based on the following input:
    Title: {title}
Content: {content}
Style: {style}
"""