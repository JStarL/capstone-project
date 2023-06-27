from backend.staff import Staff


class Manager(Staff):
    def __init__(self, id, email, password):
        super().__init__(self, id, email, password)

    def manager_view_menu(cur, manager_id, menu_id):
        invalid_manager_id = { 'error': 'invalid manager id' } # may combine  this error message with the thing below
        invalid_menu_id = { 'error': 'invalid password' } # error message
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
        error = { 'error': 'invalid category' } # error message
        category = { 'success': 'success in adding category' } # supposed to success lol
        
        query1 = """
            INSERT INTO menus (name, menu_id)
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
        if len(list1) == 0: #something went wrong with deleting it
            return error
        else: #shows success message
            return category
        
    def manager_update_catergory(cur, category_name, category_id):
        error = { 'error': 'invalid category' } #error message
        category = { 'success': 'success in removing category' } # supposed to show success lol
        
        query1 = """
            UPDATE categories
            SET name = %s
            WHERE id = %s
        """ 
        query2 = """
            SELECT id 
            FROM categories
            WHERE id = %s;
        """ 
        
        cur.execute(query1, [category_name, category_id])
        cur.execute(query2, [category_id])
        
        list1 = cur.fetchall()
        if len(list1) == 0: #something went wrong with updating it
            return error
        else: #shows success message
            category['category_id'] = list1[0][0]
            return category
        

    def manager_add_menu_item(cur, menu_item_name):
        error = { 'error': 'invalid password' } # error message
        menu = { 'success': 'success in removing category' } # supposed to show success lol
        
        query1 = """
            
        """ #empty for now as database hasn't been made yet
        
        cur.execute(query1, []) #empty for now
        
        list1 = cur.fetchall()
        
        if len(list1) == 0: #No menu or something went wrong with the id
            #test
            return error
        else: #shows success message
            return menu

    def manager_remove_menu_item(cur, menu_item_name):
        error = { 'error': 'invalid password' } # error message
        menu = { 'success': 'success in removing category' } # supposed to show success lol
        
        query1 = """
            
        """ #empty for now as database hasn't been made yet
        
        cur.execute(query1, []) #empty for now
        
        list1 = cur.fetchall()
        
        if len(list1) == 0: #No menu or something went wrong with the id
            #test
            return error
        else: #shows success message
            return menu
