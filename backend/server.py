import signal
from json import dumps
from flask import Flask, request
from flask_cors import CORS
import psycopg2

from src import config

from src.echo import echo_v2
from src.other import clear_v1
from src.auth import auth_login_v2, auth_register_v2, auth_logout_v1
from src.channels import channels_create_v2, channels_list_v2, channels_listall_v2
from src.channel import channel_join_v2, channel_invite_v2, channel_details_v2, channel_messages_v2
from src.channel_leave_v1 import channel_leave_v1
from src.channel_addowner_v1 import channel_addowner_v1
from src.channel_removeowner_v1 import channel_removeowner_v1
from src.dm_create_v1 import dm_create_v1
from src.dm_list_v1 import dm_list_v1
from src.dm_leave_v1 import dm_leave_v1
from src.dm_remove_v1 import dm_remove_v1
from src.dm_details_v1 import dm_details_v1
from src.dm_messages_v1 import dm_messages_v1
from src.message_send_v1 import message_send_v1
from src.message_edit_v1 import message_edit_v1
from src.message_share_v1 import message_share_v1
from src.message_remove_v1 import message_remove_v1
from src.message_senddm_v1 import message_senddm_v1
from src.users import users_all_v1
from src.user_profile_v1 import user_profile_v1
from src.user_profile_setemail_v1 import user_profile_setemail_v1
from src.user_profile_sethandle_v1 import user_profile_sethandle_v1
from src.user_profile_setname_v1 import user_profile_setname_v1
from src.admin import admin_user_remove_v1, admin_userpermission_change_v1
from src.user_stats_v1 import user_stats_v1
from src.users_stats_v1 import users_stats_v1
from src.user_profile_uploadphoto_v1 import user_profile_uploadphoto_v1
from src.notifications_get_v1 import notifications_get_v1
from src.message_pin_v1 import message_pin_v1
from src.message_unpin_v1 import message_unpin_v1
from src.message_react_v1 import message_react_v1
from src.message_unreact_v1 import message_unreact_v1
from src.message_sendlater_v1 import message_sendlater_v1
from src.message_sendlaterdm_v1 import message_sendlaterdm_v1
from src.standup_start_v1 import standup_start_v1
from src.standup_active_v1 import standup_active_v1
from src.standup_send_v1 import standup_send_v1
from src.search_v1 import search_v1


def quit_gracefully(*args):
    '''For coverage'''
    exit(0)


def defaultHandler(err):
    response = err.get_response()
    print('response', err, err.get_response())
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

""" EXAMPLE FLASK AND SERVER FUNCTIONS """
# LOOK AT ME!
# LOOK AT ME!
# LOOK AT ME!

def login_backend(email, password):
    
    # This Login is for both managers and staff
    # whose information is stored in 2 diff tables
    # so we need to check both tables

    # NOTE: The token used is their 'email' for now,
    # since managers and staff are stored in different tables
    
    invalid_email = { 'error': 'invalid email' }
    invalid_password = { 'error': 'invalid password' }
    logged_in = { 'success': 'logged in' }


    query1 = """
    select password from managers where email = %s
    """
    query2 = """
    select password from staff where email = %s
    """
    cur = db_conn.cursor()
    cur.execute(query1, [email])
    list1 = cur.fetchall()
    
    if len(list1) == 0:
        # Not a manager, maybe a staff
        cur.execute(query2, [email])
        list1 = cur.fetchall()
        if len(list1) == 0:
            # nobody has this email
            return invalid_email
        # Access and compare staff's password
        if password == list1[0][0]:
            return logged_in
        else:
            return invalid_password
    else:
        # Access and compare manager's password
        if password == list1[0][0]:
            return logged_in
        else:
            return invalid_password



@APP.route('/auth/login', methods=['POST'])
def login_flask():
    # For POST, it's a bit different to GET
    data = request.get_json()
    return dumps(login_backend(data['email'], data['password']))

# LOOK AT ME!
# LOOK AT ME!
# LOOK AT ME!

@APP.route("/echo", methods=['GET'])
def echo():
    data = request.args.get('data')
    return dumps({
        'data': echo_v2(data)
    })


@APP.route('/clear/v1', methods=['DELETE'])
def clear():
    return dumps(clear_v1())


# Auth functions


@APP.route('/auth/register/v2', methods=['POST'])
def auth_register():
    data = request.get_json()
    return dumps(auth_register_v2(data['email'], data['password'], data['name_first'], data['name_last']))


@APP.route('/auth/login/v2', methods=['POST'])
def auth_login():
    data = request.get_json()
    return dumps(auth_login_v2(data['email'], data['password']))


@APP.route('/auth/logout/v1', methods=['POST'])
def auth_logout():
    data = request.get_json()
    return dumps(auth_logout_v1(data['token']))


# Channels functions


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


# NO NEED TO MODIFY BELOW THIS POINT


if __name__ == "__main__":
    signal.signal(signal.SIGINT, quit_gracefully)  # For coverage
    try:
        db_conn = psycopg2.connect('dbname=wait_management_system user=lubuntu password=lubuntu')
        print(db_conn)
        # conn.close()
    except Exception as e:
        print( 'Unable to connect to database: ' + str(e))
    APP.run(port=config.port)  # Do not edit this port
