
class Customer():
    def __init__(self, email, password):
        self.email = email
        self.password = password

    def customer_view_menu(cur, session_id, menu_id):
        invalid_session_id = { 'error': 'invalid session id' } # may combine  this error message with the thing below
        invalid_menu_id = { 'error': 'invalid password' } # error message
        menu = {}

        query_categories = """
        select id, name from categories where menu_id = %s;
        """
        
        query_food_items = """
        select id from food_items where category_id = %s;
        """
        cur.execute(query_categories, [menu_id])
        categories = cur.fetchall()        
        
        for categ in categories:
            categ_id = categ['id']
            cur.execute(query_food_items, [categ_id])
            food_items = cur.fetchall()

            food_item_ids = [food_item['id'] for food_item in food_items]
            menu.update({categ['name'] : food_item_ids})

        return invalid_session_id if len(categories) == 0 else menu