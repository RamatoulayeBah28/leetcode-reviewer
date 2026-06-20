# Connect to the database
import psycopg2

def get_db():
    conn = psycopg2.connect(dbname="leetcode_review")
    try:
        yield conn
    finally:
        conn.close()
        