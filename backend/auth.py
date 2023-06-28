

def login_backend(cur, email, password):

    # NOTE: The token used is their 'email' for now,
    # since managers and staff are stored in different tables
    
    invalid_email = { 'error': 'invalid email' }
    invalid_password = { 'error': 'invalid password' }
    invalid_type = { 'error': 'invalid staff type'}
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
                return invalid_type
            return logged_in
        else:
            return invalid_password
        
def register_backend(cur, email, password, name, resturant_name, location):

    # NOTE: The token used is their 'email' for now

    invalid_register = { 'error': 'invalid' }
    already_registered = { 'error': 'This email is already registered'}
    registered = { 'success': 'registered' }
    
    # Check if email is already registered

    query0 = """
    SELECT id
    FROM staff
    WHERE email = %s;
    """

    cur.execute(query0, [email])
    list1 = cur.fetchall()
    
    if len(list1) > 0:
        return already_registered

    query2 = """
    INSERT INTO menus (restaurant_name, restaurant_loc)
    VALUES (%s, %s);
    """
    
    query3 = """
    SELECT id 
    FROM menus 
    where restaurant_name = %s
    AND restaurant_loc = %s;
    """

    query = """
    INSERT INTO staff (email, name, password, menu_id, staff_type)
    VALUES (%s, %s, %s, %s, 'M');
    """
    
    query4 = """
    SELECT id 
    FROM staff
    where email = %s
    ;
    """

    cur.execute(query2, [resturant_name, location]) #adding in the database of the menus
    cur.execute(query3, [resturant_name, location]) #grabbing the id of the menu
    list1 = cur.fetchall()
    
    if len(list1) == 0:
        return invalid_register
    
    menu_id = list1[0][0]

    cur.execute(query, [email, name, password, menu_id]) #adding in the database of the staff
    cur.execute(query4, [email]) #grabbing the manager id
    list1 = cur.fetchall()
    
    if len(list1) == 0: #if it breaks and didn't get anything
        return invalid_register
    
    staff_id = list1[0][0]
    
    # adding the values to be returned
    registered['staff_id'] = staff_id
    registered['menu_id'] = menu_id
    return registered
