

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
        
def register_backend(cur, email, password, name, resturant_name, location):

    # NOTE: The token used is their 'email' for now,
    # since managers and staff are stored in different tables
    
    invalid_register = { 'error': 'invalid' }
    registered = { 'success': 'Registered' }
    
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
    SELECT s.id, m.id 
    FROM staff s
    INNER JOIN menus m
    ON s.menu_id = m.id
    where s.email = %s
    AND s.password = %s;
    """

    cur.execute(query2, [resturant_name, location]) #adding in the database of the menus
    cur.execute(query3, [resturant_name, location]) #grabbing the id of the menu
    list1 = cur.fetchall()
    
    cur.execute(query, [email, name, password, list1[0][0]]) #adding in the database of the staff
    cur.execute(query4, [email, name, password, list1[0][0]]) #grabbing the manager id and menu id
    list1 = cur.fetchall()
    
    if len(list1) == 0: #if it breaks and didn't get anything
        return invalid_register
    else:
        # adding the values to be returned
        registered_tuple = list1[0]
        registered['manager_id'] = registered_tuple[0]
        registered['menu_id'] = registered_tuple[1]
        return registered