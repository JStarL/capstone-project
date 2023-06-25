db_conn = None


def login_backend(cur, email, password):
    
    # This Login is for both managers and staff
    # whose information is stored in 2 diff tables
    # so we need to check both tables

    # NOTE: The token used is their 'email' for now,
    # since managers and staff are stored in different tables
    
    invalid_email = { 'error': 'invalid email' }
    invalid_password = { 'error': 'invalid password' }
    logged_in = { 'success': 'logged in' }


    query1 = """
    select password from managers where email = %s;
    """
    query2 = """
    select password from staff where email = %s;
    """

    cur.execute(query1, [email])
    list1 = cur.fetchall()
    
    if len(list1) == 0:
        # Not a manager, maybe a staff
        cur.execute(query2, [email])
        list1 = cur.fetchall()
        if len(list1) == 0:
            # nobody has this email
            return invalid_email
        # Access and compare staff's password
        if password == list1[0][0]:
            return logged_in
        else:
            return invalid_password
    else:
        # Access and compare manager's password
        if password == list1[0][0]:
            return logged_in
        else:
            return invalid_password