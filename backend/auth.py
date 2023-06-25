

def login_backend(cur, email, password):
    
    # This Login is for both managers and staff
    # whose information is stored in 2 diff tables
    # so we need to check both tables

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
        if password == list1[0][0]:
            logged_in['staff_id'] = list[0][1]
            logged_in['menu_id'] = list[0][2]
            
            staff_type = list[0][3]
            if staff_type == 'M':
                logged_in['staff_type'] = 'manager'
            elif staff_type == 'W':
                logged_in['staff_type'] = 'wait'
            elif staff_type == 'K':
                logged_in['staff_type'] = 'kitchen'
            else
                logged_in['staff_type'] = 'invalid'
            return logged_in
        else:
            return invalid_password