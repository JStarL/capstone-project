from backend.staff import Staff


class Manager(Staff):
    def __init__(self, id, email, password):
        super().__init__(self, id, email, password)

    def manager_view_menu(manager_id, menu_id):
        invalid_manager_id = { 'error': 'invalid manager id' } # may combine  this error message with the thing below
        invalid_menu_id = { 'error': 'invalid password' } # error message
        menu = { 'success': 'Show menu' } # supposed to show the menu lol
        
        cur = db_conn.cursor() #ask jib about this problem
        
        
        query1 = """
            
        """ #empty for now as database hasn't been made yet
        
        cur.execute(query1, []) #empty for now
        
        list1 = cur.fetchall()
        
        if len(list1) == 0: #No menu or something went wrong with the id
            #test
            return invalid_manager_id
        else: #shows the list of menu items with catergory
            return menu
        
        

    #def manager_view_food_item(manager_id, menu_id, food_id):

    #def manager_add_category(category_name):

    #def manager_remove_category(category_name):

    #def manager_add_menu_item(menu_item_name):

    #def manager_remove_menu_item(menu_item_name):
