

def manager_view_menu(cur, manager_id, menu_id):
    invalid_manager_id = { 'error': 'invalid manager_id' } # may combine  this error message with the thing below
    invalid_menu_id = { 'error': 'invalid menu_id' } # error message
    menu = { 'success': 'Show menu' } # supposed to show the menu lol
    
    query1 = """
        
    """ #empty for now as database hasn't been made yet
    
    cur.execute(query1, []) #empty for now
    
    list1 = cur.fetchall()
    
    if len(list1) == 0: #No menu or something went wrong with the id
        #test
        return invalid_manager_id
    else: #shows the list of menu items with catergory
        return menu
    
def manager_view_food_item(cur, manager_id, menu_id, food_id):
    error = { 'error': 'invalid password' } # error message
    food = { 'success': 'Show food' } # supposed to show the food lol
    
    query1 = """
        
    """ #empty for now as database hasn't been made yet
    
    cur.execute(query1, []) #empty for now
    
    list1 = cur.fetchall()
    
    if len(list1) == 0: #No menu or something went wrong with the id
        #test
        return error
    else: #shows the food item
        return food

def manager_add_category(cur, category_name, menu_id):
    error = { 'error': 'adding category failed' } # error message
    category = { 'success': 'success in adding category' } # supposed to success lol
    
    query1 = """
        INSERT INTO categories (name, menu_id)
        VALUES (%s, %s);
    """ 
    query2 = """
        SELECT id
        FROM categories
        WHERE menu_id = %s
        AND name = %s;
    """ 
    
    cur.execute(query1, [category_name, menu_id])
    
    cur.execute(query2, [menu_id, category_name])
    
    list1 = cur.fetchall()
    
    if len(list1) == 0: #something went wrong with retriving the data
        return error
    else: #shows success message
        category['category_id'] = list1[0][0]
        return category

def manager_delete_category(cur, category_id):
    error = { 'error': 'invalid category' } # error message
    category = { 'success': 'success in removing category' } # supposed to show success lol
    
    query1 = """
        DELETE FROM categories
        WHERE id = %s;
    """ 
    query2 = """
        SELECT id 
        FROM categories
        WHERE id = %s;
    """ 
    
    cur.execute(query1, [category_id])
    cur.execute(query2, [category_id])
    list1 = cur.fetchall()
    if len(list1) == 0: # id shouldn't exist, shows success message
        return category
    else: #something went wrong with deleting it
        return error
    
def manager_update_category(cur, category_name, category_id):
    invalid_category = { 'error': 'invalid category' } #error message
    update_name_fail = { 'error': 'failed to update name'}
    category = { 'success': 'success in removing category' } # supposed to show success lol
    
    query1 = """
        UPDATE categories
        SET name = %s
        WHERE id = %s
        ;
    """ 
    query2 = """
        SELECT id, name
        FROM categories
        WHERE id = %s;
    """ 
    
    cur.execute(query1, [category_name, category_id])
    cur.execute(query2, [category_id])
    
    list1 = cur.fetchall()
    if len(list1) == 0: # id doesn't exist
        return invalid_category
    else:
        if category_name != list1[0][1]:
            #shows success message
            category['category_id'] = list1[0][0]
            return category
        else:
            # Updating the name failed
            return update_name_fail
    

def manager_add_menu_item(cur, menu_item_name, price, ingredients, description, category_id, menu_id):
    error = { 'error': 'adding menu_item failed' }
    menu_item = {}

    query1 = """
        INSERT INTO menu_items (title, description, price, ingredients, category_id, menu_id)
        VALUES (%s, %s, %s, %s, %s, %s);
    """ 
    query2 = """
        SELECT id
        FROM menu_items
        WHERE title = %s
        AND menu_id = %s;
    """ 
    
    cur.execute(query1, [menu_item_name, description, price, ingredients, category_id, menu_id])
    cur.execute(query2, [menu_item_name, menu_id])
    
    list1 = cur.fetchall()
    
    if len(list1) == 0:
        return error
    else:
        menu_item.update({'menu_item_id' : list1[0][0]})
        return menu_item


def manager_delete_menu_item(cur, menu_item_id):
    error = { 'error': 'invalid menu_item_id' }
    error2 = { 'error': 'did not delete the menu item'}
    success = { 'success': 'success in removing menu item' }
    
    query1 = """
        SELECT id
        FROM menu_items
        WHERE id = %s;
    """ 

    query2 = """
        DELETE FROM menu_items
        WHERE id = %s;
    """ 
    
    cur.execute(query1, [menu_item_id])
    
    list1 = cur.fetchall()

    if len(list1) == 0: # id doesn't exist
        return error
    else:
        cur.execute(query2, [menu_item_id])
        cur.execute(query1, [menu_item_id])
        list1 = cur.fetchall() #check if it is actually removed
        
        if len(list1) == 0:
            return success
        else:
            return error2

def manager_update_menu_item(cur, menu_item_id, menu_item_name, price, ingredients, description, category_id, menu_id, image):
    invalid_menu_item = { 'error': 'invalid menu item' }
    error = { 'error': 'did not update properly'}
    menu_item = {}
    
    query1 = """
        SELECT id
        FROM menu_items
        WHERE id = %s;
    """ 
    
    query2 = """
        UPDATE menu_items
        SET title = %s,
            description = %s,
            price = %s,
            ingredients = %s,
            category_id = %s,
            menu_id = %s,
            image = %s            
        WHERE id = %s
        ;
    """
    query3 = """
        SELECT id, title, description, image, price, ingredients, category_id, menu_id
        FROM menu_items
        WHERE id = %s;
    """ 
    
    cur.execute(query1, [menu_item_id])
    
    list1 = cur.fetchall()

    if len(list1) == 0: # id doesn't exist
        return invalid_menu_item
    else: 
        cur.execute(query2, [menu_item_name, description, price, ingredients, category_id, menu_id, image, menu_item_id]) #this just updates
        cur.execute(query3, [menu_item_id]) #this grabs the id and the rest of the values to check
        list1 = cur.fetchall()
        if menu_item_name == list1[0][1] and description == list1[0][2] and image == list1[0][3] and price == list1[0][4] and ingredients == list1[0][5] and category_id == list1[0][6] and menu_id == list1[0][7]:
            menu_item.update({'menu_item_id' : list1[0][0]})
            return menu_item
        else:
            return error
    