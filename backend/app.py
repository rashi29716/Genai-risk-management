from flask import Flask, jsonify, request
from flask_cors import CORS
from database import create_tables, connect_db
from risk_scoring import calculate_risk
from chatbot import chatbot_query
from project_agent import analyze_project
from database import insert_sample_data

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

create_tables()
insert_sample_data()

@app.route("/projects")
def get_projects():

    conn = connect_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM projects")

    projects = cur.fetchall()

    return jsonify(projects)


@app.route("/risk")
def get_risk():

    conn = connect_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM projects")

    projects = cur.fetchall()

    result = []

    for p in projects:

        risk = calculate_risk(p[3], p[4], p[5])

        result.append({
            "project": p[1],
            "risk": risk
        })

    return jsonify(result)


@app.route("/chatbot", methods=["POST"])
def chatbot():

    question = request.json["question"]

    answer = chatbot_query(question)

    return jsonify({"response": answer})


@app.route("/analyze", methods=["POST"])
def analyze_new_project():

    data = request.json

    name = data.get("name")

    delay = int(data.get("delay"))
    payment = data.get("payment")
    resources = int(data.get("resources"))

    risk = calculate_risk(delay, payment, resources)

    return jsonify({
        "project": name,
        "risk": risk
    })

if __name__ == "__main__":
    app.run(debug=True)
