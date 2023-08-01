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

# NO NEED TO MODIFY ABOVE THIS POINT, EXCEPT IMPORTS
db_conn = None

# ID has replaced email
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


orders = {}

notifications = {}

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
        - return_val: {
            'success': string
            'manager_id': string
            'menu_id': string
            'category': string
        }
        OR
        - return_value: {
            'error': string
        }
    """
    data = ast.literal_eval(request.get_json())
    cur = db_conn.cursor()
    return_dict = register_backend(cur, data['email'], data['password'], data['name'], data['restaurant_name'], data['location'])
    return_val = dumps(return_dict)
    if 'error' in return_dict:
        abort(400, return_dict['error'])
    if 'success' in return_dict:
        cur_dict['staff'][str(return_dict['manager_id'])] = cur
        db_conn.commit()
    return return_val

@APP.route('/auth/login', methods=['POST'])
def login_flask():
    data = ast.literal_eval(request.get_json())
    cur = db_conn.cursor()
    return_dict = login_backend(cur, data['email'], data['password'])
    return_val = dumps(return_dict)
    if 'error' in return_dict:
        abort(400, return_dict['error'])
    if 'success' in return_dict:
        cur_dict['staff'][str(return_dict['staff_id'])] = cur
    return return_val

@APP.route('/auth/logout', methods=['POST'])
def auth_logout_flask():
    data = ast.literal_eval(request.get_json())
    logged_out = { 'success': 'logged out' }
    error = 'invalid staff_id'
    
    if data['staff_id'] in cur_dict['staff']:
        cur = cur_dict['staff'].pop(str(data['staff_id']))
        cur.close()
        return dumps(logged_out)
    else:
        abort(400, error)

@APP.route('/manager/add_staff', methods=['POST'])
def auth_add_staff_flask():
    data = ast.literal_eval(request.get_json())

    invalid_manager = 'invalid manager_id'

    if data['manager_id'] not in cur_dict['staff']:
        abort(400, invalid_manager)
    cur = cur_dict['staff'][data['manager_id']]
    return_val = auth_add_staff_backend(cur, data['email'], data['password'], data['staff_type'], data['name'], data['menu_id'])
    if 'error' in return_val:
        abort(400, return_val['error'])
    db_conn.commit()
    return dumps(return_val)


# Manager functions

@APP.route("/manager/view_menu", methods=['GET'])
def manager_view_menu_flask():
    manager_id = request.args.get("manager_id")
    menu_id = request.args.get("menu_id")
    excluded_ids = [-1]
    if 'excluded_cat_ids' in request.args:
        excluded_ids = ast.literal_eval(request.args.get("excluded_cat_ids"))
    top_k = 100
    if 'top_k' in request.args:
        top_k = request.args.get('top_k')
    cur = cur_dict['staff'][manager_id]
    
    return_val = manager_view_menu(cur,  menu_id, excluded_ids, top_k)
    if 'error' in return_val:
        abort(400, return_val['error'])
    return dumps(return_val)

@APP.route("/manager/view_category", methods=['GET'])
def manager_view_category_flask():
    manager_id = request.args.get("manager_id")
    category_id = request.args.get("category_id")
    excluded_ids = [-1]
    if 'excluded_cat_ids' in request.args:
        excluded_ids = ast.literal_eval(request.args.get("excluded_cat_ids"))
    top_k = 100
    if 'top_k' in request.args:
        top_k = request.args.get('top_k')
    cur = cur_dict['staff'][manager_id]

    return_val = manager_view_category(cur, category_id, excluded_ids, top_k)
    if 'error' in return_val:
        abort(400, return_val['error'])
    return dumps(return_val)

@APP.route("/manager/view_menu_item", methods=['GET'])
def manager_view_menu_item_flask():
    manager_id = request.args.get("manager_id")
    food_id = request.args.get("menu_item_id")
    cur = cur_dict['staff'][manager_id]
    return_val = manager_view_menu_item(cur, food_id)
    if 'error' in return_val:
        abort(400, return_val['error'])
    return dumps(return_val)

@APP.route("/manager/add_category", methods=['POST'])
def manager_add_category_flask():
    data = ast.literal_eval(request.get_json())
    cur = cur_dict['staff'][data['manager_id']]
    return_val = manager_add_category(cur, data['category_name'], data['menu_id'])
    if 'error' in return_val:
        abort(400, return_val['error'])
    db_conn.commit()
    return dumps(return_val)

@APP.route("/manager/delete_category", methods=['DELETE'])
def manager_delete_category_flask():
    data = ast.literal_eval(request.get_json())
    cur = cur_dict['staff'][data['manager_id']]
    return_val = manager_delete_category(cur, data['category_id'])
    if 'error' in return_val:
        abort(400, return_val['error'])
    db_conn.commit()
    return dumps(return_val)

@APP.route("/manager/update_category", methods=['POST'])
def manager_update_category_flask():
    data = ast.literal_eval(request.get_json())
    cur = cur_dict['staff'][data['manager_id']]
    return_val = manager_update_category(cur, data['category_name'], data['category_id'])
    if 'error' in return_val:
        abort(400, return_val['error'])
    db_conn.commit()
    return dumps(return_val)

@APP.route("/manager/add_menu_item", methods=['POST'])
def manager_add_menu_item_flask():
    data = ast.literal_eval(request.get_json())
    cur = cur_dict['staff'][data['manager_id']]
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
    data = ast.literal_eval(request.get_json())
    cur = cur_dict['staff'][data['manager_id']]
    return_val = manager_delete_menu_item(cur, data['menu_item_id'])
    if 'error' in return_val:
        abort(400, return_val['error'])
    db_conn.commit()
    return dumps(return_val)

@APP.route("/manager/update_menu_item", methods=['POST'])
def manager_update_menu_item_flask():
    data = ast.literal_eval(request.get_json())
    cur = cur_dict['staff'][data['manager_id']]
    return_val = manager_update_menu_item(cur, data['menu_item_id'], data['title'], data['price'], data['ingredients'], data['description'], data['category_id'], data['menu_id'], data['image'])
    if 'error' in return_val:
        abort(400, return_val['error'])
    db_conn.commit()
    return dumps(return_val)

@APP.route("/manager/update_category_ordering", methods=['POST'])
def manager_update_category_ordering_flask():
    data = ast.literal_eval(request.get_json())
    cur = cur_dict['staff'][data['manager_id']]
    return_val = manager_update_category_ordering(cur, data['category_id'], data['prev_ordering_id'], data['new_ordering_id'])
    if 'error' in return_val:
        abort(400, return_val['error'])
    db_conn.commit()
    return dumps(return_val)

@APP.route("/manager/update_menu_item_ordering", methods=['POST'])
def manager_update_menu_item_ordering_flask():
    data = ast.literal_eval(request.get_json())
    cur = cur_dict['staff'][data['manager_id']]
    return_val = manager_update_menu_item_ordering(cur, data['menu_item_id'], data['prev_ordering_id'], data['new_ordering_id'])
    if 'error' in return_val:
        abort(400, return_val['error'])
    db_conn.commit()
    return dumps(return_val)

# Customer functions

@APP.route("/customer/view_menu", methods=['GET'])
def customer_view_menu_flask():
    menu_id = request.args.get("menu_id")
    session_id = request.args.get("session_id")
    allergy_ids = ast.literal_eval(request.args.get("allergies"))
    excluded_cat_ids = ast.literal_eval(request.args.get("excluded_cat_ids"))

    if len(excluded_cat_ids) == 0:
        excluded_cat_ids = [-1]
        
    top_k = 100
    if 'top_k' in request.args:
        top_k = request.args.get('top_k')

    cur = None
    if session_id in cur_dict['customers']:
        cur = cur_dict['customers'][session_id]
    else:
        cur = db_conn.cursor()
        cur_dict['customers'][session_id] = cur
    
    return_val = customer_view_menu(cur, menu_id, allergy_ids, excluded_cat_ids, top_k)
    if 'error' in return_val:
        abort(400, return_val['error'])
        
    return dumps(return_val)

@APP.route("/customer/view_category", methods=['GET'])
def customer_view_category_flask():
    session_id = request.args.get("session_id")
    category_id = request.args.get("category_id")
    allergy_ids = ast.literal_eval(request.args.get("allergies"))
    excluded_cat_ids = ast.literal_eval(request.args.get("excluded_cat_ids"))

    if len(excluded_cat_ids) == 0:
        excluded_cat_ids = [-1]

    top_k = 100
    if 'top_k' in request.args:
        top_k = request.args.get('top_k')

    cur = None
    if session_id in cur_dict['customers']:
        cur = cur_dict['customers'][session_id]
    else:
        cur = db_conn.cursor()
        cur_dict['customers'][session_id] = cur
    return_val = customer_view_category(cur, category_id, allergy_ids, excluded_cat_ids, top_k)
    if 'error' in return_val:
        abort(400, return_val['error'])
    return dumps(return_val)

@APP.route("/customer/view_menu_item", methods=['GET'])
def customer_view_menu_item_flask():
    session_id = request.args.get("session_id")
    menu_item_id = request.args.get("menu_item_id")
    cur = None
    if session_id in cur_dict['customers']:
        cur = cur_dict['customers'][session_id]
    else:
        cur = db_conn.cursor()
        cur_dict['customers'][session_id] = cur
    return_val = customer_view_menu_item(cur, menu_item_id)
    if 'error' in return_val:
        abort(400, return_val['error'])
    return dumps(return_val)

@APP.route("/customer/menu/table", methods=['POST'])
def customer_menu_table_flask():
    data = ast.literal_eval(request.get_json())
    table_id = data['table_id']
    menu_id = data['menu_id']
    session_id = data['session_id']

    invalid_table_id = 'invalid table_id'
    success = {'table_id':  table_id}

    if table_id != None:
        
        if menu_id not in orders:
            orders[menu_id] = []
        if menu_id not in notifications:
            notifications[menu_id] = []
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
    data = ast.literal_eval(request.get_json())
    session_id = data['session_id']
    menu_id = data['menu_id']
    menu_item_id = data['menu_item_id']
    amount = int(data['amount'])
    persona = data['persona_name']
    
    invalid_menu_id = 'no orders with the given menu_id'
    invalid_menu_item_id = 'menu_item_id invalid'
    invalid_session_id = 'invalid session_id'
    amount_negative_error = 'amount cannot be negative'

    cur = None
    if session_id in cur_dict['customers']:
        cur = cur_dict['customers'][session_id]
    else:
        cur = db_conn.cursor()
        cur_dict['customers'][session_id] = cur

    if amount < 0:
        abort(400, amount_negative_error)
    
    menu_item_query = """
        SELECT title, description, image, price, category_id
        FROM menu_items
        WHERE id = %s;
    """
    
    cur.execute(menu_item_query, [menu_item_id])
    
    item = cur.fetchall() #menu item fetched
    if (len(item) == 0): #check if menu item exists
        abort(400, invalid_menu_item_id)
    item = item[0]

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
                "title" : item[0],
                "description": item[1],
                "image": item[2],
                "price": item[3],
                "persona": persona,
                "category_id": item[4]
            } )
        return order_list[0]
    else:
        abort(400, invalid_session_id)

@APP.route("/customer/remove_menu_item", methods=['DELETE'])
def customer_remove_menu_item_flask():
    data = ast.literal_eval(request.get_json())
    session_id = data['session_id']
    menu_id = data['menu_id']
    menu_item_id = data['menu_item_id']
    amount_to_be_removed = data['amount']
    persona = data['persona']

    invalid_menu_id = 'no orders with the given menu_id'
    invalid_session_id = 'invalid session_id'
    removing_extra = 'cant remove more menu_items than what is currently there'
    invalid_menu_item_id_or_persona = 'menu_item_id with given persona doesnt exist in this order'


    orders_list = None
    if menu_id in orders:
        orders_list = orders[menu_id]
    else:
        abort(400, invalid_menu_id)

    # find the order with session_id 
    order_list = [order for order in orders_list if order["session_id"] == session_id]
    
    if len(order_list) > 0:
        # check that the menu_item_id is there to be deleted
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
    session_id = request.args.get("session_id")
    menu_id = request.args.get('menu_id')

    invalid_menu_id = 'no orders with the given menu_id'
    invalid_session_id ='invalid session_id'

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

    session_id = request.args.get("session_id")
    query = request.args.get("query")
    
    cur = None
    if session_id in cur_dict['customers']:
        cur = cur_dict['customers'][session_id]
    else:
        cur = db_conn.cursor()
        cur_dict['customers'][session_id] = cur
    return_val = (customer_menu_search(cur, query))
    if 'error' in return_val:
        abort(400, return_val['error'])
    return dumps(return_val)

@APP.route("/get_allergies", methods=['GET'])
def get_allergies_flask():
    cur = db_conn.cursor()

    query = """
        select id, name, description from allergies;
    """

    cur.execute(query, [])

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
    data = ast.literal_eval(request.get_json())
    
    session_id = data["session_id"]
    menu_id = data["menu_id"]
    
    invalid_session_id = 'invalid session_id'
    invalid_menu_id = 'no orders with the given menu_id'
    already_sent_to_kitchen = 'Already sent to kitchen'
    success = {'success': 'order finalised'}

    # update_points_query = """
    #     UPDATE menu_items
    #     SET points = %s
    #     WHERE id = %s;
    # """
    
    # get_menu_items = """
    #     SELECT id, points
    #     FROM menu_items
    #     WHERE menu_id = %s;
    # """
    
    # cur.execute(get_menu_items, [menu_id])
    
    # menu_items_list = cur.fetchall()
    
    # tmp_list = []

    # cur = None
    # if session_id in cur_dict['customers']:
    #     cur = cur_dict['customers'][session_id]
    # else:
    #     cur = db_conn.cursor()
    #     cur_dict['customers'][session_id] = cur
    
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
            
        # for menu_item in order_list[0]['menu_items']:
        #     for menu_item_cur in menu_items_list:
        #         if int(menu_item_cur[0]) == int(menu_item['menu_item_id']):
        #             tmp_list.append({
        #                 "menu_item_id" : menu_item['menu_item_id'],
        #                 "points" : str(int(menu_item['amount']) + int(menu_item_cur[1]))
        #             })
        
        # for apply in tmp_list:
        #     cur.execute(update_points_query, [apply['points'], apply['menu_item_id']])
            
        
        # db_conn.commit()
        return success
    else:
        abort(400, invalid_session_id)
    
    
@APP.route("/customer/request_assistance", methods=['POST'])
def customer_request_assistance_flask():
    data = ast.literal_eval(request.get_json())
    
    already_in = "The request has already been added in the system"
    fail = "It did not successfully add to the dictionary"
    success = {"success": "assistance requested"}
    
    table_id = data["table_id"]
    session_id = data["session_id"]
    menu_id = str(data["menu_id"])
    found = False
    
    if menu_id not in notifications: #creates a dictionary key and adds an empty list
        notifications[menu_id] = []

    # might remove this block and allow multiple requests    
    for notification in notifications[menu_id]:
        if notification['table_id'] == table_id:
            abort(400, already_in)
    
    
    notifications[menu_id].append( {
        "session_id": session_id,
        "table_id": table_id,
        "status": 'customer',
        "timestamp": datetime.now().strftime("%d %B %Y, %H:%M:%S")
    } )
        
    for notice in notifications[menu_id]: #just to check if the notifcation has been added to the dictionary
        if notice["session_id"] == session_id and notice["table_id"] == table_id:
            found = True
            break
    
    if found:
        return dumps(success)
    else:    
        abort(400, fail)
    
@APP.route("/customer/give_rating", methods=['POST'])
def customer_give_rating_flask():
    data = ast.literal_eval(request.get_json())
    session_id = data['session_id']
    menu_item_id = data['menu_item_id']
    rating = int(data['rating'])
    amount = int(data['amount'])
    
    cur = None
    if session_id in cur_dict['customers']:
        cur = cur_dict['customers'][session_id]
    else:
        cur = db_conn.cursor()
        cur_dict['customers'][session_id] = cur

    return_val = customer_give_rating(cur, menu_item_id, rating, amount)

    if 'error' in return_val:
        abort(400, return_val['error'])

    db_conn.commit()

    return dumps(return_val)

# Kitchen Staff functions

@APP.route("/kitchen_staff/get_order_list", methods=['GET'])
def kitchen_staff_get_order_list_flask():   
    # kitchen_id = request.args.get('kitchen_staff_id')
    menu_id = request.args.get('menu_id')
    kitchen_staff_id = request.args.get('kitchen_staff_id')

    output = []
    
    # invalid_id = { 'error': 'invalid kitchen_staff_id' } # error message
    # cur = cur_dict['staff'][kitchen_id]
    # query_find_staff_menu = """
    #     SELECT menu_id
    #     FROM staff
    #     WHERE id = %s;
    # """
    
    # cur.execute(query_find_staff_menu, [kitchen_id])
    
    # menu_id = cur.fetchall()
    
    # if len(menu_id) == 0:
    #     return dumps(invalid_id)
    
    # menu_id = menu_id[0][0] # grabbing it from the list
    
    if menu_id not in orders:
        return dumps(output)

    order = orders[menu_id] # grabbing the orders from the dictionary
    
    for customer_order in order:
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
    data = ast.literal_eval(request.get_json())
    menu_id = data['menu_id']
    session_id = data['session_id']
    kitchen_staff_id = data['kitchen_staff_id']

    fail = 'could not change order status'
    invalid_id = 'invalid menu_id' 
    success = {'success': 'Marked as currently cooking'}

    if menu_id not in orders:
        abort(400, invalid_id)

    order_list = orders[menu_id]

    for order in order_list:
        if order['session_id'] == session_id and order['status'] == 'kitchen':
            order['status'] = 'cooking'
            order['kitchen_staff_id'] = kitchen_staff_id
            
    for order in order_list: #check if it got changed
        if order['session_id'] == session_id and order['status'] != 'cooking':
            abort(400, fail)
            
    return dumps(success)

@APP.route("/kitchen_staff/mark_order_complete", methods=['POST'])
def kitchen_staff_mark_order_complete_flask():   
    data = ast.literal_eval(request.get_json())
    # cur = cur_dict['staff'][data['kitchen_staff_id']]
    # kitchen_id = data['kitchen_staff_id']
    menu_id = data['menu_id']
    session_id = data['session_id']

    fail = 'could not change order status'
    invalid_id = 'invalid menu_id'
    success = {'success': 'Order sent to wait staff'}
    
    # query_find_staff_menu = """
    #     SELECT menu_id
    #     FROM staff
    #     WHERE id = %s;
    # """
    
    # cur.execute(query_find_staff_menu, [kitchen_id])
    
    # menu_id = cur.fetchall()
    
    # if len(menu_id) == 0:
    #     return dumps(invalid_id)
    
    # menu_id = menu_id[0][0] # grabbing it from the list
    
    if menu_id not in orders:
        abort(400, invalid_id)

    order = orders[menu_id] # grabbing the orders from the dictionary
    
    for customer_order in order:
        if customer_order['session_id'] == session_id and customer_order['status'] == 'cooking':
            customer_order['status'] = 'wait'
            customer_order['timestamp'] = datetime.now().strftime("%d %B %Y, %H:%M:%S")
            
    for customer_order in order: #check if it got changed
        if customer_order['session_id'] == session_id and customer_order['status'] != 'wait':
            abort(400, fail)
            
    return dumps(success)
            
    
        
# Wait Staff functions

@APP.route("/wait_staff/get_order_list", methods=['GET'])
def wait_staff_get_order_list_flask():   
    # wait_id = request.args.get('wait_staff_id')
    menu_id = request.args.get('menu_id')
    wait_staff_id = request.args.get('wait_staff_id')

    output = []

    # invalid_id = { 'error': 'invalid wait_staff_id' } # error message
    # cur = cur_dict['staff'][wait_id]
    # query_find_staff_menu = """
    #     SELECT menu_id
    #     FROM staff
    #     WHERE id = %s;
    # """
    
    # cur.execute(query_find_staff_menu, [wait_id])
    
    # menu_id = cur.fetchall()
    
    # if len(menu_id) == 0:
    #     return dumps(invalid_id)
    
    # menu_id = menu_id[0][0] # grabbing it from the list
    
    if menu_id not in orders:
        return dumps(output)

    order_list = orders[menu_id] # grabbing the orders from the dictionary
    
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
    data = ast.literal_eval(request.get_json())

    menu_id = data['menu_id']
    session_id = data['session_id']
    wait_staff_id = data['wait_staff_id']

    invalid_id = 'invalid menu_id, or there are no orders'
    fail = 'could not mark order as being served'
    success = {'success': 'Order marked as currently serving'}

    if menu_id not in orders:
        abort(400, invalid_id)

    order_list = orders[menu_id]

    for order in order_list:
        if order['session_id'] == session_id and order['status'] == 'wait':
            order['status'] = 'serving'
            order['wait_staff_id'] = wait_staff_id

    for order in order_list: # check if it got updated
        if order['session_id'] == session_id and order['status'] != 'serving':
            abort(400, fail)
    
    return dumps(success)


@APP.route("/wait_staff/mark_order_complete", methods=['DELETE'])
def wait_staff_mark_order_complete_flask():   
    data = ast.literal_eval(request.get_json())
    # wait_id = data['wait_staff_id']
    # cur = cur_dict['staff'][wait_id]
    menu_id = data['menu_id']
    session_id = data['session_id']


    invalid_id = 'invalid menu_id, or there are no orders' # error message
    fail = 'could not remove order'
    success = {'success': 'Order removed from orders'}
    
    # query_find_staff_menu = """
    #     SELECT menu_id
    #     FROM staff
    #     WHERE id = %s;
    # """
    
    # cur.execute(query_find_staff_menu, [wait_id])
    
    # menu_id = cur.fetchall()
    
    # if len(menu_id) == 0:
    #     return dumps(invalid_id)
    
    # menu_id = menu_id[0][0] # grabbing it from the list
    
    if menu_id not in orders:
        abort(400, invalid_id)

    customer_orders = orders[menu_id] # grabbing the orders from the dictionary
    
    for customer_order in customer_orders:
        if customer_order['session_id'] == session_id and customer_order['status'] == 'serving':
            customer_orders.remove(customer_order) # once marked as completed, remove it from the dictionary of orders
            
    for customer_order in customer_orders: # check if it got removed
        if customer_order['session_id'] == session_id and customer_order['status'] == 'serving':
            abort(400, fail)
    
    return dumps(success)


@APP.route("/wait_staff/mark_notification_complete", methods=['DELETE'])
def wait_staff_mark_notification_complete_flask():   
    data = ast.literal_eval(request.get_json())
    menu_id = data['menu_id']
    
    session_id = data['session_id']
    table_id = data['table_id']
    
    success = {'success': 'notification removed from notifications'}
    fail = 'could not remove notification'
    invalid_menu_id = 'given menu id has no list of notifications'
    
    # invalid_id = { 'error': 'invalid wait_staff_id' } # error message
    # wait_id = data['wait_staff_id']
    # cur = cur_dict['staff'][wait_id]
    # query_find_staff_menu = """
    #     SELECT menu_id
    #     FROM staff
    #     WHERE id = %s;
    # """
    # cur.execute(query_find_staff_menu, [wait_id])
    # menu_id = cur.fetchall()
    # if len(menu_id) == 0:
    #     return dumps(invalid_id)
    
    # menu_id = menu_id[0][0] # grabbing it from the list 
    
    if menu_id not in notifications:
        abort(400, invalid_menu_id)
    
    notifications_list = notifications[menu_id] # grabbing the notifications from the dictionary
    
    for notif in notifications_list:
        if notif['session_id'] == session_id and notif['table_id'] == table_id:
            notifications_list.remove(notif) # once marked as completed, remove it from the list of notifications
            
    for notif in notifications_list: # check if it got removed
        if notif['session_id'] == session_id and notif['table_id'] == table_id:
            abort(400, fail)
    
    return dumps(success)

@APP.route("/wait_staff/get_assistance_notifications", methods=['GET'])
def wait_staff_get_assistance_notifications_flask():
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
    data = ast.literal_eval(str(request.get_json()))
    session_id = data['session_id']
    menu_id = data['menu_id']
    table_id = data['table_id']
    wait_staff_id = data['wait_staff_id']
    
    invalid_menu_id = 'invalid menu_id'
    not_found = 'notification not found'
    success = { 'success': 'marked currently assisting' }

    if menu_id not in notifications:
        return abort(400, invalid_menu_id)
    
    for notification in notifications[menu_id]:
        if notification['table_id'] == table_id and notification['session_id'] == session_id:
            notification['status'] = 'wait'
            notification['wait_staff_id'] = wait_staff_id
            return dumps(success)

    return abort(400, not_found)

# NO NEED TO MODIFY BELOW THIS POINT


if __name__ == "__main__":
    signal.signal(signal.SIGINT, quit_gracefully)  # For coverage
    try:
        db_conn = psycopg2.connect('dbname=wait_management_system user=lubuntu password=lubuntu')
        print(db_conn)
        # conn.close()
    except Exception as e:
        print( 'Unable to connect to database: ' + str(e))
    port = 8880 # Default Port Number
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    APP.run(port=port)  # Do not edit this port
