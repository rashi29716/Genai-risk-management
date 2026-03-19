import openai

openai.api_key = "YOUR_OPENAI_KEY"

def generate_report(project_name, risk_level, risks):

    prompt = f"""
    Generate a project risk report.

    Project: {project_name}
    Risk Level: {risk_level}

    Risks Detected:
    {risks}

    Suggest mitigation strategies.
    """

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role":"user","content":prompt}]
    )

    return response["choices"][0]["message"]["content"]