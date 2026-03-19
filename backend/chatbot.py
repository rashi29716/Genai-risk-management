from database import connect_db
from risk_scoring import calculate_risk

def chatbot_query(question):

    conn = connect_db()
    cur = conn.cursor()

    if "projects" in question:

        cur.execute("SELECT * FROM projects")

        data = cur.fetchall()

        return str(data)

    if "risk" in question:

        cur.execute("SELECT * FROM projects")

        projects = cur.fetchall()

        result = []

        for p in projects:

            risk = calculate_risk(p[3], p[4], p[5])

            result.append(f"{p[1]} : {risk}")

        return result

    return "Please ask about project risks."