import psycopg2
import sys

print (sys.argv[1])
try:
    conn = psycopg2.connect('dbname=wait_management_system user=lubuntu password=lubuntu')
    print(conn)
    conn.close()
    print(conn)
except Exception as e:
    print( 'Unable to connect to database: ' + str(e))
