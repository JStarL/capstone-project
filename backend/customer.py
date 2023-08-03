
def customer_view_menu(cur, menu_id, allergies_list, excluded_cat_list, top_k):
    """
    Returns a list of categories within the desired menu. For the best selling category,
    it returns all the menu items within it and all the information about each menu item.

    Inputs:
        - cur (cursor): The active cursor
        - menu_id (string(int)): The id of the menu the customer wishes to view
        - allergies_list (list(int)): List of allergy ids
        - excluded_cat_list (list(int)): List of category ids wished to be excluded
        - top_k (int): The top k number of menu items wished to be shown

    Returns:
        - menu (list(dictionary)): List of dictionaries where each key is the category id
        and the value is the list of the category name, menu items (for best selling category only)
        and ordering id.

        OR

        - invalid_menu_id (dictionary): Error message if the menu id is invalid

    """
    
    invalid_menu_id = { 'error': 'invalid menu id' }

    menu = []

    # Removing allergy 'None' from being filtered from the allergies list
    if len(allergies_list) > 0:
        if 0 in allergies_list:
            allergies_list.remove(0)
        if "0" in allergies_list:
            allergies_list.remove("0")

    # If a request comes in to exclude every category (except 'Best Selling')
    # then default to showing every category unfiltered (except by allergies)

    query_num_categories = """
        select count(*)
        from categories
        where menu_id = %s;
    """

    cur.execute(query_num_categories, [menu_id])
    num_categories = cur.fetchone()

    # the count from the query includes the Best Selling Category,
    # whereas the excluded_cat_list will always exclude Best Selling,
    # even at max capacity
    if int(num_categories[0]) == len(excluded_cat_list) + 1:
        excluded_cat_list = [-1]

    query_categories = """
        select id, name, ordering_id from categories where menu_id = %s order by ordering_id;
    """
    
    # Set the menu_items query from the Best Selling category with or without the allergies list accordingly

    query_menu_items = None
    if len(allergies_list) == 0:
        query_menu_items = """
            select m.id, m.title, m.description, m.image, m.price, b.ordering_id
            from menu_items m join best_selling_items b on (m.menu_id = b.menu_id and m.id = b.menu_item_id)
            where m.menu_id = %s
            and m.category_id not in %s
            order by b.ordering_id, m.title
            limit %s;
        """
    else:
        allergies_tuple = tuple(allergies_list)

        query_menu_items = """
            select m.id, m.title, m.description, m.image, m.price, b.ordering_id
            from menu_items m join best_selling_items b on (m.menu_id = b.menu_id and m.id = b.menu_item_id)
            where m.menu_id = %s
            and m.category_id not in %s
            and not exists (
                select *
                from ingredients i
                where i.menu_item_id = m.id
                    and i.allergy_id in %s
            )
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
            excluded_cat_tuple = tuple(excluded_cat_list)
            if len(allergies_list) == 0:
                cur.execute(query_menu_items, [menu_id, excluded_cat_tuple, top_k])
            else:
                cur.execute(query_menu_items, [menu_id, excluded_cat_tuple, allergies_tuple, top_k])
            menu_items_list = cur.fetchall()
            return_items_list = []
            
            # Process each menu item to get its list of ingredients
            # And to package its details in a return dictionary

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
                return_items_list.append(tmp)
            menu.append({str(categ_id): ['Best Selling', return_items_list, categ[2]]})
        else:
            menu.append({str(categ_id): [categ[1], [], categ[2]]})

    return menu

def customer_view_category(cur, category_id, allergies_list, excluded_cat_list, top_k):
    """
    Returns a list of menu items within the desired category.

    Inputs:
        - cur (cursor): The active cursor
        - category_id (int): The id of the category the customer wishes to view
        - allergies_list (list(int)): List of allergy ids
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

    # Removing value 0 from the allergies list to prevent
    # the filtering of menu items with no relevant allergens
    if len(allergies_list) > 0:
        # Accounting for both string and int type
        if 0 in allergies_list:
            allergies_list.remove(0)
        if "0" in allergies_list:
            allergies_list.remove("0")

    query_categories = """
        select id, name, menu_id from categories where id = %s;
    """

    cur.execute(query_categories, [category_id])
    categories_list = cur.fetchall()

    if len(categories_list) == 0:
        return invalid_category_id

    menu_id = categories_list[0][2]

    best_selling = False
    if categories_list[0][1] == 'Best Selling':
        best_selling = True

    # Similar to view_menu, if a customer tries to exclude
    # all categories (except Best Selling), show instead
    # menu items from all categories (filtered by allergies list)

    query_num_categories = """
        select count(*)
        from categories
        where menu_id = %s
        ;
    """

    cur.execute(query_num_categories, [menu_id])
    num_categories = cur.fetchone()

    # Reset the excluded_cat_list if all categories
    # including the Best Selling category are excluded
    if num_categories[0] == len(excluded_cat_list) + 1:
        excluded_cat_list = [-1]

    # Execute different queries for the 4 combinations of
    # having an allergies list or not, as well as being the
    # Best Selling category or not

    if len(allergies_list) == 0:
        if (best_selling):
            menu_items_query = """
                select m.id, m.title, m.description, m.image, m.price, b.ordering_id, m.category_id
                from menu_items m join best_selling_items b on (m.menu_id = b.menu_id and m.id = b.menu_item_id)
                where m.menu_id = %s
                and m.category_id not in %s
                order by b.ordering_id, m.title
                limit %s;
            """
            excluded_cat_tuple = tuple(excluded_cat_list)
            cur.execute(menu_items_query, [menu_id, excluded_cat_tuple, top_k])
        else:
            menu_items_query = """
                select id, title, description, image, price, ordering_id, category_id
                from menu_items
                where category_id = %s
                order by ordering_id
                limit %s;
            """
            cur.execute(menu_items_query, [category_id, top_k])
    else:
        allergies_tuple = tuple(allergies_list)
        if (best_selling):
            menu_items_query = """
                select m.id, m.title, m.description, m.image, m.price, b.ordering_id, m.category_id
                from menu_items m join best_selling_items b on (m.menu_id = b.menu_id and m.id = b.menu_item_id)
                where m.menu_id = %s
                and m.category_id not in %s
                and not exists (
                    select *
                    from ingredients i
                    where i.menu_item_id = m.id
                        and i.allergy_id in %s
                )
                order by b.ordering_id, m.title
                limit %s
                ;
            """
            excluded_cat_tuple = tuple(excluded_cat_list)
            cur.execute(menu_items_query, [menu_id, excluded_cat_tuple, allergies_tuple, top_k])
        else:
            menu_items_query = """
                select id, title, description, image, price, ordering_id, category_id
                from menu_items m
                where category_id = %s
                and not exists (
                    select *
                    from ingredients i
                    where i.menu_item_id = m.id
                        and i.allergy_id in %s
                )
                order by ordering_id
                limit %s
                ;
            """
            cur.execute(menu_items_query, [category_id, allergies_tuple, top_k])

    # Retrieve the list of menu items from executing one of the above queries
    menu_items_list = cur.fetchall()

    for tup in menu_items_list:
        
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
        tmp.update({'food_category_id': tup[6]})
        menu_items.append(tmp)

    return menu_items


def customer_view_menu_item(cur, menu_item_id):
    """
    Returns information about the desired menu item with given id

    Inputs:
        - cur (cursor): The active cursor
        - menu_item_id (int): The id of the menu item the customer wishes to view

    Returns:
        - food (dictionary): Dictionary includes all information about a menu item
        such as id, name, description, image, price, ordering_id, ingredients and category_id.

        OR

        - invalid_menu_item_id (dictionary): Error message if the menu item id is invalid
    """

    invalid_menu_item_id = { 'error': 'invalid menu_item_id' }
    food = {}
    
    menu_items_query = """
        select title, description, image, price, category_id, ordering_id from menu_items where id = %s;
    """ 
    
    cur.execute(menu_items_query, [menu_item_id])
    
    menu_items_list = cur.fetchall()
    
    # If no menu item is found with the given id, return an error

    if len(menu_items_list) == 0:
        return invalid_menu_item_id

    tup = menu_items_list[0]

    # Fetch and add in ingredients for the menu item, if there are any
    # and add all menu item information to a dictionary to return

    query_ingredients = """
        select name, allergy_id from ingredients where menu_item_id = %s;
    """
    cur.execute(query_ingredients, [menu_item_id])
    ingredients_list = []
    ingredients_list_input = cur.fetchall()

    if len(ingredients_list_input) > 0:
        for ingredient in ingredients_list_input:
            ingredients_list.append([ingredient[0], ingredient[1]])

    food.update({'food_id': menu_item_id})
    food.update({'food_name': tup[0]})
    food.update({'food_description': tup[1]})
    food.update({'food_image': tup[2]})
    food.update({'food_price': tup[3]})
    food.update({'category_id': tup[4]})
    food.update({'food_ordering_id': tup[5]})
    food.update({'food_ingredients': ingredients_list})
    return food
    
def customer_menu_search(cur, query):
    """
    Returns a list of restaurants and all its respective information such as name, address and menu id.

    Inputs:
        - cur (cursor): The active cursor
        - query (string): Text input by user in search bar

    Returns:
        - return_list (list(dictionary)): List of dictionaries where each dictionary includes all
        information about a restaurant such as menu id, name of restaurant and address of restaurant.

    """

    # We want the regular expression to match within anywhere in the actual string
    regex = '.*' + query + '.*'

    restaurant_query = """
        select id, restaurant_name, restaurant_loc
        from menus
        where restaurant_name ~* %s
        or restaurant_loc ~* %s;
    """ 
    
    cur.execute(restaurant_query, [regex, regex])
    
    restaurant_list = cur.fetchall()
    
    return_list = []
    for tup in restaurant_list:
        dict_res = {}
        dict_res.update({'menu_id': tup[0]})
        dict_res.update({'restaurant_name': tup[1]})
        dict_res.update({'restaurant_address': tup[2]})
        return_list.append(dict_res)
    return return_list

def customer_give_rating(cur, menu_item_id, rating, amount):
    """
    Updates the total ratings and points of a menu item.

    Inputs:
        - cur (cursor): The active cursor
        - menu_item_id (int): The id of the menu item that the customer wishes to rate.
        - rating (int): The new rating of the customer.
        - amount (int): The new amount of points that is to be added to that menu item's previous total amount.

    Returns:
        - update_success (dictionary): Success message to be displayed on frontend if update was successful.
        
        OR

        - update_fail (dictionary): Error message to be displayed on frontend if update was unsuccessful.

        OR

        - invalid_menu_item_id (dictionary): Error message if the menu item id is invalid
    """

    invalid_menu_item_id = { 'error': 'invalid menu_item_id' }
    update_failed = { 'error': 'the update failed' }
    update_success = { 'success': 'update success' }

    # Fetch the current total ratings and total points (number of times ordered)

    query_get_curr_rating = """
        select total_ratings, points
        from menu_items
        where id = %s
        ;
    """

    cur.execute(query_get_curr_rating, [menu_item_id])

    rating_info = cur.fetchone()

    if rating_info is None:
        return invalid_menu_item_id

    # Do not allow a customer to give a non-positive rating
    if rating < 1:
        rating = 1

    # Add rating to total ratings
    new_rating = int(rating_info[0]) + rating

    # Add amount to current total amount
    new_amount = int(rating_info[1]) + amount

    query_update_rating = """
        update menu_items
        set total_ratings = %s, points = %s
        where id = %s
        ;
    """

    cur.execute(query_update_rating, [str(new_rating), str(new_amount), menu_item_id])

    # Check the update was successful

    cur.execute(query_get_curr_rating, [menu_item_id])
    rating_info = cur.fetchone()

    if int(rating_info[0]) == new_rating and int(rating_info[1]) == new_amount:
        return update_success
    else:
        return update_failed
