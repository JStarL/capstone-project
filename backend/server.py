import signal
from json import dumps
from flask import Flask, request, abort
from flask_cors import CORS
import psycopg2

import sys
import ast
from datetime import datetime


from manager import manager_view_menu, manager_view_category, manager_view_menu_item, manager_add_category, manager_delete_category, manager_add_menu_item, manager_delete_menu_item, manager_update_category, manager_update_menu_item, manager_update_category_ordering, manager_update_menu_item_ordering
from auth import login_backend, register_backend, auth_add_staff_backend
from customer import customer_view_menu, customer_view_category, customer_view_menu_item, customer_menu_search, customer_give_rating

def quit_gracefully(*args):
    '''For coverage'''
    exit(0)


def defaultHandler(err):
    response = err.get_response()
    # print('response', err, err.get_response())
    response.data = dumps({
        "code": err.code,
        "name": "System Error",
        "message": err.get_description()
    })
    response.content_type = 'application/json'
    return response


APP = Flask(__name__)
CORS(APP)

APP.config['TRAP_HTTP_EXCEPTIONS'] = True
APP.register_error_handler(Exception, defaultHandler)

db_conn = None

# cur_dict = {
#     'managers': {
#         "1": cur1, # manager_email: cursor
#         "5": cur2,
#     }, 
#     'staff': {
#         "2": cur3, # kitchen / wait staff email: cursor
#         "6": cur4,
#     },
#     'customers': {
#         "123456": cur5, # session_id: cursor
#         "234567": cur6
#     }
# }

cur_dict = {
    'staff': {
        
    },
    
    'customers': {
        
    }
}


orders = {}

notifications = {}

### Example of the orders dictionary ###

# orders = {
#   '1': [ # menu_id is the key
#       {  
#       'session_id': '1234'
#       'table_id': 24,
#       'status': 'kitchen',
#       'menu_items': [
#           {
#               'menu_item_id': 12,
#               'amount': 1
#               'title': 'Burger'
#               'price': 1
#               'image': string
#               'description': tis food
#               
#           },
#           {
#               'menu_item_id': 15,
#               'amount': 2
#               'title': 'Fries'
#               'price': 1
#               'image': string
#               'description': tis food
#           }
#       ]
#       },
#       { 
#       'session_id': '2345'
#       'table_id': 22,
#       'status': 'customer',
#       'menu_items': [
#           {
#               'menu_item_id': 12,
#               'amount': 1
#               'title': 'Burger'
#               'price': 1
#               'image': string
#               'description': tis food
#           },
#           {
#               'menu_item_id': 11,
#               'amount': 2
#               'title': 'Coke'
#               'price': 1
#               'image': string
#               'description': tis food
#           }
#       ]
#       }
#   ],
#   '2': [ # menu_id is the key
#        {
#       'session_id': '2399'
#       'table_id': 27,
#       'status': 'wait',
#       'menu_items': [
#           {
#               'menu_item_id': 10,
#               'amount': 3
#               'title': 'Pasta'
#               'price': 1
#               'image': string
#               'description': tis food
#           },
#           {
#               'menu_item_id': 3,
#               'amount': 1
#               'title': 'Fanta'
#               'price': 1
#               'image': string
#               'description': tis food
#           }
#       ]
#       },
#       {
#       'session_id': '3479'
#       'table_id': 13,
#       'status': 'kitchen',
#       'menu_items': [
#           {
#               'menu_item_id': 13,
#               'amount': 2
#               'title': 'Fried Rice'
#               'price': 1
#               'image': string
#               'description': tis food
#           },
#           {
#               'menu_item_id': 2,
#               'amount': 1
#               'title': 'Water'
#               'price': 1
#               'image': string
#               'description': tis food
#           }
#       ]
#       }
#   ]
# }

### Example of notifications ###

# notifications = {
#  "1": [   # menu_id as a str(int)
#       {
#           session_id: "116662278",
#           table_id: '2',
#           'status': 'customer',
#           message: 'I need some water' (optional?)
# 
#       },
#       {
#           session_id: "116639191",
#           table_id: '14',
#           'status': 'wait',
#           message: 'When will my food be served?' (optional?)
#       }
# 
#   ],
# 
# 
#  "4": [   # menu_id
# 
#       {
#           session_id: "1133949494",
#           table_id: '3',
#           'status': 'wait',
#           message: 'Do you have Coke or Pepsi?' (optional?)
# 
#       },
#       {
#           session_id: "1233222001",
#           table_id: '23',
#           'status': 'customer',
#           message: 'Where can I pay the bill?' (optional?)
#       }
#   ] 
# }
#
#

@APP.errorhandler(400)
def error_page(error):
    """
    The default error handler for any error code.
    Abort wiith status code 400 is called, which
    redirects to this function,
    which in turn sends to the frontend a JSON object
    with the error message and a 400 status code
    """
    
    return {'error': error.description}, 400
    
# Auth functions

@APP.route('/auth/register', methods=['POST'])
def register_flask():
    """
    Gets the input from the frontend and then sends that data to be processed
    and registers the manager to the database. It also adds the menu and the best selling category to the resturant
    
    Inputs:
        - email (string): The email
        - password (string): The password
        - name (string): The name
        - restaurant_name (string): The restaurant name
        - location (string): The location of the restaurant

    Returns:
        - return_val: (dictionary): This will have 'success' or 'error' as a key and have category_id, manager_id and menu_id as keys
    """
    data = ast.literal_eval(request.get_json())
    
    cur = db_conn.cursor()
    
    return_dict = register_backend(cur, data['email'], data['password'], data['name'], data['restaurant_name'], data['location'])
    return_val = dumps(return_dict)
    
    if 'error' in return_dict:
        abort(400, return_dict['error'])
    
    if 'success' in return_dict:
        # Save the cursor in the cursors dictionary for staff members
        cur_dict['staff'][str(return_dict['manager_id'])] = cur

        db_conn.commit()
    
    return return_val

@APP.route('/auth/login', methods=['POST'])
def login_flask():
    """
    Get the login details from frontend to be sent to the backend to be processed and check for successful login
    
    Inputs:
        - email (string): The email
        - password (string): The password

    Returns:
        - return_val: (dictionary): This will have 'success' or 'error' as a key
    """
    data = ast.literal_eval(request.get_json())
    
    cur = db_conn.cursor()
    
    return_dict = login_backend(cur, data['email'], data['password'])
    return_val = dumps(return_dict)
    
    if 'error' in return_dict:
        abort(400, return_dict['error'])
    
    if 'success' in return_dict:
        # Save the cursor in the cursors dictionary for staff members
        cur_dict['staff'][str(return_dict['staff_id'])] = cur
    return return_val

@APP.route('/auth/logout', methods=['POST'])
def auth_logout_flask():
    """
    Get the staff_id to log out of the system and remove the cursor from the cursors dictionary
    
    Inputs:
        - staff (string): The staff id

    Returns:
        - return_val: (dictionary): This will have 'success' or 'error' as a key
    """
    data = ast.literal_eval(request.get_json())
    logged_out = { 'success': 'logged out' }
    error = 'invalid staff_id'
    
    if data['staff_id'] in cur_dict['staff']:
        # Remove the cursor from the cursors dictionary for staff once staff has logged out
        cur = cur_dict['staff'].pop(str(data['staff_id']))
        cur.close()

        return dumps(logged_out)
    else:
        abort(400, error)

@APP.route('/manager/add_staff', methods=['POST'])
def auth_add_staff_flask():
    """
    This adds wait or kitchen staff details that are obtained from frontend to be registered in the database
    
    Inputs:
        - staff (string): The staff id
        - email (string): The email
        - password (string): The password
        - name (string): The name
        - staff_type (string): Whether it will be a 'K' or 'W' for kitchen staff or wait staff respectively
        - menu_id (string): The menu Id that the staff will be assigned to

    Returns:
        - return_val: (dictionary): This will have 'success' or 'error' as a key
    """
    data = ast.literal_eval(request.get_json())

    invalid_manager = 'invalid manager_id'

    if data['manager_id'] not in cur_dict['staff']:
        abort(400, invalid_manager)
    
    # Retrieve cursor from staff cursors dictionary 
    cur = cur_dict['staff'][data['manager_id']]
    
    return_val = auth_add_staff_backend(cur, data['email'], data['password'], data['staff_type'], data['name'], data['menu_id'])
    if 'error' in return_val:
        abort(400, return_val['error'])
    
    db_conn.commit()
    
    return dumps(return_val)


# Manager functions

@APP.route("/manager/view_menu", methods=['GET'])
def manager_view_menu_flask():
    """
    This shows the manager the menu, including the categories list and the menu items of the Best Selling category
    
    Inputs:
        - manager_id (string): The manager id
        - menu_id (string): The menu id
        - excluded_cat_ids (Optional list): The list of category ids that will get excluded 
        - top_k (Optional int): This is the amount of items to be shown from the category

    Returns:
        - return_val: (List): This is a list of dictionaries that each contain category id as the key
            and the first category will have all of the menu item info sjpwn
    """
    manager_id = request.args.get("manager_id")
    menu_id = request.args.get("menu_id")

    # Default excluded cat list so sql query doesn't throw an error
    excluded_ids = [-1]
    if 'excluded_cat_ids' in request.args:
        excluded_ids = ast.literal_eval(request.args.get("excluded_cat_ids"))
    
    # Default value of top_k if not provided
    top_k = 100
    if 'top_k' in request.args:
        top_k = request.args.get('top_k')
    
    # Retrieve cursor from staff cursors dictionary 
    cur = cur_dict['staff'][manager_id]
    
    return_val = manager_view_menu(cur,  menu_id, excluded_ids, top_k)
    if 'error' in return_val:
        abort(400, return_val['error'])
    return dumps(return_val)

@APP.route("/manager/view_category", methods=['GET'])
def manager_view_category_flask():
    """
    This returns the data of the menu items for the required category
    
    Inputs:
        - manager_id (string): The manager id
        - category_id (string): The category id
        - top_k (Optional int): This is the amount of items to be shown from the category

    Returns:
        - return_val: (List): This is a list of dictionary that each contains menu items and all of its info
    """
    manager_id = request.args.get("manager_id")
    category_id = request.args.get("category_id")
    
    # Default excluded cat list so sql query doesn't throw an error
    excluded_ids = [-1]
    if 'excluded_cat_ids' in request.args:
        excluded_ids = ast.literal_eval(request.args.get("excluded_cat_ids"))
    
    # Default value of top_k if not provided
    top_k = 100
    if 'top_k' in request.args:
        top_k = request.args.get('top_k')
    
    # Retrieve cursor from staff cursors dictionary 
    cur = cur_dict['staff'][manager_id]

    return_val = manager_view_category(cur, category_id, excluded_ids, top_k)
    if 'error' in return_val:
        abort(400, return_val['error'])
    
    return dumps(return_val)

@APP.route("/manager/view_menu_item", methods=['GET'])
def manager_view_menu_item_flask():
    """
    This shows more info about the individual menu item
    
    Inputs:
        - manager_id (string): The manager id
        - menu_item_id (string): The menu item id

    Returns:
        - return_val: (dictionary): This is a dictionary that contains either success or error.
            This will also contain all the menu item's specific information
    """
    manager_id = request.args.get("manager_id")
    food_id = request.args.get("menu_item_id")
    
    # Retrieve cursor from staff cursors dictionary 
    cur = cur_dict['staff'][manager_id]
    
    return_val = manager_view_menu_item(cur, food_id)
    if 'error' in return_val:
        abort(400, return_val['error'])
    
    return dumps(return_val)

@APP.route("/manager/add_category", methods=['POST'])
def manager_add_category_flask():
    """
    This adds a new category to the database
    
    Inputs:
        - manager_id (string): The manager id
        - menu_id (string): The menu id
        - category_name (string): The name of the category

    Returns:
        - return_val: (dictionary): This is a dictionary that contains either success or error.
            This will also have the newly formed category's id
    """
    data = ast.literal_eval(request.get_json())
    
    # Retrieve cursor from staff cursors dictionary 
    cur = cur_dict['staff'][data['manager_id']]

    return_val = manager_add_category(cur, data['category_name'], data['menu_id'])
    if 'error' in return_val:
        abort(400, return_val['error'])
    
    db_conn.commit()
    
    return dumps(return_val)

@APP.route("/manager/delete_category", methods=['DELETE'])
def manager_delete_category_flask():
    """
    This deletes the category in the database
    
    Inputs:
        - manager_id (string): The manager id
        - menu_id (string): The menu id
        - category_id (string): The id of the category to be deleted

    Returns:
        - return_val: (dictionary): This is a dictionary that contains either success or error
    """
    data = ast.literal_eval(request.get_json())
    
    # Retrieve cursor from staff cursors dictionary 
    cur = cur_dict['staff'][data['manager_id']]
    
    return_val = manager_delete_category(cur, data['category_id'])
    if 'error' in return_val:
        abort(400, return_val['error'])
    
    db_conn.commit()
    
    return dumps(return_val)

@APP.route("/manager/update_category", methods=['POST'])
def manager_update_category_flask():
    """
    This updates the category in the database
    
    Inputs:
        - manager_id (string): The manager id
        - category_name (string): The new name of the category
        - category_id (string): The category's id

    Returns:
        - return_val: (dictionary): This is a dictionary that contains either success or error.
            Also sends back the category id
    """

    data = ast.literal_eval(request.get_json())

    # Retrieve cursor from staff cursors dictionary 
    cur = cur_dict['staff'][data['manager_id']]

    return_val = manager_update_category(cur, data['category_name'], data['category_id'])
    if 'error' in return_val:
        abort(400, return_val['error'])
    
    db_conn.commit()
    
    return dumps(return_val)

@APP.route("/manager/add_menu_item", methods=['POST'])
def manager_add_menu_item_flask():
    """
    This adds a new menu item to the database
    
    Inputs:
        - manager_id (string): The manager id
        - menu_id (string): The menu id
        - category_id (string): The id of the category
        - title (string): The name of the menu item
        - price (float): The price of the menu item
        - ingredients (dictionary): The ingredients of the menu item, as a list of list of allergy names and ids
        - description (string): The description of the menu item
        - image (string): the base64 encoded string version of the image of the menu item

    Returns:
        - return_val: (dictionary): This is a dictionary that contains either success or error.
        This will also have the new menu item id
    """
    data = ast.literal_eval(request.get_json())
    
    # Retrieve cursor from staff cursors dictionary 
    cur = cur_dict['staff'][data['manager_id']]
    
    # If the optional image or description fields have not been supplied, set it to empty string
    if 'image' not in data:
        data['image'] = ''
    if 'description' not in data:
        data['description'] = ''
    
    return_val = manager_add_menu_item(cur, data['title'], data['price'], data['ingredients'], data['description'], data['category_id'], data['menu_id'], data['image'])
    
    if 'error' in return_val:
        abort(400, return_val['error'])
    
    db_conn.commit()
    
    return dumps(return_val)

@APP.route("/manager/delete_menu_item", methods=['DELETE'])
def manager_delete_menu_item_flask():
    """
    This deletes a menu item from the database
    
    Inputs:
        - manager_id (string): The manager id
        - menu_item_id (string): id of the menu item to be deleted 
    Returns:
        - return_val: (dictionary): This is a dictionary that contains either success or error
    """
    
    data = ast.literal_eval(request.get_json())
    
    # Retrieve cursor from staff cursors dictionary 
    cur = cur_dict['staff'][data['manager_id']]
    
    return_val = manager_delete_menu_item(cur, data['menu_item_id'])
    
    if 'error' in return_val:
        abort(400, return_val['error'])
    
    db_conn.commit()
    
    return dumps(return_val)

@APP.route("/manager/update_menu_item", methods=['POST'])
def manager_update_menu_item_flask():
    """
    This update a menu item in the database
    
    Inputs:
        - manager_id (string): The manager id
        - menu_item_id (string): The menu item id
        - title (string): The name of the menu item
        - price (float): The price of the menu item
        - ingredients (dictionary): The ingredients of the menu item, as a list of list of allergy names and ids
        - description (string): The description of the menu item
        - image (string): the base64 encoded string version of the image of the menu item
        - menu_id (string): The menu id
        - category_id (string): The category id
        
    Returns:
        - return_val: (dictionary): This is a dictionary that contains either success or error. Also shows the menu item id
    """

    data = ast.literal_eval(request.get_json())
    
    # Retrieve cursor from staff cursors dictionary 
    cur = cur_dict['staff'][data['manager_id']]
    
    return_val = manager_update_menu_item(cur, data['menu_item_id'], data['title'], data['price'], data['ingredients'], data['description'], data['category_id'], data['menu_id'], data['image'])
    
    if 'error' in return_val:
        abort(400, return_val['error'])
    
    db_conn.commit()
    
    return dumps(return_val)

@APP.route("/manager/update_category_ordering", methods=['POST'])
def manager_update_category_ordering_flask():
    """
    This updates the ordering of the given category 
    
    Inputs:
        - manager_id (string): The manager id
        - category_id (string): The id of the category
        - prev_ordering_id (string): The previous ordering id of the category's postion (the initial positioning)
        - new_ordering_id (string): The new ordering id of where the category will be postioned (the target)
        
    Returns:
        - return_val: (dictionary): This is a dictionary that contains either success or error
    """
    
    data = ast.literal_eval(request.get_json())
    
    # Retrieve cursor from staff cursors dictionary 
    cur = cur_dict['staff'][data['manager_id']]
    
    return_val = manager_update_category_ordering(cur, data['category_id'], data['prev_ordering_id'], data['new_ordering_id'])
    
    if 'error' in return_val:
        abort(400, return_val['error'])
    
    db_conn.commit()
    
    return dumps(return_val)

@APP.route("/manager/update_menu_item_ordering", methods=['POST'])
def manager_update_menu_item_ordering_flask():
    """
    This updates the ordering of the given menu item 
    
    Inputs:
        - manager_id (string): The manager id
        - menu_item_id (string): The menu item id
        - prev_ordering_id (string): The previous ordering id of the menu item's postion (the initial positioning)
        - new_ordering_id (string): The new ordering id of where the menu item will be postioned (the target)
        
    Returns:
        - return_val: (dictionary): This is a dictionary that contains either success or error
    """
    
    data = ast.literal_eval(request.get_json())
    
    # Retrieve cursor from staff cursors dictionary 
    cur = cur_dict['staff'][data['manager_id']]
    
    return_val = manager_update_menu_item_ordering(cur, data['menu_item_id'], data['prev_ordering_id'], data['new_ordering_id'])
    
    if 'error' in return_val:
        abort(400, return_val['error'])
    
    db_conn.commit()
    
    return dumps(return_val)

# Customer functions

@APP.route("/customer/view_menu", methods=['GET'])
def customer_view_menu_flask():
    """
    This gets the categories and menu items for the "Best Selling" category, given the menu id
    
    Inputs:
        - session_id (string): The session id
        - menu_id (string): The menu id
        - allergies (List): The list of ints, for the ids of allergies
        - excluded_cat_ids (list): This is a list of category ids to be excluded from the return list
        - top_k (Optional int): This shows the amount of items that the user wants to see
        
    Returns:
        - return_val: (dictionary): This is a dictionary that contains either success or error. This also shows all categories ids with their names and all the menu item info for the first category
    """
    menu_id = request.args.get("menu_id")
    session_id = request.args.get("session_id")
    allergy_ids = ast.literal_eval(request.args.get("allergies"))
    excluded_cat_ids = ast.literal_eval(request.args.get("excluded_cat_ids"))

    # If there are no categories to exclude, set a default value of [-1]
    # so that the sql query doesn't break
    if len(excluded_cat_ids) == 0:
        excluded_cat_ids = [-1]
        
    top_k = 100
    if 'top_k' in request.args:
        top_k = request.args.get('top_k')

    # Create or retrieve the cursor
    cur = None
    if session_id in cur_dict['customers']:
        cur = cur_dict['customers'][session_id]
    else:
        cur = db_conn.cursor()
        # Save the cursor in the customer's cursor dictionary
        cur_dict['customers'][session_id] = cur
    
    return_val = customer_view_menu(cur, menu_id, allergy_ids, excluded_cat_ids, top_k)
    
    if 'error' in return_val:
        abort(400, return_val['error'])
        
    return dumps(return_val)

@APP.route("/customer/view_category", methods=['GET'])
def customer_view_category_flask():
    """
    This gets the menu items for the given category is, and an automated collection of menu items
    for the "Best Selling" category
    
    Inputs:
        - session_id (string): The session id
        - category_id (string): The category id
        - allergies (List): The list of ints, for the ids of allergies
        - excluded_cat_ids (list): This is a list of category ids to be excluded
        - top_k (Optional int): This shows the amount of items that the user wants to see
        
    Returns:
        - return_val: (dictionary): This is a dictionary that contains either success or error. This also shows all the menu item for the category
    """
    session_id = request.args.get("session_id")
    category_id = request.args.get("category_id")
    allergy_ids = ast.literal_eval(request.args.get("allergies"))
    excluded_cat_ids = ast.literal_eval(request.args.get("excluded_cat_ids"))

    # If there are no categories to exclude, set a default value of [-1]
    # so that the sql query doesn't break
    if len(excluded_cat_ids) == 0:
        excluded_cat_ids = [-1]

    top_k = 100
    if 'top_k' in request.args:
        top_k = request.args.get('top_k')

    # Create or retrieve the cursor
    cur = None
    if session_id in cur_dict['customers']:
        cur = cur_dict['customers'][session_id]
    else:
        cur = db_conn.cursor()
        # Save the cursor in the customer's cursor dictionary
        cur_dict['customers'][session_id] = cur

    return_val = customer_view_category(cur, category_id, allergy_ids, excluded_cat_ids, top_k)
    
    if 'error' in return_val:
        abort(400, return_val['error'])
    
    return dumps(return_val)

@APP.route("/customer/view_menu_item", methods=['GET'])
def customer_view_menu_item_flask():
    """
    This returns all information about the menu item with given id
    
    Inputs:
        - session_id (string): The session id
        - menu_item_id (string): The menu item id
        
    Returns:
        - return_val: (dictionary): This is a dictionary that contains either success or error. This also shows all the info of the specfic menu item
    """
    
    session_id = request.args.get("session_id")
    menu_item_id = request.args.get("menu_item_id")
    
    # Create or retrieve the cursor
    cur = None
    if session_id in cur_dict['customers']:
        cur = cur_dict['customers'][session_id]
    else:
        cur = db_conn.cursor()
        # Save the cursor in the customer's cursor dictionary
        cur_dict['customers'][session_id] = cur
    
    return_val = customer_view_menu_item(cur, menu_item_id)
    
    if 'error' in return_val:
        abort(400, return_val['error'])
    
    return dumps(return_val)

@APP.route("/customer/menu/table", methods=['POST'])
def customer_menu_table_flask():
    """
    This adds the table number of the user and adds an order item to the orders dictionary
    
    Inputs:
        - session_id (string): The session id
        - menu_id (string): The menu id
        - table_id (string): The table number
        
    Returns:
        - return_val: (dictionary): This is a dictionary that contains either success or error. This also shows the table id
    """
    data = ast.literal_eval(request.get_json())
    table_id = data['table_id']
    menu_id = data['menu_id']
    session_id = data['session_id']

    invalid_table_id = 'invalid table_id'
    success = {'table_id':  table_id}

    if table_id != None:
        
        # If this is the first time adding an order to a restaurant
        # Create a new empty list in the orders and notifications dictionary
        # Corresponding to the menu_id

        if menu_id not in orders:
            orders[menu_id] = []
        if menu_id not in notifications:
            notifications[menu_id] = []
        
        # The initial status of the order is 'customer', meaning that the customer is still editing the order
        orders[menu_id].append(
            {
            'session_id': session_id,
            'table_id' : table_id,
            'status': 'customer',
            'menu_items' : []
            }
        )
        
        return success
    else:
        abort(400, invalid_table_id)

@APP.route("/customer/add_menu_item", methods=['POST'])
def customer_add_menu_item_flask():
    """
    This adds the menu item to the order of the user
    
    Inputs:
        - session_id (string): The session id
        - menu_id (string): The menu id
        - menu_item_id (string): The menu item id
        - amount (int): The amount they want to have of the menu item
        - persona_name (string): The name of the persona who is adding the menu item

    Returns:
        - order: (dictionary): This is a dictionary that contains all details of the current order
    """
    data = ast.literal_eval(request.get_json())
    session_id = data['session_id']
    menu_id = data['menu_id']
    menu_item_id = data['menu_item_id']
    amount = int(data['amount'])
    persona = data['persona_name']
    
    # List of possible error messages to be used with abort()

    invalid_menu_id = 'no orders with the given menu_id'
    invalid_menu_item_id = 'menu_item_id invalid'
    invalid_session_id = 'invalid session_id'
    amount_negative_error = 'amount cannot be negative'

    # Create or retrieve the cursor
    cur = None
    if session_id in cur_dict['customers']:
        cur = cur_dict['customers'][session_id]
    else:
        cur = db_conn.cursor()
        # Save the cursor in the customer's cursor dictionary
        cur_dict['customers'][session_id] = cur

    # Abort if negative amount

    if amount < 0:
        abort(400, amount_negative_error)
    
    menu_item_query = """
        select title, description, image, price, category_id
        from menu_items
        where id = %s;
    """
    
    cur.execute(menu_item_query, [menu_item_id])
    
    menu_item_list = cur.fetchall()
    if (len(menu_item_list) == 0):
        abort(400, invalid_menu_item_id)
    menu_item = menu_item_list[0]

    # Fetch the orders list for the restaurant

    orders_list = None
    if menu_id in orders:
        orders_list = orders[menu_id]
    else:
        abort(400, invalid_menu_id)

    # find the order with session_id
    order_list = [order for order in orders_list if order["session_id"] == session_id]
    
    if len(order_list) > 0:
        menu_item_list = [menu_item for menu_item in order_list[0]['menu_items'] if menu_item['menu_item_id'] == menu_item_id and menu_item['persona'] == persona]
        
        if len(menu_item_list) > 0:
            menu_item_list[0]['amount'] += amount
        else:
            order_list[0]['menu_items'].append( {
                "menu_item_id" : menu_item_id,
                "amount" : amount,
                "title" : menu_item[0],
                "description": menu_item[1],
                "image": menu_item[2],
                "price": menu_item[3],
                "persona": persona,
                "category_id": menu_item[4]
            } )
        return order_list[0]
    else:
        abort(400, invalid_session_id)

@APP.route("/customer/remove_menu_item", methods=['DELETE'])
def customer_remove_menu_item_flask():
    """
    This removes the given amount of the menu item from the order of the user
    
    Inputs:
        - session_id (string): The session id
        - menu_id (string): The menu id
        - menu_item_id (string): The menu item id
        - amount (int): The amount they want to remove from the total menu item amount
        - persona (string): The persona name of the one who wants to remove the menu item
        
    Returns:
        - order: (dictionary): This is a dictionary that contains either success or error.
            This also shows all details of the current order of the user
    """
    data = ast.literal_eval(request.get_json())
    session_id = data['session_id']
    menu_id = data['menu_id']
    menu_item_id = data['menu_item_id']
    amount_to_be_removed = data['amount']
    persona = data['persona']

    # List of possible error messages to be used with abort()

    invalid_menu_id = 'no orders with the given menu_id'
    invalid_session_id = 'invalid session_id'
    removing_extra = 'cant remove more menu_items than what is currently there'
    invalid_menu_item_id_or_persona = 'menu_item_id with given persona doesnt exist in this order'

    # Fetch the orders list for the restaurant

    orders_list = None
    if menu_id in orders:
        orders_list = orders[menu_id]
    else:
        abort(400, invalid_menu_id)

    # find the order with session_id 
    order_list = [order for order in orders_list if order["session_id"] == session_id]
    
    if len(order_list) > 0:

        # find the menu item to be edited

        menu_item_list = [menu_item for menu_item in order_list[0]['menu_items'] if menu_item['menu_item_id'] == menu_item_id and menu_item['persona'] == persona]
        if len(menu_item_list) > 0:

            remaining_amount = menu_item_list[0]['amount'] - amount_to_be_removed

            if remaining_amount > 0 :
                menu_item_list[0]['amount'] = remaining_amount
            elif remaining_amount == 0:
                order_list[0]['menu_items'].remove(menu_item_list[0])
            else:
                abort(400, removing_extra)
            
            return order_list[0] 
        else:
            abort(400, invalid_menu_item_id_or_persona)
    else:
        abort(400, invalid_session_id)

@APP.route("/customer/view_order", methods=['GET'])
def customer_view_order_flask():
    """
    This shows all details of the order that the user has placed so far
    
    Inputs:
        - session_id (string): The session id
        - menu_id (string): The menu id
        
    Returns:
        - order: (dictionary): This is a dictionary that contains either success or error.
        `This also shows all details of the current order of the user
    """

    session_id = request.args.get("session_id")
    menu_id = request.args.get('menu_id')

    # List of possible error messages to be used with abort()

    invalid_menu_id = 'no orders with the given menu_id'
    invalid_session_id ='invalid session_id'

    # Fetch the orders list for the restaurant

    orders_list = None
    if menu_id in orders:
        orders_list = orders[menu_id]
    else:
        abort(400, invalid_menu_id)

    # find the order with session_id
    order_list = [order for order in orders_list if order["session_id"] == session_id]
    
    if len(order_list) > 0:
        return order_list[0]
    else:
        abort(400, invalid_session_id)
    
@APP.route("/customer/menu/search", methods=['GET'])
def customer_menu_search_flask():
    """
    This shows the resturants that the user has searched for
    
    Inputs:
        - query (string): The text that will be used to search
        - session_id (string): The session id
        
    Returns:
        - return_val: (dictionary): This is a dictionary that contains either success or error. This also shows the the resturants that match the query
    """

    session_id = request.args.get("session_id")
    query = request.args.get("query")
    
    # Create or retrieve the cursor
    cur = None
    if session_id in cur_dict['customers']:
        cur = cur_dict['customers'][session_id]
    else:
        cur = db_conn.cursor()
        # Save the cursor in the customer's cursor dictionary
        cur_dict['customers'][session_id] = cur

    return_val = customer_menu_search(cur, query)

    if 'error' in return_val:
        abort(400, return_val['error'])

    return dumps(return_val)

@APP.route("/get_allergies", methods=['GET'])
def get_allergies_flask():
    """
    Shows the list of allergies stored in the database
    
    Inputs: No inputs
        
    Returns:
        - return_list: (list(list)): This is a list of lists of allergy information including name, id, and description
    """
    cur = db_conn.cursor()

    query_get_allergies = """
        select id, name, description 
        from allergies;
    """

    cur.execute(query_get_allergies, [])

    return_list = []
    for tup in cur.fetchall():
        tmp = []
        tmp.append(tup[0])
        tmp.append(tup[1])
        tmp.append(tup[2])
        return_list.append(tmp)

    cur.close()
    return dumps(return_list)

@APP.route("/customer/finalise_order", methods=['POST'])
def customer_finalise_order_flask():
    """
    This confirms the selection of the order for the user and sends it to the kitchen staff
    
    Inputs:
        - session_id (string): The session_id 
        - menu_id (string): The menu id
        
    Returns:
        - return_val: (dictionary): This will show if it was a success or an error
    """
    data = ast.literal_eval(request.get_json())
    
    session_id = data["session_id"]
    menu_id = data["menu_id"]
    
    # List of possible error messages to be used with abort()

    invalid_session_id = 'invalid session_id'
    invalid_menu_id = 'no orders with the given menu_id'
    already_sent_to_kitchen = 'Already sent to kitchen'
    success = {'success': 'order finalised'}
    
    # Fetch the orders list for the restaurant

    orders_list = None
    if menu_id in orders:
        orders_list = orders[menu_id]
    else:
        abort(400, invalid_menu_id)

    # find the order with session_id
    order_list = [order for order in orders_list if order["session_id"] == session_id]
    
    if len(order_list) > 0:
        if order_list[0]['status'] == 'kitchen':
            abort(400, already_sent_to_kitchen)
        else:
            order_list[0]['status'] = 'kitchen'
            order_list[0]['timestamp'] = datetime.now().strftime("%d %B %Y, %H:%M:%S")
            
        return success
    else:
        abort(400, invalid_session_id)
    
    
@APP.route("/customer/request_assistance", methods=['POST'])
def customer_request_assistance_flask():
    """
    This sends an assistance request to the wait staff
    
    Inputs:
        - session_id (string): The session_id 
        - menu_id (string): The menu id
        - table_id (string): The table number
        
    Returns:
        - return_val: (dictionary): This will show if it was a success or an error
    """
    data = ast.literal_eval(request.get_json())
    
    # List of possible error messages to be used with abort()

    already_in = "The request has already been added in the system"
    add_notification_fail = "It did not successfully add to the dictionary"
    success = {"success": "assistance requested"}
    
    table_id = data["table_id"]
    session_id = data["session_id"]
    menu_id = str(data["menu_id"])
    
    
    # if this is the first notification in a restaurant, the notifications[menu_id] might not be defined

    if menu_id not in notifications:
        notifications[menu_id] = []

    # Block multiple assistance requests from the same table to avoid spamming

    for notification in notifications[menu_id]:
        if notification['table_id'] == table_id:
            abort(400, already_in)
    
    # Append a new notification with status 'customer' showing that the customer just requested it

    notifications[menu_id].append( {
        "session_id": session_id,
        "table_id": table_id,
        "status": 'customer',
        "timestamp": datetime.now().strftime("%d %B %Y, %H:%M:%S")
    } )
        
    found = False
    for notice in notifications[menu_id]:
        if notice["session_id"] == session_id and notice["table_id"] == table_id:
            found = True
            break
    
    if found:
        return dumps(success)
    else:    
        abort(400, add_notification_fail)
    
@APP.route("/customer/give_rating", methods=['POST'])
def customer_give_rating_flask():
    """
    This gives a rating to the given menu item
    
    Inputs:
        - session_id (string): The session_id 
        - menu_item_id (string): The menu item id
        - rating (int): A number between 1-5 inclusive
        - amount (int): The amount it has been ordered for
        
    Returns:
        - return_val: (dictionary): This will show if it was a success or an error
    """
    
    data = ast.literal_eval(request.get_json())
    session_id = data['session_id']
    menu_item_id = data['menu_item_id']
    rating = int(data['rating'])
    amount = int(data['amount'])
    
    # Create or retrieve the cursor

    cur = None
    if session_id in cur_dict['customers']:
        cur = cur_dict['customers'][session_id]
    else:
        cur = db_conn.cursor()
        # Save the cursor in the customer's cursor dictionary
        cur_dict['customers'][session_id] = cur

    return_val = customer_give_rating(cur, menu_item_id, rating, amount)

    if 'error' in return_val:
        abort(400, return_val['error'])

    db_conn.commit()

    return dumps(return_val)

# Kitchen Staff functions

@APP.route("/kitchen_staff/get_order_list", methods=['GET'])
def kitchen_staff_get_order_list_flask():   
    """
    This gets the list of orders being sent to the kitchen staff from the order dictionary
    
    Inputs:
        - kitchen_staff_id (string): The kitchen staff id
        - menu_id (string): The menu id
        
    Returns:
        - output: (list(dictionary)): This return all the orders that are sent to the kitchen staff
            with status 'kitchen', or 'cooking' and matching the current kitchen staff id
    """
    menu_id = request.args.get('menu_id')
    kitchen_staff_id = request.args.get('kitchen_staff_id')

    output = []
    
    if menu_id not in orders:
        return dumps(output)

    orders_list = orders[menu_id]
    
    for customer_order in orders_list:
        temp_dict = {}
        
        temp_list = []
        if customer_order['status'] == 'kitchen' or (customer_order['status'] == 'cooking' and customer_order['kitchen_staff_id'] == kitchen_staff_id):
            for menu_item in customer_order['menu_items']:
                temp_list_dict = {}
                temp_list_dict.update({'food_id': menu_item['menu_item_id']})
                temp_list_dict.update({'food_name': menu_item['title']})
                temp_list_dict.update({'image': menu_item['image']})
                temp_list_dict.update({'amount': menu_item['amount']})
                temp_list.append(temp_list_dict)
                    
            if len(temp_list) != 0:
                temp_dict.update({'session_id': customer_order['session_id']})
                temp_dict.update({'table_id': customer_order['table_id']})
                temp_dict.update({'status': customer_order['status']})
                temp_dict.update({'timestamp': customer_order['timestamp']})
                temp_dict.update({'menu_items': temp_list})
                output.append(temp_dict)
    
        
    return dumps(output)

@APP.route("/kitchen_staff/mark_currently_cooking", methods=['POST'])
def kitchen_staff_mark_currently_cooking_flask():
    """
    This marks the order to be currently cooking
    
    Inputs:
        - kitchen_staff_id (string): The kitchen staff id
        - menu_id (string): The menu id
        - session_id (string): The session id
        
    Returns:
        - success: (dictionary): This will show a success message

        OR

        - abort(400) will be called with an error message
    """
    
    data = ast.literal_eval(request.get_json())
    menu_id = data['menu_id']
    session_id = data['session_id']
    kitchen_staff_id = data['kitchen_staff_id']

    # List of possible error messages to be used with abort()

    update_fail = 'could not change order status'
    invalid_id = 'invalid menu_id' 
    success = {'success': 'Marked as currently cooking'}

    if menu_id not in orders:
        abort(400, invalid_id)

    order_list = orders[menu_id]

    for order in order_list:
        if order['session_id'] == session_id and order['status'] == 'kitchen':
            order['status'] = 'cooking'
            order['kitchen_staff_id'] = kitchen_staff_id
            
    # Check that it got updated

    for order in order_list:
        if order['session_id'] == session_id and order['status'] != 'cooking':
            abort(400, update_fail)
            
    return dumps(success)

@APP.route("/kitchen_staff/mark_order_complete", methods=['POST'])
def kitchen_staff_mark_order_complete_flask():   
    """
    This marks the order as complete and sends it to the wait staff
    
    Inputs:
        - menu_id (string): The menu id
        - session_id (string): The session id
        
    Returns:
        - return_val: (dictionary): This will show if it was a success or an error
    """
    data = ast.literal_eval(request.get_json())
    menu_id = data['menu_id']
    session_id = data['session_id']

    # List of possible error messages to be used with abort()

    update_fail = 'could not change order status'
    invalid_id = 'invalid menu_id'
    success = {'success': 'Order sent to wait staff'}
    
    if menu_id not in orders:
        abort(400, invalid_id)

    order = orders[menu_id] # grabbing the orders from the dictionary
    
    for customer_order in order:
        if customer_order['session_id'] == session_id and customer_order['status'] == 'cooking':
            customer_order['status'] = 'wait'
            customer_order['timestamp'] = datetime.now().strftime("%d %B %Y, %H:%M:%S")
            
    # Check that the update was successful
    
    for customer_order in order:
        if customer_order['session_id'] == session_id and customer_order['status'] != 'wait':
            abort(400, update_fail)
            
    return dumps(success)
            
    
        
# Wait Staff functions

@APP.route("/wait_staff/get_order_list", methods=['GET'])
def wait_staff_get_order_list_flask():
    """
    This sends the list of orders with status 'wait' to the wait staff (or status 'serving' and the wait staff id matches)
    
    Inputs:
        - menu_id (string): The menu id
        - wait_staff_id (string): The wait staff id
        
    Returns:
        - output:(list(dictionary)): This returns a list of all the orders that are sent to the wait staff
    """   
    
    menu_id = request.args.get('menu_id')
    wait_staff_id = request.args.get('wait_staff_id')

    output = []
    
    if menu_id not in orders:
        return dumps(output)

    order_list = orders[menu_id]
    
    for order in order_list:
        temp_dict = {}
        
        temp_list = []
        if order['status'] == 'wait' or (order['status'] == 'serving' and order['wait_staff_id'] == wait_staff_id):
            for menu_item in order['menu_items']:
                temp_list_dict = {}
                temp_list_dict.update({'food_id': menu_item['menu_item_id']})
                temp_list_dict.update({'food_name': menu_item['title']})
                temp_list_dict.update({'image': menu_item['image']})
                temp_list_dict.update({'amount': menu_item['amount']})
                temp_list.append(temp_list_dict)
                    
            if len(temp_list) != 0:
                temp_dict.update({'session_id': order['session_id']})
                temp_dict.update({'table_id': order['table_id']})
                temp_dict.update({'status': order['status']})
                temp_dict.update({'timestamp': order['timestamp']})
                temp_dict.update({'menu_items': temp_list})
                output.append(temp_dict)

    return dumps(output)

@APP.route("/wait_staff/mark_currently_serving", methods=['POST'])
def wait_staff_mark_currently_serving_flask():
    """
    This marks the order to be currently served by the given wait staff
    
    Inputs:
        - wait_staff_id (string): The wait staff id
        - menu_id (string): The menu id
        - session_id (string): The session id
        
    Returns:
        - success: (dictionary): This will show if it was a success message

        OR

        - abort(400) with an error message
    """   
    
    data = ast.literal_eval(request.get_json())

    menu_id = data['menu_id']
    session_id = data['session_id']
    wait_staff_id = data['wait_staff_id']

    # List of possible error messages to be used with abort()

    invalid_menu_id = 'invalid menu_id, or there are no orders'
    update_fail = 'could not mark order as being served'
    success = {'success': 'Order marked as currently serving'}

    if menu_id not in orders:
        abort(400, invalid_menu_id)

    order_list = orders[menu_id]

    for order in order_list:
        if order['session_id'] == session_id and order['status'] == 'wait':
            order['status'] = 'serving'
            order['wait_staff_id'] = wait_staff_id

    # Check that the order got updated

    for order in order_list:
        if order['session_id'] == session_id and order['status'] != 'serving':
            abort(400, update_fail)
    
    return dumps(success)


@APP.route("/wait_staff/mark_order_complete", methods=['DELETE'])
def wait_staff_mark_order_complete_flask():
    """
    This marks the order to be completed serving by the waiter
    
    Inputs:
        - menu_id (string): The menu id
        - session_id (string): The session id
        
    Returns:
        - success: (dictionary): This will show a success on successful deletion
    """
    
    data = ast.literal_eval(request.get_json())
    menu_id = data['menu_id']
    session_id = data['session_id']

    # List of possible error messages to be used with abort()

    invalid_id = 'invalid menu_id, or there are no orders' # error message
    fail = 'could not remove order'
    success = {'success': 'Order removed from orders'}
    
    if menu_id not in orders:
        abort(400, invalid_id)

    customer_orders = orders[menu_id] # grabbing the orders from the dictionary
    
    # Remove order from the list of orders

    for customer_order in customer_orders:
        if customer_order['session_id'] == session_id and customer_order['status'] == 'serving':
            customer_orders.remove(customer_order)
            
    # Check that it got removed
    for customer_order in customer_orders:
        if customer_order['session_id'] == session_id and customer_order['status'] == 'serving':
            abort(400, fail)
    
    return dumps(success)


@APP.route("/wait_staff/mark_notification_complete", methods=['DELETE'])
def wait_staff_mark_notification_complete_flask():
    """
    This marks the notifcation as completed
    
    Inputs:
        - menu_id (string): The menu id
        - session_id (string): The session id
        - table_id (string): The table number
        
    Returns:
        - return_val: (dictionary): This will show if it was a success or an error
    """
    
    data = ast.literal_eval(request.get_json())
    menu_id = data['menu_id']
    
    session_id = data['session_id']
    table_id = data['table_id']
    
    # List of possible error messages to be used with abort()

    remove_fail = 'could not remove notification'
    invalid_menu_id = 'given menu id has no list of notifications'
    success = {'success': 'notification removed from notifications'}
    
    if menu_id not in notifications:
        abort(400, invalid_menu_id)
    
    notifications_list = notifications[menu_id]
    
    # Once marked as completed, remove it from the list of notifications

    for notif in notifications_list:
        if notif['session_id'] == session_id and notif['table_id'] == table_id:
            notifications_list.remove(notif)
            
    # Check if it got removed

    for notif in notifications_list:
        if notif['session_id'] == session_id and notif['table_id'] == table_id:
            abort(400, remove_fail)
    
    return dumps(success)

@APP.route("/wait_staff/get_assistance_notifications", methods=['GET'])
def wait_staff_get_assistance_notifications_flask():
    """
    This gets all notifcations of requests for assistance by customers not currently handled by a waiter,
    or if the current wait staff is responding to the notification
    
    Inputs:
        - menu_id (string): The menu id
        - session_id (string): The session id
        - table_id (string): The table number
        - wait_staff_id (string): The wait staff id
        
    Returns:
        - output: (list(dictionary)): This will show the list of notifications to the wait staff in the frontend
    """
    
    menu_id = request.args.get('menu_id')    
    wait_staff_id = request.args.get('wait_staff_id')

    if menu_id in notifications:
        notification_list = notifications[menu_id]
        output = []
        for notification in notification_list:
            if notification['status'] == 'customer' or (notification['status'] == 'wait' and notification['wait_staff_id'] == wait_staff_id):
                output.append(notification)
        return dumps(output)
    else:
        return dumps([])

@APP.route("/wait_staff/mark_currently_assisting", methods=['POST'])
def wait_staff_mark_currently_assisting_flask():
    """
    This marks the notfication selected as being currently assisted
    
    Inputs:
        - menu_id (string): The menu id
        - session_id (string): The session id
        - table_id (string): The table number
        
    Returns:
        - success: (dictionary): This will show a success message
    """

    data = ast.literal_eval(str(request.get_json()))
    session_id = data['session_id']
    menu_id = data['menu_id']
    table_id = data['table_id']
    wait_staff_id = data['wait_staff_id']

    # List of possible error messages to be used with abort()

    invalid_menu_id = 'invalid menu_id'
    not_found = 'notification not found'
    success = { 'success': 'successfully marked notification as currently assisting' }

    if menu_id not in notifications:
        return abort(400, invalid_menu_id)
    
    for notification in notifications[menu_id]:
        if notification['table_id'] == table_id and notification['session_id'] == session_id:
            notification['status'] = 'wait'
            notification['wait_staff_id'] = wait_staff_id
            return dumps(success)

    return abort(400, not_found)

if __name__ == "__main__":
    
    # For coverage
    signal.signal(signal.SIGINT, quit_gracefully)
    
    try:
        db_conn = psycopg2.connect('dbname=wait_management_system user=lubuntu password=lubuntu')
        print(db_conn)
    except Exception as e:
        print( 'Unable to connect to database: ' + str(e))
    
    # Use a default Port Number

    port = 8880

    # If port number is given as cmdline argument, use that
    if len(sys.argv) > 1:
        port = int(sys.argv[1])

    APP.run(port=port)
