
class Customer():
    def __init__(self, session_id, email, password):
        self.session_id = session_id
        self.email = email
        self.password = password

    def customer_view_menu(cur, session_id, menu_id):
        invalid_session_id = { 'error': 'invalid session id' } # may combine  this error message with the thing below
        invalid_menu_id = { 'error': 'invalid password' } # error message
        menu = { 'success': 'Show menu' } # supposed to show the menu lol

        query1 = """
            
        """ #empty for now as database hasn't been made yet
        
        cur.execute(query1, []) #empty for now
        
        list1 = cur.fetchall()
        
        return invalid_session_id if len(list1) == 0 else menu