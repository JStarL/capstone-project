

def manager_view_menu(cur, menu_id, excluded_cat_list, top_k):
    """
    Returns a list of categories within the desired menu. For the best selling category,
    it returns all the menu items within it and all the information about each menu item.

    Inputs:
        - cur (cursor): The active cursor
        - menu_id (string(int)): The id of the menu the manager wishes to view
        - excluded_cat_list (list(int)): List of category ids wished to be excluded
        - top_k (int): The top k number of menu items wished to be shown

    Returns:
        - menu (list(dictionary)): List of dictionaries where each key is the category id
        and the value is the list of the category name, menu items (for best selling category only)
        and ordering id.

        OR

        - invalid_menu_id (dictionary): Error message if the menu id is invalid

    """
    
    invalid_menu_id = { 'error': 'invalid menu id' } # error message
    menu = []

    query_categories = """
        select id, name, ordering_id from categories where menu_id = %s order by ordering_id;
    """
    
    query_best_selling_items = """
        select m.id, m.title, m.description, m.image, m.price, b.ordering_id
        from menu_items m join best_selling_items b on (m.menu_id = b.menu_id and m.id = b.menu_item_id)
        where m.menu_id = %s
        order by b.ordering_id, m.title
        limit %s;
    """

    query_ingredients = """
    select name, allergy_id from ingredients where menu_item_id = %s;
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

            # Fetch all the menu items from the Best Selling category
            cur.execute(query_best_selling_items, [menu_id, top_k])
            menu_items_list = cur.fetchall()
            
            # Process each menu item to get its list of ingredients
            # And to package its details in a return dictionary
            
            return_menu_list = []
            for menu_item in menu_items_list:
                
                cur.execute(query_ingredients, [menu_item[0]])
                ingredients_list = []
                ingredients_list_input = cur.fetchall()

                if len(ingredients_list_input) > 0:
                    for ingredient in ingredients_list_input:
                        ingredients_list.append([ingredient[0], ingredient[1]])
                
                tmp = {}
                tmp.update({'food_id': menu_item[0]})
                tmp.update({'food_name': menu_item[1]})
                tmp.update({'food_description': menu_item[2]})
                tmp.update({'food_image': menu_item[3]})
                tmp.update({'food_price': menu_item[4]})
                tmp.update({'food_ordering_id': menu_item[5]})
                tmp.update({'food_ingredients': ingredients_list})
                return_menu_list.append(tmp)
            menu.append({str(categ_id): ['Best Selling', return_menu_list, categ[2]]})
        else:
            menu.append({str(categ_id): [categ[1], [], categ[2]]})
        
    return menu

def manager_view_category(cur, category_id, excluded_cat_list, top_k):
    """
    Returns a list of menu items within the desired category.

    Inputs:
        - cur (cursor): The active cursor
        - category_id (int): The id of the category the manager wishes to view
        - excluded_cat_list (list(int)): List of category ids wished to be excluded
        - top_k (int): The top k number of menu items wished to be shown

    Returns:
        - menu_items (list(dictionary)): List of dictionaries where each dictionary includes all information
        about a menu item such as id, name, description, image, price, ordering_id, ingredients and category_id.

        OR

        - invalid_category_id (dictionary): Error message if the category id is invalid
    """


    invalid_category_id = { 'error': 'invalid category_id' }
    menu_items = []

    query_categories = """
        select id, name, menu_id from categories where id = %s;
    """

    cur.execute(query_categories, [category_id])
    list1 = cur.fetchall()

    if len(list1) == 0:
        return invalid_category_id

    if list1[0][1] == 'Best Selling':
        query_best_selling_items = """
            select m.id, m.title, m.description, m.image, m.price, b.ordering_id
            from menu_items m join best_selling_items b on (m.menu_id = b.menu_id and m.id = b.menu_item_id)
            where m.menu_id = %s
            order by b.ordering_id, m.title
            limit %s
        ;
        """

        cur.execute(query_best_selling_items, [list1[0][2], top_k])
    else:
        query_menu_items = """
            select id, title, description, image, price, ordering_id
            from menu_items
            where category_id = %s
            order by ordering_id
            limit %s;
        """
        cur.execute(query_menu_items, [category_id, top_k])

    # Fetch menu_items list ...

    list1 = cur.fetchall()
    
    # ... and process each to add to return list menu_items

    for tup in list1:
        
        # Fetch and add in ingredients for each menu item, if there are any
        # and add all menu item information to a dictionary to append to the return list

        query_ingredients = """
            select name, allergy_id from ingredients where menu_item_id = %s;
        """
        cur.execute(query_ingredients, [tup[0]])

        ingredients_list = []
        ingredients_list_input = cur.fetchall()

        if len(ingredients_list_input) > 0:
            for ingredient in ingredients_list_input:
                ingredients_list.append([ingredient[0], ingredient[1]])

        tmp = {}
        tmp.update({'food_id': tup[0]})
        tmp.update({'food_name': tup[1]})
        tmp.update({'food_description': tup[2]})
        tmp.update({'food_image': tup[3]})
        tmp.update({'food_price': tup[4]})
        tmp.update({'food_ordering_id': tup[5]})
        tmp.update({'food_ingredients': ingredients_list})
        menu_items.append(tmp)

    return menu_items

def manager_view_menu_item(cur, food_id):
    """
    Returns information about the desired menu item with given id

    Inputs:
        - cur (cursor): The active cursor
        - food_id (int): The id of the menu item the customer wishes to view

    Returns:
        - food (dictionary): Dictionary includes all information about a menu item
        such as id, name, description, image, price, ordering_id, ingredients and category_id.

        OR

        - invalid_food_id (dictionary): Error message if the menu item id is invalid
    """
    
    invalid_food_id = { 'error': 'invalid food_id' }
    food = { 'success': 'Show food' }
    
    query_menu_item = """
        select title, description, image, price, category_id, ordering_id from menu_items where id = %s;
    """ 
    
    cur.execute(query_menu_item, [food_id])
    
    menu_item_list = cur.fetchall()
    
    # If no food is found with the given id, return an error

    if len(menu_item_list) == 0:
        return invalid_food_id

    # Fetch and add in ingredients for the menu item, if there are any
    # and add all menu item information to a dictionary to return

    query_ingredients = """
        select name, allergy_id from ingredients where menu_item_id = %s;
    """
    cur.execute(query_ingredients, [food_id])

    ingredients_list = []
    ingredients_list_input = cur.fetchall()

    if len(ingredients_list_input) > 0:
        for ingredient in ingredients_list_input:
            ingredients_list.append([ingredient[0], ingredient[1]])

    tup = menu_item_list[0]
    food.update({'food_id': food_id})
    food.update({'food_name': tup[0]})
    food.update({'food_description': tup[1]})
    food.update({'food_image': tup[2]})
    food.update({'food_price': tup[3]})
    food.update({'category_id': tup[4]})
    food.update({'food_ordering_id': tup[5]})
    food.update({'food_ingredients': ingredients_list})
    return food

def manager_add_category(cur, category_name, menu_id):
    """
    Adds a category into the database given its name and related menu_id
    
    Inputs:
        - cur (cursor): The active cursor
        - category_name (string): Name of the category
        - menu_id (string(int)): id of the menu to which category belongs

    Returns:
        - cant_set_empty_string (dictionary): empty names are not allowed

        OR

        - cant_use_best_selling (dictionary): cannot use the name "Best Selling"

        OR

        - category_insertion_fail (dictionary): inserting the new category failed

        OR 

        - category (dictionary): success dictionary with the newly inserted category's id

    """
    
    category_insertion_fail = { 'error': 'adding category failed' }
    category = { 'success': 'success in adding category' }
    cant_use_best_selling = { 'error': 'Not allowed to use name "Best Selling"' }
    cant_set_empty_string = { 'error': 'not allowed to use the name empty string ("")' }

    if category_name == '':
        return cant_set_empty_string

    if category_name == 'Best Selling':
        return cant_use_best_selling
    
    query_category_insertion = """
        insert into categories (name, menu_id)
        values (%s, %s);
    """ 
    query_get_category_id = """
        select id
        from categories
        where menu_id = %s
        and name = %s;
    """ 
    
    cur.execute(query_category_insertion, [category_name, menu_id])
    
    cur.execute(query_get_category_id, [menu_id, category_name])
    
    list1 = cur.fetchall()
    
    if len(list1) == 0:
        return category_insertion_fail
    else:
        category['category_id'] = list1[0][0]
        return category

def manager_delete_category(cur, category_id):
    """
    Deletes a category in the database given its id
    
    Inputs:
        - cur (cursor): The active cursor
        - category_id (string(int)): id of the category to be deleted

    Returns:
        - invalid_category_id (dictionary): the given category_id is invalid

        OR

        - delete_fail (dictionary): failed to delete category from database

        OR

        - delete_fail_best_selling (dictionary): failed to delete category because "Best Selling" cannot be manually deleted

        OR 

        - category (dictionary): success dictionary with the newly inserted category's id

    """

    invalid_category_id = { 'error': 'invalid category_id' }
    delete_fail = { 'error': 'failed to delete category' }
    delete_fail_best_selling = { 'error': 'cannot remove default category best selling' }
    category = { 'success': 'success in removing category' }

    query_delete = """
        delete from categories
        where id = %s;
    """ 
    query_categories = """
        select id, name 
        from categories
        where id = %s;
    """ 
    
    cur.execute(query_categories, [category_id]) #check if it is there
    list1 = cur.fetchall()
    if len(list1) == 0:
        return invalid_category_id
    
    if list1[0][1] == 'Best Selling':
        return delete_fail_best_selling
    
    cur.execute(query_delete, [category_id])
    
    # After being deleted, category should no longer exist in database
    
    cur.execute(query_categories, [category_id])
    list1 = cur.fetchall()
    if len(list1) == 0:
        return category
    else:
        return delete_fail
    
def manager_update_category(cur, category_name, category_id):
    """
    Deletes a category in the database given its id
    
    Inputs:
        - cur (cursor): The active cursor
        - category_id (string(int)): id of the category to be deleted

    Returns:
        - invalid_category (dictionary): the given category_id is invalid

        OR

        - update_name_fail (dictionary): failed to update category name

        OR

        - cant_update_best_selling (dictionary): failed to update category because "Best Selling" cannot be manually updated

        OR 

        - cant_set_empty_string (dictionary): cannot set new category name to empty string

        OR

        - category (dictionary): success dictionary with the updated category's id

    """
    
    invalid_category = { 'error': 'invalid category_id' }
    update_name_fail = { 'error': 'failed to update name'}
    category = { 'success': 'success in updating category' } # supposed to show success lol
    cant_update_best_selling = { 'error': 'not allowed to manually update the "Best Selling" category' }
    cant_set_empty_string = { 'error': 'not allowed to update the name to empty string' }

    if category_name == '':
        return cant_set_empty_string

    query_update = """
        update categories
        set name = %s
        where id = %s;
    """ 
    query_categories = """
        select id, name
        from categories
        where id = %s;
    """ 

    # Check the validity of the update
    # by checking whether the category_id is valid
    # and checking that we are not trying to update the "Best Selling" category

    cur.execute(query_categories, [category_id])
    categories = cur.fetchall()

    if len(categories) == 0:
        return invalid_category
    if categories[0][1] == 'Best Selling':
        return cant_update_best_selling

    # Update the category name

    cur.execute(query_update, [category_name, category_id])

    # Check that the update worked

    cur.execute(query_categories, [category_id])
    
    categories = cur.fetchall()
    if len(categories) == 0:
        return invalid_category
    else: 
        if category_name == categories[0][1]:
            category['category_id'] = categories[0][0]
            return category
        else:
            return update_name_fail

def manager_add_menu_item(cur, menu_item_name, price, ingredients, description, category_id, menu_id, image):
    """
    Adds a new menu item to the database
    
    Inputs:
        - cur (cursor): The active cursor
        - menu_item_name (string): name of the menu item
        - price (int): price of the menu item
        - ingredients (list): contains a list of ingredients, with each ingredient's name and allergy id
        - description (string): description of the menu item
        - category_id (string(int)): category_id to which the menu item belongs
        - menu_id (string(int)): menu_id or restaurant to which the menu item belongs
        - image (string): a base64 encoded string representing the menu item's image to be stored in the database

    Returns:
        - invalid_category_id (dictionary): the given category_id is invalid

        OR

        - add_menu_item_fail (dictionary): failed to add menu item

        OR

        - invalid_ingredients_update (dictionary): adding all ingredients for the menu item failed

        OR

        - invalid_best_selling (dictionary): cannot manually add menu items to "Best Selling"

        OR 

        - cant_set_empty_string (dictionary): cannot set new menu item name to empty string

        OR

        - menu_item (dictionary): success dictionary with the newly inserted menu item's id

    """
    
    add_menu_item_fail = { 'error': 'adding menu_item failed' }
    invalid_category_id = { 'error': 'invalid category_id'}
    invalid_ingredients_update = { 'error': 'Failed to add all ingredients' }
    invalid_best_selling = { 'error': 'cannot add menu items to the "Best Selling" category'}
    cant_set_empty_string = { 'error': 'not allowed to set the name to empty string' }
    menu_item = {}

    if menu_item_name == '':
        return cant_set_empty_string


    # Check for validity of category id
    # also can't add new menu_items to the 'Best Selling' category

    query_get_cat_name = """
        select name from categories where id = %s;
    """

    cur.execute(query_get_cat_name, [category_id])
    cat_name_list = cur.fetchall()

    if len(cat_name_list) == 0:
        return invalid_category_id

    if cat_name_list[0][0] == 'Best Selling':
        return invalid_best_selling

    query_insert_menu_item = """
        insert into menu_items (title, description, price, category_id, menu_id, image)
        values (%s, %s, %s, %s, %s, %s);
    """ 
    query_get_menu_item_id = """
        select id
        from menu_items
        where title = %s
        and menu_id = %s;
    """ 

    # Insert new menu item

    cur.execute(query_insert_menu_item, [menu_item_name, description, price, category_id, menu_id, image])
    
    # Check that the insertion was successful
    
    cur.execute(query_get_menu_item_id, [menu_item_name, menu_id])
    
    menu_items = cur.fetchall()

    if len(menu_items) == 0:
        return add_menu_item_fail
    menu_item_id = menu_items[0][0]

    if len(ingredients) > 0:
        
        # Insert each ingredient into the 'ingredients' table
        
        query_ingredients_insertion = """
            insert into ingredients (menu_item_id, name, allergy_id) values (%s, %s, %s);
        """
        
        for ingredient in ingredients:
            cur.execute(query_ingredients_insertion, [menu_item_id, ingredient[0], ingredient[1]])

        # Check that all ingredients were inserted:

        query_count_ingredients = """
            select count(*)
            from ingredients
            where menu_item_id = %s
            group by menu_item_id
            ;
        """

        cur.execute(query_count_ingredients, [menu_item_id])

        total_ingredients_count = cur.fetchall()

        if total_ingredients_count[0][0] != len(ingredients):
            return invalid_ingredients_update

    menu_item.update({'menu_item_id' : str(menu_item_id)})
    return menu_item


def manager_delete_menu_item(cur, menu_item_id):
    """
    Deletes the  menu item with given id
    
    Inputs:
        - cur (cursor): The active cursor
        - menu_item_id (string(int)): id of the menu item to be deleted

    Returns:
        - invalid_menu_item_id (dictionary): the given menu_item_id is invalid

        OR

        - delete_menu_item_fail (dictionary): failed to delete menu item

        OR

        - invalid_category_id (dictionary): invalid category_id

        OR

        - invalid_best_selling (dictionary): cannot manually delete menu items from "Best Selling"

        OR

        - success (dictionary): message saying that menu item was removed successfully

    """
    
    invalid_menu_item_id = { 'error': 'invalid menu_item_id' }
    delete_menu_item_fail = { 'error': 'did not delete the menu item'}
    invalid_category_id = { 'error': 'invalid category_id' }
    invalid_best_selling = { 'error': 'cannot delete menu items from the "Best Selling" category'}
    success = { 'success': 'success in removing menu item' }
    
    # Validity checks
    # Check that menu item is valid
    # Check that category_id is valid
    # Also can't manually delete menu items from the 'Best Selling' category

    query_get_category_id = """
        select category_id from menu_items where id = %s;
    """
    query_get_category_name = """
        select name from categories where id = %s;
    """
    cur.execute(query_get_category_id, [menu_item_id])
    category_id_list = cur.fetchall()

    if len(category_id_list) == 0:
        return invalid_menu_item_id
    
    category_id = category_id_list[0][0]

    cur.execute(query_get_category_name, [category_id])
    category_name_list = cur.fetchall()
    
    if len(category_name_list) == 0:
        return invalid_category_id

    if category_name_list[0][0] == 'Best Selling':
        return invalid_best_selling

    query_get_deleted_id = """
        select id
        from menu_items
        where id = %s;
    """ 

    query_delete_menu_item = """
        delete from menu_items
        where id = %s;
    """ 

    # Delete menu item

    cur.execute(query_delete_menu_item, [menu_item_id])
    
    # Check that menu item was actually removed
    
    cur.execute(query_get_deleted_id, [menu_item_id])
    deleted_id_list = cur.fetchall()
    
    if len(deleted_id_list) == 0:
        return success
    else:
        return delete_menu_item_fail

def manager_update_menu_item(cur, menu_item_id, menu_item_name, price, ingredients, description, category_id, menu_id, image):
    """
    Updates menu item in the database
    
    Inputs:
        - cur (cursor): The active cursor
        - menu_item_id (string(int)): id of the menu item
        - menu_item_name (string): (new) name of the menu item
        - price (int): (new) price of the menu item
        - ingredients (list): contains a (new) list of ingredients, with each ingredient's name and allergy id
        - description (string): (new) description of the menu item
        - category_id (string(int)): category_id to which the menu item belongs
        - menu_id (string(int)): menu_id or restaurant to which the menu item belongs
        - image (string): a (new) base64 encoded string representing the menu item's image to be stored in the database

    Returns:
        - invalid_menu_item (dictionary): the given menu_item_id is invalid

        OR

        - invalid_category_id (dictionary): the given category_id is invalid

        OR

        - invalid_ingredients_update (dictionary): adding all the new ingredients for the menu item failed

        OR

        - invalid_best_selling (dictionary): cannot manually update menu items in "Best Selling"

        OR 

        - cant_set_empty_string (dictionary): cannot set new menu item name to empty string

        OR

        - menu_item (dictionary): dictionary with success message

    """
    
    invalid_menu_item = { 'error': 'invalid menu item' }
    invalid_ingredients_update = { 'error': 'Failed to add all ingredients' }
    invalid_category_id = { 'error': 'invalid category_id'}
    invalid_best_selling = { 'error': 'cannot update menu items in the "Best Selling" category'}
    cant_set_empty_string = { 'error': 'not allowed to update the name to empty string' }
    menu_item = { 'success': 'successfully updated the menu item details' }

    if menu_item_name == '':
        return cant_set_empty_string

    # Can't manually update menu_items in the 'Best Selling' category

    query_get_category_name = """
        select name from categories where id = %s;
    """

    cur.execute(query_get_category_name, [category_id])
    category_name_list = cur.fetchall()

    if len(category_name_list) == 0:
        return invalid_category_id

    if category_name_list[0][0] == 'Best Selling':
        return invalid_best_selling

    query_check_menu_item = """
        select id
        from menu_items
        where id = %s;
    """ 
    
    query2 = """
        update menu_items
        set title = %s,
            description = %s,
            price = %s,
            category_id = %s,
            menu_id = %s,
            image = %s            
        where id = %s;
    """
    
    # Check for valid menu item id

    cur.execute(query_check_menu_item, [menu_item_id])
    
    menu_item_id_list = cur.fetchall()

    if len(menu_item_id_list) == 0:
        return invalid_menu_item 

    # Update the menu item details

    cur.execute(query2, [menu_item_name, description, price, category_id, menu_id, image, menu_item_id])
    
    # Delete old ingredients list and
    # replace with a new list

    query_delete_ingredients = """
        delete
        from ingredients
        where menu_item_id = %s
        ;
    """
    
    cur.execute(query_delete_ingredients, [menu_item_id])

    query_insert_ingredients = """
        insert into ingredients (menu_item_id, name, allergy_id) values (%s, %s, %s);
    """
    
    for ingredient in ingredients:
        cur.execute(query_insert_ingredients, [menu_item_id, ingredient[0], ingredient[1]])

    # Check that all ingredients were inserted:

    query_ingredients_count = """
        select count(*)
        from ingredients
        where menu_item_id = %s
        group by menu_item_id
        ;
    """
    cur.execute(query_ingredients_count, [menu_item_id])
    ingredients_count = cur.fetchall()

    if len(ingredients) > 0 and ingredients_count[0][0] != len(ingredients):
        return invalid_ingredients_update

    # Return successfully updated message

    return menu_item
        
def manager_update_category_ordering(cur, category_id, prev_ordering_id, new_ordering_id):
    """
    Updates the ordering_id of the category in the database by swapping it with the target category's ordering_id
    
    Inputs:
        - cur (cursor): The active cursor
        - category_id (string(int)): category_id to swap
        - prev_ordering_id (string(int)): the current category's ordering_id
        - new_ordering_id (string(int)): the target category's ordering_id

    Returns:
        - invalid_category_id (dictionary): the given category_id is invalid

        OR

        - invalid_pre_ordering (dictionary): the prev_ordering_id is invalid

        OR

        - database_error_no_ordering (dictionary): no cateogry_id found with the new_ordering_id

        OR

        - cant_swap_best_selling (dictionary): cannot manually swap category with "Best Selling"

        OR 

        - failed_swap (dictionary): The swapping of ordering_ids failed

        OR

        - success (dictionary): dictionary with success message

    """
    
    invalid_category_id = { 'error': 'invalid category_id'}
    invalid_pre_ordering = { 'error': 'prev_ordering_id is invalid'}
    database_error_no_ordering = { 'error': 'no cateogry_id found with the new_ordering_id' }
    cant_swap_best_selling = { 'error': 'cannot swap with "Best Selling"'}
    failed_swap = { 'error': 'Did not swap properly'}
    success = { 'success': 'success in updating ordering of category' }
    
    # Can't swap the order with the Best Selling category

    query_get_category_name = """
        select name from categories where ordering_id = %s;
    """
    cur.execute(query_get_category_name, [new_ordering_id])
    category_name_list = cur.fetchall()

    if len(category_name_list) == 0:
        return database_error_no_ordering

    if category_name_list[0][0] == 'Best Selling':
        return cant_swap_best_selling

    query_check_ordering_id = """
        select ordering_id from categories where id = %s;
    """

    cur.execute(query_check_ordering_id, [category_id])
    prev_ordering_id_list = cur.fetchall()

    if len(prev_ordering_id_list) == 0:
        return invalid_category_id

    if prev_ordering_id_list[0][0] != prev_ordering_id:
        return invalid_pre_ordering
    
    query_update_ordering = """
        update categories
        set ordering_id = %s           
        where id = %s;
    """
    query_get_category_id = """
        select id from categories where ordering_id = %s;
    """
    
    # Fetch the target category's id

    cur.execute(query_get_category_id, [new_ordering_id])
    
    category_id_list = cur.fetchall()
    
    if len(category_id_list) == 0:
        return database_error_no_ordering

    prev_category_id = category_id_list[0][0]
    
    # Swapping ordering ids
    cur.execute(query_update_ordering, [prev_ordering_id, prev_category_id])
    cur.execute(query_update_ordering, [new_ordering_id, category_id])
    
    # Check if the swap was successful

    cur.execute(query_check_ordering_id, [category_id])
    ordering_id_list = cur.fetchall()

    if ordering_id_list[0][0] != new_ordering_id:
        return failed_swap
    
    cur.execute(query_check_ordering_id, [prev_category_id])
    ordering_id_list = cur.fetchall()
    
    if ordering_id_list[0][0] != prev_ordering_id:
        return failed_swap
    
    return success

def manager_update_menu_item_ordering(cur, menu_item_id, prev_ordering_id, new_ordering_id):
    """
    Updates the ordering_id of the menu item in the database by swapping its ordering id with the target menu item
    
    Inputs:
        - cur (cursor): The active cursor
        - menu_item_id (string(int)): menu_item_id to swap
        - prev_ordering_id (string(int)): the current menu item's ordering_id
        - new_ordering_id (string(int)): the target menu item's ordering_id

    Returns:
        - invalid_menu_item_id (dictionary): the given menu_item_id is invalid

        OR

        - invalid_pre_ordering (dictionary): the prev_ordering_id is invalid

        OR

        - no_menu_item_with_new_ordering_id (dictionary): no menu_item_id found with the new_ordering_id

        OR

        - swap_fail (dictionary): The swapping of ordering_ids failed

        OR

        - success (dictionary): dictionary with success message

    """
    
    invalid_menu_item_id = { 'error': 'invalid menu_item_id'}
    invalid_pre_ordering = { 'error': 'prev_ordering_id is invalid'}
    no_menu_item_with_new_ordering_id = { 'error': 'no menu item with new_ordering_id' }
    swap_fail = { 'error': 'Failed to swap'}
    success = { 'success': 'success in updating ordering of menu items' }
    
    # Check that the previous ordering id is valid

    query_get_ordering_id = """
        select ordering_id from menu_items where id = %s;
    """

    cur.execute(query_get_ordering_id, [menu_item_id])
    prev_ordering_id_list = cur.fetchall()

    if len(prev_ordering_id_list) == 0:
        return invalid_menu_item_id

    if prev_ordering_id_list[0][0] != prev_ordering_id:
        return invalid_pre_ordering

    query_update_ordering_id = """
        UPDATE menu_items
        SET ordering_id = %s           
        WHERE id = %s
        ;
    """

    query_get_menu_item_id = """
        select id from menu_items where ordering_id = %s;
    """
    
    # Fetch target menu item's id

    cur.execute(query_get_menu_item_id, [new_ordering_id])
    
    menu_item_id_list = cur.fetchall()
    
    if len(menu_item_id_list) == 0:
        return no_menu_item_with_new_ordering_id

    prev_menu_item_id = menu_item_id_list[0][0]
    
    # Swap the ordering ids

    cur.execute(query_update_ordering_id, [prev_ordering_id, prev_menu_item_id])
    cur.execute(query_update_ordering_id, [new_ordering_id, menu_item_id])
    
    # Check that the swap was successful

    cur.execute(query_get_ordering_id, [menu_item_id])
    ordering_id_list = cur.fetchall()

    if ordering_id_list[0][0] != new_ordering_id:
        return swap_fail
    
    cur.execute(query_get_ordering_id, [prev_menu_item_id])
    ordering_id_list = cur.fetchall()
    
    if ordering_id_list[0][0] != prev_ordering_id:
        return swap_fail
    
    return success
