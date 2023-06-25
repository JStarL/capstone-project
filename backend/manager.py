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

    def manager_add_category(cur, category_name):
        error = { 'error': 'invalid password' } # error message
        category = { 'success': 'success in adding category' } # supposed to success lol
        
        query1 = """
            
        """ #empty for now as database hasn't been made yet
        
        cur.execute(query1, []) #empty for now
        
        list1 = cur.fetchall()
        
        if len(list1) == 0: #No menu or something went wrong with the id
            #test
            return error
        else: #shows success message
            return category

    def manager_remove_category(cur, category_name):
        error = { 'error': 'invalid password' } # error message
        category = { 'success': 'success in removing category' } # supposed to show success lol
        
        query1 = """
            
        """ #empty for now as database hasn't been made yet
        
        cur.execute(query1, []) #empty for now
        
        list1 = cur.fetchall()
        
        if len(list1) == 0: #No menu or something went wrong with the id
            #test
            return error
        else: #shows success message
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
