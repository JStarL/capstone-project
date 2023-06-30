

def manager_view_menu(cur, menu_id):
    invalid_menu_id = { 'error': 'invalid menu id' } # error message
    menu = []

    query_categories = """
    select id, name from categories where menu_id = %s order by id;
    """
    
    query_menu_items = """
    select id, title, description, image, price, ingredients from menu_items where category_id = %s order by title;
    """
    cur.execute(query_categories, [menu_id])
    categories = cur.fetchall()        
    
    if len(categories) == 0:
        return invalid_menu_id

    for categ in categories:
        categ_id = categ[0]
        
        if categ[1] == 'Best Selling':
            # if this is the Best Selling Category,
            # give the frontend all the information on
            # food details so it can show on the UI

            cur.execute(query_menu_items, [categ_id])
            menu_items_list = []
            for menu_item in cur.fetchall():
                tmp = {}
                tmp.update({'food_id': menu_item[0]})
                tmp.update({'food_name': menu_item[1]})
                tmp.update({'food_description': menu_item[2]})
                tmp.update({'food_image': menu_item[3]})
                tmp.update({'food_price': menu_item[4]})
                tmp.update({'food_ingredients': menu_item[5]})
                menu_items_list.append(tmp)
            menu.append({str(categ_id): ['Best Selling', menu_items_list]})
        else:
            menu.append({str(categ_id): [categ[1], []]})
        
    return menu

def manager_view_category(cur, category_id):
    invalid_category_id = { 'error': 'invalid category_id' }
    menu_items = []

    query0 = """
    select id from categories where id = %s;
    """

    cur.execute(query0, [category_id])
    list1 = cur.fetchall()

    if len(list1) == 0:
        return invalid_category_id

    query1 = """
    select id, title, description, image, price, ingredients from menu_items where category_id = %s order by title;
    """

    cur.execute(query1, [category_id])
    list1 = cur.fetchall()
    
    for tup in list1:
        tmp = {}
        tmp.update({'food_id': tup[0]})
        tmp.update({'food_name': tup[1]})
        tmp.update({'food_description': tup[2]})
        tmp.update({'food_image': tup[3]})
        tmp.update({'food_price': tup[4]})
        tmp.update({'food_ingredients': tup[5]})
        menu_items.append(tmp)

    return menu_items

def manager_view_menu_item(cur, food_id):
    error = { 'error': 'invalid food_id' } # error message
    food = { 'success': 'Show food' } # supposed to show the food lol
    
    query1 = """
    select title, description, image, price, ingredients, category_id from menu_items where id = %s;
    """ 
    
    cur.execute(query1, [food_id]) #empty for now
    
    list1 = cur.fetchall()
    
    if len(list1) == 0: #No menu or something went wrong with the id
        #test
        return error
    else: #shows the food item
        tup = list1[0]
        food.update({'food_id': food_id})
        food.update({'food_name': tup[0]})
        food.update({'food_description': tup[1]})
        food.update({'food_image': tup[2]})
        food.update({'food_price': tup[3]})
        food.update({'food_ingredients': tup[4]}) # I'm not sure about this line
        food.update({'category_id': tup[5]})
        return food

def manager_add_category(cur, category_name, menu_id):
    error = { 'error': 'adding category failed' } # error message
    category = { 'success': 'success in adding category' } # supposed to success lol
    cant_use_best_selling = { 'error': 'Not allowed to use name "Best Selling"' }

    if category_name == 'Best Selling':
        return cant_use_best_selling

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
    error = { 'error': 'invalid category_id' } # error message
    delete_fail = { 'error': 'failed to delete category' }
    delete_fail_best_selling = { 'error': 'cannot remove default category best selling' }
    category = { 'success': 'success in removing category' } # supposed to show success lol
    
    query1 = """
        DELETE FROM categories
        WHERE id = %s;
    """ 
    query2 = """
        SELECT id, name 
        FROM categories
        WHERE id = %s;
    """ 
    
    cur.execute(query2, [category_id]) #check if it is there
    list1 = cur.fetchall()
    if len(list1) == 0:
        return error
    
    if list1[0][1] == 'Best Selling':
        return delete_fail_best_selling
    
    cur.execute(query1, [category_id])
    cur.execute(query2, [category_id])
    list1 = cur.fetchall()
    if len(list1) == 0: # id shouldn't exist, shows success message
        return category
    else: #something went wrong with deleting it
        return delete_fail
    
def manager_update_category(cur, category_name, category_id):
    invalid_category = { 'error': 'invalid category' } #error message
    update_name_fail = { 'error': 'failed to update name'}
    category = { 'success': 'success in removing category' } # supposed to show success lol
    cant_update_best_selling = { 'error': 'not allowed to manually update the "Best Selling" category' }

    if category_name == 'Best Selling':
        return cant_update_best_selling

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
    
    cur.execute(query2, [category_id])
    list1 = cur.fetchall()

    if len(list1) == 0: # category_id does not exist
        return invalid_category

    cur.execute(query1, [category_name, category_id])
    cur.execute(query2, [category_id])
    
    list1 = cur.fetchall()
    if len(list1) == 0: # id doesn't exist
        return invalid_category
    else: 
        if category_name == list1[0][1]:
            #shows success message
            category['category_id'] = list1[0][0]
            return category
        else:
            # Updating the name failed
            return update_name_fail
    

def manager_add_menu_item(cur, menu_item_name, price, ingredients, description, category_id, menu_id, image):
    error = { 'error': 'adding menu_item failed' }
    invalid_category_id = { 'error': 'invalid category_id'}
    invalid_best_selling = { 'error': 'cannot add menu items to the "Best Selling" category'}
    menu_item = {}

    # Can't add new menu_items to the 'Best Selling' category

    query0 = """
        select name from categories where id = %s;
    """

    cur.execute(query0, [category_id])
    list1 = cur.fetchall()

    if len(list1) == 0:
        return invalid_category_id

    if list1[0][0] == 'Best Selling':
        return invalid_best_selling

    query1 = """
        INSERT INTO menu_items (title, description, price, ingredients, category_id, menu_id, image)
        VALUES (%s, %s, %s, %s, %s, %s, %s);
    """ 
    query2 = """
        SELECT id
        FROM menu_items
        WHERE title = %s
        AND menu_id = %s;
    """ 
    
    cur.execute(query1, [menu_item_name, description, price, ingredients, category_id, menu_id, image])
    cur.execute(query2, [menu_item_name, menu_id])
    
    list1 = cur.fetchall()
    
    if len(list1) == 0:
        return error
    else:
        menu_item.update({'menu_item_id' : str(list1[0][0])}) # NOTE: Assumption that food item names are unique per menu
        return menu_item


def manager_delete_menu_item(cur, menu_item_id):
    error = { 'error': 'invalid menu_item_id' }
    error2 = { 'error': 'did not delete the menu item'}
    error3 = { 'error': 'invalid category_id' }
    invalid_best_selling = { 'error': 'cannot delete menu items from the "Best Selling" category'}
    success = { 'success': 'success in removing menu item' }
    
    # Can't manually delete menu items from the 'Best Selling' category

    query0_1 = """
        select category_id from menu_items where id = %s;
    """
    query0_2 = """
        select name from categories where id = %s;
    """
    cur.execute(query0_1, [menu_item_id])
    list1 = cur.fetchall()

    if len(list1) == 0:
        return error
    
    category_id = list1[0][0]

    cur.execute(query0_2, [category_id])
    list1 = cur.fetchall()
    
    if len(list1) == 0:
        return error3

    if list1[0][0] == 'Best Selling':
        return invalid_best_selling

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
    invalid_category_id = { 'error': 'invalid category_id'}
    invalid_best_selling = { 'error': 'cannot update menu items in the "Best Selling" category'}
    menu_item = {}
    
    # Can't manually update menu_items in the 'Best Selling' category

    query0 = """
        select name from categories where id = %s;
    """

    cur.execute(query0, [category_id])
    list1 = cur.fetchall()

    if len(list1) == 0:
        return invalid_category_id

    if list1[0][0] == 'Best Selling':
        return invalid_best_selling

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
        return menu_item
        # if menu_item_name == list1[0][1] and description == list1[0][2] and image == list1[0][3] and price == list1[0][4] and ingredients == list1[0][5] and category_id == list1[0][6] and menu_id == list1[0][7]:
        #     menu_item.update({'menu_item_id' : list1[0][0]})
        #     return menu_item
        # else:
        #     return error
    