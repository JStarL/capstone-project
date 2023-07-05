
def customer_view_menu(cur, menu_id, allergies_list):
    invalid_menu_id = { 'error': 'invalid menu id' } # error message
    menu = []

    query_categories = """
    select id, name, ordering_id from categories where menu_id = %s order by ordering_id;
    """
    
    allergies_tuple = tuple(allergies_list)

    query_menu_items = """
    select id, title, description, image, price, ordering_id
    from menu_items m
    where category_id = %s 
    and not exists (
        select *
        from ingredients i
        where i.menu_item_id = m.id
            and i.allergy_id in %s
    )
    order by ordering_id;
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

            cur.execute(query_menu_items, [categ_id, allergies_tuple])
            menu_items_list = []
            for menu_item in cur.fetchall():
                tmp = {}
                tmp.update({'food_id': menu_item[0]})
                tmp.update({'food_name': menu_item[1]})
                tmp.update({'food_description': menu_item[2]})
                tmp.update({'food_image': menu_item[3]})
                tmp.update({'food_price': menu_item[4]})
                tmp.update({'food_ordering_id': menu_item[5]})
                menu_items_list.append(tmp)
            menu.append({str(categ_id): ['Best Selling', menu_items_list, categ[2]]})
        else:
            menu.append({str(categ_id): [categ[1], [], categ[2]]})
        
    return menu

def customer_view_category(cur, category_id, allergies_list):
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
    select id, title, description, image, price, ordering_id
    from menu_items m
    where category_id = %s
    and not exists (
        select *
        from ingredients i
        where i.menu_item_id = m.id
            and i.allergy_id in %s
    )
    order by ordering_id;
    """

    allergies_tuple = tuple(allergies_list)
    cur.execute(query1, [category_id, allergies_tuple])
    list1 = cur.fetchall()

    for tup in list1:
        tmp = {}
        tmp.update({'food_id': tup[0]})
        tmp.update({'food_name': tup[1]})
        tmp.update({'food_description': tup[2]})
        tmp.update({'food_image': tup[3]})
        tmp.update({'food_price': tup[4]})
        tmp.update({'food_ordering_id': tup[5]})
        menu_items.append(tmp)

    return menu_items


def customer_view_menu_item(cur, menu_item_id):
    invalid_id = { 'error': 'invalid menu_item_id' } # error message
    food = { 'success': 'Show food' } # supposed to show the food lol
    
    query1 = """
    select title, description, image, price, category_id, ordering_id from menu_items where id = %s;
    """ 
    
    cur.execute(query1, [menu_item_id])
    
    list1 = cur.fetchall()
    
    if len(list1) == 0: #No menu or something went wrong with the id
        #test
        return invalid_id
    else: #shows the food item
        tup = list1[0]
        food.update({'food_id': menu_item_id})
        food.update({'food_name': tup[0]})
        food.update({'food_description': tup[1]})
        food.update({'food_image': tup[2]})
        food.update({'food_price': tup[3]})
        food.update({'category_id': tup[4]})
        food.update({'food_ordering_id': tup[5]})
        return food
    
def customer_menu_search(cur, query):
    invalid_menu = { 'error': 'No menus' } # error message
    # menu = { 'success': 'Show menu' } # supposed to show the food lol
    
    regex = '.*' + query + '.*'

    query1 = """
    SELECT id, restaurant_name, restaurant_loc
    FROM menus
    where restaurant_name ~* %s
    or restaurant_loc ~* %s
    ;
    """ 
    
    cur.execute(query1, [regex, regex])
    
    list1 = cur.fetchall()
    
    
    list2 = []
    for tup in list1:
        dict_res = {}
        dict_res.update({'menu_id': tup[0]})
        dict_res.update({'restaurant_name': tup[1]})
        dict_res.update({'restaurant_address': tup[2]})
        list2.append(dict_res)
    # menu.update({'menu_list': list2})
    return list2
