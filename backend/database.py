import sqlite3

def connect_db():
    conn = sqlite3.connect("../data/projects.db")
    return conn


def create_tables():
    conn = connect_db()
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS projects(
        id INTEGER PRIMARY KEY,
        name TEXT,
        deadline TEXT,
        schedule_delay INTEGER,
        payment_status TEXT,
        resource_count INTEGER
    )
    """)

    conn.commit()
    conn.close()

def insert_sample_data():
    conn = connect_db()
    cur = conn.cursor()

    # check if table already has data
    cur.execute("SELECT COUNT(*) FROM projects")
    count = cur.fetchone()[0]

    if count == 0:
        cur.execute("""
        INSERT INTO projects (name, deadline, schedule_delay, payment_status, resource_count)
        VALUES
        ('Project Alpha', '2026-05-01', 7, 'Pending', 2),
        ('Project Beta', '2026-06-10', 2, 'Received', 5),
        ('Project Gamma', '2026-04-20', 10, 'Pending', 1)
        """)

    conn.commit()
    conn.close()