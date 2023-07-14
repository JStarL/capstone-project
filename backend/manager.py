

def manager_view_menu(cur, menu_id, excluded_cat_list, top_k):
    invalid_menu_id = { 'error': 'invalid menu id' } # error message
    menu = []

    query_categories = """
    select id, name, ordering_id from categories where menu_id = %s order by ordering_id;
    """
    
    query_best_selling_items = """
        select m.id, m.title, m.description, m.image, m.price, b.ordering_id
        from menu_items m join best_selling_items b on (m.menu_id = b.menu_id and m.id = b.menu_item_id)
        where m.menu_id = %s
        and m.category_id not in %s
        order by b.ordering_id, m.title
        limit %s
        ;
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

            if str(type(excluded_cat_list)) != "<class 'list'>":
                return { 'error': 'excluded category ids is not a list'} 
            excluded_cat_tuple = tuple(excluded_cat_list)

            cur.execute(query_best_selling_items, [menu_id, excluded_cat_tuple, top_k])
            menu_items_list = cur.fetchall()
            return_menu_list = []
            for menu_item in menu_items_list:
                
                cur.execute(query_ingredients, [menu_item[0]])
                ingredients_list = []
                for ingredient in cur.fetchall():
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
    invalid_category_id = { 'error': 'invalid category_id' }
    menu_items = []

    query0 = """
    select id, name, menu_id from categories where id = %s;
    """

    cur.execute(query0, [category_id])
    list1 = cur.fetchall()

    if len(list1) == 0:
        return invalid_category_id

    if list1[0][1] == 'Best Selling':
        query_best_selling_items = """
        select m.id, m.title, m.description, m.image, m.price, b.ordering_id
        from menu_items m join best_selling_items b on (m.menu_id = b.menu_id and m.id = b.menu_item_id)
        where m.menu_id = %s
        and m.category_id not in %s
        order by b.ordering_id, m.title
        limit %s
        ;
        """
        if str(type(excluded_cat_list)) != "<class 'list'>":
            return { 'error': 'excluded category ids is not a list'} 
        excluded_cat_tuple = tuple(excluded_cat_list)
        cur.execute(query_best_selling_items, [list1[0][2], excluded_cat_tuple, top_k])
    else:
        query1 = """
        select id, title, description, image, price, ordering_id from menu_items where category_id = %s order by ordering_id limit %s;
        """
        cur.execute(query1, [category_id, top_k])

    list1 = cur.fetchall()
    
    for tup in list1:
        
        query2 = """
        select name, allergy_id from ingredients where menu_item_id = %s;
        """
        cur.execute(query2, [tup[0]])

        ingredients_list = []
        for ingredient in cur.fetchall():
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
    error = { 'error': 'invalid food_id' } # error message
    food = { 'success': 'Show food' } # supposed to show the food lol
    
    query1 = """
    select title, description, image, price, category_id, ordering_id from menu_items where id = %s;
    """ 
    
    cur.execute(query1, [food_id]) #empty for now
    
    list1 = cur.fetchall()
    
    if len(list1) == 0: #No menu or something went wrong with the id
        #test
        return error
    else: #shows the food item
        tup = list1[0]

        query2 = """
        select name, allergy_id from ingredients where menu_item_id = %s;
        """
        cur.execute(query2, [food_id])

        ingredients_list = []
        for ingredient in cur.fetchall():
            ingredients_list.append([ingredient[0], ingredient[1]])

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
    error = { 'error': 'adding category failed' } # error message
    category = { 'success': 'success in adding category' } # supposed to success lol
    cant_use_best_selling = { 'error': 'Not allowed to use name "Best Selling"' }
    cant_set_empty_string = { 'error': 'not allowed to use the name empty string ("")' }

    if category_name == '':
        return cant_set_empty_string

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
    category = { 'success': 'success in updating category' } # supposed to show success lol
    cant_update_best_selling = { 'error': 'not allowed to manually update the "Best Selling" category' }
    cant_set_empty_string = { 'error': 'not allowed to update the name to empty string' }

    if category_name == '':
        return cant_set_empty_string

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

    if len(list1) == 0:
        return invalid_category
    if list1[0][1] == 'Best Selling':
        return cant_update_best_selling

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
    invalid_ingredients_update = { 'error': 'Failed to add all ingredients' }
    invalid_best_selling = { 'error': 'cannot add menu items to the "Best Selling" category'}
    cant_set_empty_string = { 'error': 'not allowed to set the name to empty string' }
    menu_item = {}

    if menu_item_name == '':
        return cant_set_empty_string


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
        INSERT INTO menu_items (title, description, price, category_id, menu_id, image)
        VALUES (%s, %s, %s, %s, %s, %s);
    """ 
    query2 = """
        SELECT id
        FROM menu_items
        WHERE title = %s
        AND menu_id = %s;
    """ 
    
    cur.execute(query1, [menu_item_name, description, price, category_id, menu_id, image])
    cur.execute(query2, [menu_item_name, menu_id])
    
    list1 = cur.fetchall()

    if len(list1) == 0:
        return error
    else:
        menu_item_id = list1[0][0]

        query3 = """
            insert into ingredients (menu_item_id, name, allergy_id) values (%s, %s, %s);
        """
        
        for ingredient in ingredients:
            cur.execute(query3, [menu_item_id, ingredient[0], ingredient[1]])

        # Check that all ingredients were inserted:

        query4 = """
            select count(*)
            from ingredients
            where menu_item_id = %s
            group by menu_item_id
            ;
        """

        cur.execute(query4, [menu_item_id])

        query4_res = cur.fetchall()

        if query4_res[0][0] != len(ingredients):
            return invalid_ingredients_update

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
    invalid_ingredients_update = { 'error': 'Failed to add all ingredients' }
    invalid_category_id = { 'error': 'invalid category_id'}
    invalid_best_selling = { 'error': 'cannot update menu items in the "Best Selling" category'}
    cant_set_empty_string = { 'error': 'not allowed to update the name to empty string' }
    menu_item = {}

    if menu_item_name == '':
        return cant_set_empty_string


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
            category_id = %s,
            menu_id = %s,
            image = %s            
        WHERE id = %s
        ;
    """
    query3 = """
        SELECT id, title, description, image, price, category_id, menu_id
        FROM menu_items
        WHERE id = %s;
    """ 
    
    cur.execute(query1, [menu_item_id])
    
    list1 = cur.fetchall()

    if len(list1) == 0: # id doesn't exist
        return invalid_menu_item
    else: 
        cur.execute(query2, [menu_item_name, description, price, category_id, menu_id, image, menu_item_id]) #this just updates
        
        query4 = """
            delete
            from ingredients
            where menu_item_id = %s
            ;
        """
        
        cur.execute(query4, [menu_item_id])

        query5 = """
            insert into ingredients (menu_item_id, name, allergy_id) values (%s, %s, %s);
        """
        
        for ingredient in ingredients:
            cur.execute(query5, [menu_item_id, ingredient[0], ingredient[1]])

        # Check that all ingredients were inserted:

        query6 = """
            select count(*)
            from ingredients
            where menu_item_id = %s
            group by menu_item_id
            ;
        """
        cur.execute(query6, [menu_item_id])
        query6_res = cur.fetchall()

        if query6_res[0][0] != len(ingredients):
            return invalid_ingredients_update

        return menu_item
        # cur.execute(query3, [menu_item_id]) #this grabs the id and the rest of the values to check
        # list1 = cur.fetchall()
        # if menu_item_name == list1[0][1] and description == list1[0][2] and image == list1[0][3] and price == list1[0][4] and category_id == list1[0][5] and menu_id == list1[0][6]:
        #     menu_item.update({'menu_item_id' : list1[0][0]})
        #     return menu_item
        # else:
        #     return error
        
def manager_update_category_ordering(cur, category_id, prev_ordering_id, new_ordering_id):
    invalid_category_id = { 'error': 'invalid category_id'}
    invalid_pre_ordering = { 'error': 'prev_ordering_id is invalid'}
    database_error_no_ordering = { 'error': 'no cateogry_id found with the new_ordering_id' }
    cant_swap_best_selling = { 'error': 'cannot swap with "Best Selling"'}
    success = { 'success': 'success in updating ordering of category' }
    failed_swap = { 'error': 'Did not swap properly'}
    
    # Can't swap the order with the Best Selling category

    query0_0 = """
        select name from categories where ordering_id = %s;
    """
    cur.execute(query0_0, [new_ordering_id])
    list1 = cur.fetchall()

    if len(list1) == 0:
        return database_error_no_ordering

    if list1[0][0] == 'Best Selling':
        return cant_swap_best_selling

    query0_1 = """
        select ordering_id from categories where id = %s;
    """

    cur.execute(query0_1, [category_id])
    list1 = cur.fetchall()

    if len(list1) == 0:
        return invalid_category_id

    if list1[0][0] != prev_ordering_id:
        return invalid_pre_ordering
    query1 = """
        UPDATE categories
        SET ordering_id = %s           
        WHERE id = %s
        ;
    """
    query2 = """
        select id from categories where ordering_id = %s;
    """
    
    cur.execute(query2, [new_ordering_id])
    
    list1 = cur.fetchall()
    
    if len(list1) == 0:
        return database_error_no_ordering

    prev_category_id = list1[0][0]
    # Swapping ordering ids
    cur.execute(query1, [prev_ordering_id, prev_category_id])
    cur.execute(query1, [new_ordering_id, category_id])
    
    # checking if it got swaped 
    cur.execute(query0_1, [category_id])
    list1 = cur.fetchall()

    if list1[0][0] != new_ordering_id:
        return failed_swap
    
    cur.execute(query0_1, [prev_category_id])
    list1 = cur.fetchall()
    
    if list1[0][0] != prev_ordering_id:
        return failed_swap
    
    return success

def manager_update_menu_item_ordering(cur, menu_item_id, prev_ordering_id, new_ordering_id):
    invalid_menu_id = { 'error': 'invalid menu_item_id'}
    invalid_pre_ordering = { 'error': 'prev_ordering_id is invalid'}
    no_menu_item_with_new_ordering_id = { 'error': 'no menu item with new_ordering_id' }
    success = { 'success': 'success in updating ordering of menu items' }
    swap_fail = { 'error': 'Did not swap properly'}
    
    query0 = """
        select ordering_id from menu_items where id = %s;
    """

    cur.execute(query0, [menu_item_id])
    list1 = cur.fetchall()

    if len(list1) == 0:
        return invalid_menu_id

    if list1[0][0] != prev_ordering_id:
        return invalid_pre_ordering

    query1 = """
        UPDATE menu_items
        SET ordering_id = %s           
        WHERE id = %s
        ;
    """

    query2 = """
        select id from menu_items where ordering_id = %s;
    """
    
    cur.execute(query2, [new_ordering_id])
    
    list1 = cur.fetchall()
    
    if len(list1) == 0:
        return no_menu_item_with_new_ordering_id

    menu_item_id2 = list1[0][0]
    # Swap ordering ids
    cur.execute(query1, [prev_ordering_id, menu_item_id2])
    cur.execute(query1, [new_ordering_id, menu_item_id])
    
    # checking if it got swaped 
    cur.execute(query0, [menu_item_id])
    list1 = cur.fetchall()

    if list1[0][0] != new_ordering_id:
        return swap_fail
    
    cur.execute(query0, [menu_item_id2])
    list1 = cur.fetchall()
    
    if list1[0][0] != prev_ordering_id:
        return swap_fail
    
    return success
