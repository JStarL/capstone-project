

def login_backend(cur, email, password):
    """
    Update logged in status for the respective staff member that attempts to log in to the system.

    Inputs:
        - cur (cursor): The active cursor
        - email (string): Email of the staff member logging in
        - password (string): Password entered by staff member logging in

    Returns:
        - logged_in (dictionary): If logged in successfully, updates the staff type of the member to be
        manager, wait or kitchen based on who they are

        OR

        - invalid_email (dictionary): Error message if email entered is invalid

        OR

        - invalid_password (dictionary): Error message if password entered is invalid

        OR

        - invalid_type (dictionary): Error message is staff_type is invalid

    """
    
    invalid_email = { 'error': 'invalid email' }
    invalid_password = { 'error': 'invalid password' }
    invalid_type = { 'error': 'invalid staff type'}
    logged_in = { 'success': 'logged in' }

    query = """
        select password, id, menu_id, staff_type from staff where email = %s;
    """

    cur.execute(query, [email])
    staff_list = cur.fetchall()
    
    if len(staff_list) == 0:
        return invalid_email

    # Access and compare staff's password
    logged_in_tuple = staff_list[0]
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
    """
    Registers themself (manager) into the system.

    Inputs:
        - cur (cursor): The active cursor
        - email (string): Email of the manager registering
        - password (string): Password entered by manager registering
        - name (string): Name of the manager registering
        - resturant_name (string): Name of restaurant they are registering  
        - location (string): Address of restaurant

    Returns:
        - invalid_register (dictionary): Error message if staff member couldn't register successfully.

        OR

        - already_registered (dictionary): Error message if email already exists in system.
        
        OR

        - failed_category_insert (dictionary): Error message if best sellling category wasn't inserted successfully.
        
        OR

        - registered (dictionary): Success message if registered successfully.

    """

    invalid_register = { 'error': 'failed to register manager' }
    already_registered = { 'error': 'This email is already registered'}
    failed_category_insert = { 'error': 'failed to insert "Best Selling" category' }
    registered = { 'success': 'registered' }
    
    # Check if email is already registered

    staff_query = """
        select id
        from staff
        where email = %s;
    """

    cur.execute(staff_query, [email])
    staff_list = cur.fetchall()
    
    if len(staff_list) > 0:
        return already_registered

    add_resturant_query = """
        insert into menus (restaurant_name, restaurant_loc)
        values (%s, %s);
    """
    
    menu_query = """
        select id 
        from menus 
        where restaurant_name = %s
        and restaurant_loc = %s;
    """

    add_manager_query = """
        insert into staff (email, name, password, menu_id, staff_type)
        values (%s, %s, %s, %s, 'M');
    """


    add_best_selling_query = """
        insert into categories(name, menu_id)
        values ('Best Selling', %s);
    """

    check_best_selling_query = """
        select id
        from categories
        where name = 'Best Selling'
        and menu_id = %s;
    """

    # adding restaurant details into the database table 'menus'
    cur.execute(add_resturant_query, [resturant_name, location])
    # gettting the id of the menu
    cur.execute(menu_query, [resturant_name, location]) 
    list1 = cur.fetchall()
    
    if len(list1) == 0:
        return invalid_register
    
    menu_id = list1[0][0]

    # adding manager details into the database table 'staff'
    cur.execute(add_manager_query, [email, name, password, menu_id])
    # getting the manager id
    cur.execute(staff_query, [email])
    list1 = cur.fetchall()
    
    # if the manager failed to register into 'staff'
    if len(list1) == 0:
        return invalid_register
    
    staff_id = list1[0][0]
    
    # adding the values to be returned
    registered['manager_id'] = staff_id
    registered['menu_id'] = menu_id

    # inserting the default 'Best Selling' category
    cur.execute(add_best_selling_query, [menu_id])

    # Check that this insert worked

    # get the category_id
    cur.execute(check_best_selling_query, [menu_id])
    list1 = cur.fetchall()

    if len(list1) == 0:
        return failed_category_insert
    else:
        registered['category_id'] = list1[0][0]
        return registered

def auth_add_staff_backend(cur, email, password, staff_type, name, menu_id):
    """
    Registers another staff member (kitchen or wait staff) into the system.

    Inputs:
        - cur (cursor): The active cursor
        - email (string): Email of the staff member who wants to be registered into the system
        - password (string): entered password of staff member registering into the system
        - staff_type (string): 'kitchen' or 'staff', depending on what the manager entered while registering into the system
        - name (string): Name of the staff member registering into the system
        - menu_id (int): Menu id of menu associated with the staff member registering into the system

    Returns:
        - invalid_staff_type (dictionary): Error message if staff type isn't 'kitchen' or 'wait'

        OR

        - staff_already_exists (dictionary): Error message if email already exists in system.
        
        OR

        - insert_fail (dictionary): Error message if staff member wasn't registered into the system
        
        OR

        - success (dictionary): Success message if registered successfully.

    """

    invalid_staff_type = { 'error': 'invalid staff type' }
    staff_already_exists = { 'error': 'this email has already been registered' }
    insert_fail = { 'error': 'failed to insert new staff member'}
    success = { 'success': 'successfully registered staff' }

    # Set the staff_char variable

    staff_char = None
    if staff_type == 'kitchen':
        staff_char = 'K'
    elif staff_type == 'wait':
        staff_char = 'W'
    else:
        return invalid_staff_type

    # Check whether staff member already exists registered in the system

    staff_query = """
        select id from staff where email = %s;
    """

    cur.execute(staff_query, [email])
    staff_list = cur.fetchall()

    if len(staff_list) > 0:
        return staff_already_exists

    add_staff_query = """
        insert into staff (email, name, password, menu_id, staff_type)
        values (%s, %s, %s, %s, %s);
    """

    cur.execute(add_staff_query, [email, name, password, menu_id, staff_char])

    # Check that insert worked

    cur.execute(staff_query, [email])
    staff_list = cur.fetchall()

    if len(staff_list) > 0:
        success['staff_id'] = str(staff_list[0][0])
        return success
    else:
        return insert_fail
