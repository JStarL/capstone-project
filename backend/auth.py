

def login_backend(cur, email, password):

    # NOTE: The token used is their 'email' for now,
    # since managers and staff are stored in different tables
    
    invalid_email = { 'error': 'invalid email' }
    invalid_password = { 'error': 'invalid password' }
    logged_in = { 'success': 'logged in' }

    query = """
    select password, id, menu_id, staff_type from staff where email = %s;
    """

    cur.execute(query, [email])
    list1 = cur.fetchall()
    
    if len(list1) == 0:
        return invalid_email
    else:
        # Access and compare staff's password
        logged_in_tuple = list1[0]
        if password == logged_in_tuple[0]:
            logged_in['staff_id'] = logged_in_tuple[1]
            logged_in['menu_id'] = logged_in_tuple[2]
            
            staff_type = logged_in_tuple[3]
            if staff_type == 'M':
                logged_in['staff_type'] = 'manager'
            elif staff_type == 'W':
                logged_in['staff_type'] = 'wait'
            elif staff_type == 'K':
                logged_in['staff_type'] = 'kitchen'
            else:
                logged_in['staff_type'] = 'invalid'
            return logged_in
        else:
            return invalid_password