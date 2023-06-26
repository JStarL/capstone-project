import signal
from json import dumps
from flask import Flask, request
from flask_cors import CORS
import psycopg2

import sys
import ast


from manager import manager_view_menu, manager_view_food_item, manager_add_category, manager_delete_category, manager_add_menu_item, manager_delete_menu_item, manager_update_category, manager_update_menu_item
from auth import login_backend, register_backend
from customer import customer_view_menu

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

# Will be changed on future sprints. ID will replace email.
# cur_dict = {
#     'managers': {
#         manager@gmail.com: cur1, # manager_email: cursor
#         manager2@gmail.com: cur2,
#     }, 
#     'staff': {
#         kitchen@gmail.com: cur3, # kitchen / wait staff email: cursor
#         wait_staff@gmail.com: cur4,
#     },
#     'customers': {
#         123456: cur5, # session_id: cursor
#         234567: cur6
#     }
# }

cur_dict = {
    'staff': {
        
    },
    
    'customers': {
        
    }
}




# @APP.route("/echo", methods=['GET'])
# def echo():
#     data = request.args.get('data')
#     return dumps({
#         'data': echo_v2(data)
#     })


# @APP.route('/clear/v1', methods=['DELETE'])
# def clear():
#     return dumps(clear_v1())


# Auth functions


@APP.route('/auth/register', methods=['POST'])
def register_flask():
    data = ast.literal_eval(request.get_json())
    cur = db_conn.cursor()
    return_val = dumps(register_backend(cur, data['email'], data['password'], data['name'], data['resturant_name'], data['location']))
    if 'success' in return_val:
        cur_dict['staff'][data['email']] = cur
    db_conn.commit()
    return return_val

@APP.route('/auth/login', methods=['POST'])
def login_flask():
    data = ast.literal_eval(request.get_json())
    cur = db_conn.cursor()
    return_val = dumps(login_backend(cur, data['email'], data['password']))
    if 'success' in return_val:
        cur_dict['staff'][data['email']] = cur
    return return_val

@APP.route('/auth/logout', methods=['POST'])
def auth_logout():
    data = request.get_json()
    return dumps(auth_logout(data['token']))

# Manager functions

@APP.route("/manager/view_menu", methods=['GET'])
def manager_view_menu_flask():
    manager_id = request.args.get("manager_id")
    menu_id = request.args.get("menu_id")
    cur = cur_dict['staff'][manager_id]
    
    return dumps(manager_view_menu(cur, manager_id, menu_id))

@APP.route("/manager/view_food_item", methods=['GET'])
def manager_view_food_item_flask():
    manager_id = request.args.get("manager_id")
    menu_id = request.args.get("menu_id")
    food_id = request.args.get("food_id")
    cur = cur_dict['staff'][manager_id]
    return dumps(manager_view_food_item(cur, manager_id, menu_id, food_id))

@APP.route("/manager/add_category", methods=['POST']) #this may need menu_id 
def manager_add_category_flask():
    data = ast.literal_eval(request.get_json())
    cur = cur_dict['staff'][data['manager_id']]
    return_val = dumps(manager_add_category(cur, data['category_name'], data['menu_id']))
    db_conn.commit()
    return return_val

@APP.route("/manager/delete_category", methods=['DELETE'])
def manager_delete_category_flask():
    data = ast.literal_eval(request.get_json())
    cur = cur_dict['staff'][data['manager_id']]
    return_val = dumps(manager_delete_category(cur, data['category_id']))
    db_conn.commit()
    return return_val

@APP.route("/manager/update_category", methods=['POST'])
def manager_update_category_flask():
    data = ast.literal_eval(request.get_json())
    cur = cur_dict['staff'][data['manager_id']]
    return_val = dumps(manager_update_category(cur, data['category_name'], data['category_id']))
    db_conn.commit()
    return return_val

@APP.route("/manager/add_menu_item", methods=['POST'])
def manager_add_menu_item_flask():
    data = ast.literal_eval(request.get_json())
    cur = cur_dict['staff'][data['manager_id']]
    return_val = dumps(manager_add_menu_item(cur, data['title'], data['price'], data['ingredients'], data['description'], data['category_id'], data['menu_id']))
    db_conn.commit()
    return return_val

@APP.route("/manager/delete_menu_item", methods=['DELETE'])
def manager_delete_menu_item_flask():
    data = ast.literal_eval(request.get_json())
    cur = cur_dict['staff'][data['manager_id']]
    return_val = dumps(manager_delete_menu_item(cur, data['menu_item_id']))
    db_conn.commit()
    return return_val

@APP.route("/manager/update_menu_item", methods=['POST'])
def manager_update_menu_item_flask():
    data = ast.literal_eval(request.get_json())
    cur = cur_dict['staff'][data['manager_id']]
    return_val = dumps(manager_update_menu_item(cur, data['menu_item_id'], data['title'], data['price'], data['ingredients'], data['description'], data['category_id'], data['menu_id'], data['image']))
    db_conn.commit()
    return return_val

# Customer functions

@APP.route("/customer/view_menu", methods=['GET'])
def customer_view_menu_flask():
    menu_id = request.args.get("menu_id")
    session_id = request.args.get("session_id")
    cur = None
    if session_id in cur_dict['customers']:
        cur = cur_dict['customers'][session_id]
    else:
        cur = db_conn.cursor()
        cur_dict['customers'][session_id] = cur
    return dumps(customer_view_menu(cur, menu_id))

##############################################################################################################################
################################################ OLD PROJECT STUFF ###########################################################
##############################################################################################################################

# Channels functions
'''

@APP.route("/channels/create/v2", methods=['POST'])
def server_channels_create_v2():
    data = request.get_json()
    return dumps(channels_create_v2(data['token'], data['name'], data['is_public']))


@APP.route("/channels/list/v2", methods=['GET'])
def server_channels_list_v2():
    token = request.args.get("token")
    return dumps(channels_list_v2(token))


@APP.route("/channels/listall/v2", methods=['GET'])
def server_channels_listall_return():
    token = request.args.get("token")
    return dumps(channels_listall_v2(token))


# Channel functions


@APP.route("/channel/details/v2", methods=['GET'])
def server_channels_detail_return():
    token = request.args.get("token")
    channel_id = int(request.args.get("channel_id"))
    return dumps(channel_details_v2(token, channel_id))


@APP.route("/channel/join/v2", methods=['POST'])
def server_channel_join_v2():
    data = request.get_json()
    channel_join_v2(data['token'], data['channel_id'])
    return {}


@APP.route("/channel/invite/v2", methods=['POST'])
def server_channel_invite_v2():
    data = request.get_json()
    channel_invite_v2(data['token'], data['channel_id'], data['u_id'])
    return {}


@APP.route("/channel/messages/v2", methods=['GET'])
def server_channel_messages_v2():
    token = request.args.get('token')
    channel_id = int(request.args.get('channel_id'))
    start = int(request.args.get('start'))
    return dumps(channel_messages_v2(token, channel_id, start))


@APP.route("/channel/leave/v1", methods=['POST'])
def server_channel_leave_v1():
    data = request.get_json()
    return dumps(channel_leave_v1(data['token'], data['channel_id']))


@APP.route("/channel/addowner/v1", methods=['POST'])
def server_channels_addowner_v1():
    data = request.get_json()
    return dumps(channel_addowner_v1(data['token'], data['channel_id'], data['u_id']))


@APP.route("/channel/removeowner/v1", methods=['POST'])
def server_channels_removeowner_v1():
    data = request.get_json()
    return dumps(channel_removeowner_v1(data['token'], data['channel_id'], data['u_id']))


# DM functions


@APP.route("/dm/create/v1", methods=['POST'])
def server_dm_create_v1():
    data = request.get_json()
    return dumps(dm_create_v1(data['token'], data['u_ids']))


@APP.route("/dm/list/v1", methods=['GET'])
def server_dm_list_v1():
    token = request.args.get('token')
    return dumps(dm_list_v1(token))


@APP.route("/dm/remove/v1", methods=['DELETE'])
def server_dm_remove_v1():
    data = request.get_json()
    dm_remove_v1(data['token'], data['dm_id'])
    return {}


@APP.route("/dm/details/v1", methods=['GET'])
def server_dm_details_v1():
    token = request.args.get('token')
    dm_id = int(request.args.get('dm_id'))
    return dumps(dm_details_v1(token, dm_id))


@APP.route("/dm/leave/v1", methods=['POST'])
def server_dm_leave_v1():
    data = request.get_json()
    dm_leave_v1(data['token'], data['dm_id'])
    return {}


@APP.route("/dm/messages/v1", methods=['GET'])
def server_dm_messages_v1():
    token = request.args.get('token')
    dm_id = int(request.args.get('dm_id'))
    start = int(request.args.get('start'))
    return dumps(dm_messages_v1(token, dm_id, start))


# Message functions


@APP.route("/message/send/v1", methods=['POST'])
def server_message_send_v1():
    data = request.get_json()
    return dumps(message_send_v1(data['token'], data['channel_id'], data['message']))


@APP.route("/message/edit/v1", methods=['PUT'])
def server_message_edit_v1():
    data = request.get_json()
    message_edit_v1(data['token'], data['message_id'], data['message'])
    return dumps({})


@APP.route("/message/remove/v1", methods=['DELETE'])
def server_message_remove_v1():
    data = request.get_json()
    message_remove_v1(data['token'], data['message_id'])
    return dumps({})


@APP.route("/message/senddm/v1", methods=['POST'])
def server_message_senddm_v1():
    data = request.get_json()
    return dumps(message_senddm_v1(data['token'], data['dm_id'], data['message']))

@APP.route("/message/share/v1", methods=['POST'])
def server_message_share_v1():
    data = request.get_json()
    return dumps(message_share_v1(data['token'], data['og_message_id'], data['message'], data['channel_id'], data['dm_id']))

@APP.route("/message/react/v1", methods = ['POST'])
def server_message_react_v1():
    data = request.get_json()
    return dumps(message_react_v1(data['token'], data['message_id'], data['react_id']))

@APP.route("/message/unreact/v1", methods = ['POST'])
def server_message_unreact_v1():
    data = request.get_json()
    return dumps(message_unreact_v1(data['token'], data['message_id'], data['react_id']))

@APP.route("/message/pin/v1", methods = ['POST'])
def server_message_pin_v1():
    data = request.get_json()
    return dumps(message_pin_v1(data['token'], data['message_id']))

@APP.route("/message/unpin/v1", methods = ['POST'])
def server_message_unpin_v1():
    data = request.get_json()
    return dumps(message_unpin_v1(data['token'], data['message_id']))


@APP.route('/message/sendlater/v1', methods=['POST'])
def message_sendlater():
    data = request.get_json()
    return dumps(message_sendlater_v1(data['token'], data['channel_id'], data['message'], data['time_sent']))


@APP.route('/message/sendlaterdm/v1', methods=['POST'])
def message_sendlaterdm():
    data = request.get_json()
    return dumps(message_sendlaterdm_v1(data['token'], data['dm_id'], data['message'], data['time_sent']))
    
    
# Profile Functions requests


@APP.route('/users/all/v1', methods=['GET'])
def users_all():
    token = request.args.get('token')
    return dumps(users_all_v1(token))


@APP.route("/user/profile/v1", methods=['GET'])
def user_profile_return():
    token = request.args.get('token')
    u_id = int(request.args.get('u_id'))
    return dumps(user_profile_v1(token, u_id))


@APP.route("/user/profile/setname/v1", methods=['PUT'])
def user_profile_setname():
    data = request.get_json()
    return dumps(user_profile_setname_v1(data['token'], data['name_first'], data['name_last']))


@APP.route("/user/profile/setemail/v1", methods=['PUT'])
def user_profile_setemail():
    data = request.get_json()
    return dumps(user_profile_setemail_v1(data['token'], data['email']))


@APP.route("/user/profile/sethandle/v1", methods=['PUT'])
def user_profile_sethandle():
    data = request.get_json()
    return dumps(user_profile_sethandle_v1(data['token'], data['handle_str']))

@APP.route("/user/profile/uploadphoto/v1", methods=['POST'])
def user_profile_uploadingphoto():
    data = request.get_json()
    return dumps(user_profile_uploadphoto_v1(data['token'], data['img_url'], data['x_start'], data['y_start'], data['x_end'], data['y_end']))

@APP.route("/user/stats/v1", methods=['GET'])
def user_stats():
    token = request.args.get('token')
    return dumps(user_stats_v1(token))

@APP.route("/users/stats/v1", methods=['GET'])
def users_stats():
    token = request.args.get('token')
    return dumps(users_stats_v1(token))


# Admin functions
@APP.route('/admin/userpermission/change/v1', methods=['POST'])
def admin_userpermission_change():
    data = request.get_json()
    return dumps(admin_userpermission_change_v1(data['token'], data['u_id'], data['permission_id']))


@APP.route('/admin/user/remove/v1', methods=['DELETE'])
def admin_user_remove():
    data = request.get_json()
    return dumps(admin_user_remove_v1(data['token'], data['u_id']))

# Standup functions


@APP.route("/standup/start/v1", methods=['POST'])
def server_standup_start_v1():
    data = request.get_json()
    return dumps(standup_start_v1(data['token'], data['channel_id'], data['length']))

@APP.route("/standup/send/v1", methods=['POST'])
def server_standup_send_v1():
    data = request.get_json()
    return dumps(standup_send_v1(data['token'], data['channel_id'], data['message']))

@APP.route("/standup/active/v1", methods=['GET'])
def server_standup_active_v1():
    token = request.args.get('token')
    channel_id = int(request.args.get('channel_id'))
    return dumps(standup_active_v1(token, channel_id))

@APP.route("/search/v1", methods=['GET'])
def server_search_v1():
    token = request.args.get('token')
    query_str = str(request.args.get('query_str'))
    return dumps(search_v1(token, query_str))


# Notifications

@APP.route('/notifications/get/v1', methods=['GET'])
def server_notifications_get_v1():
    token = request.args.get('token')
    return dumps(notifications_get_v1(token))
'''

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
