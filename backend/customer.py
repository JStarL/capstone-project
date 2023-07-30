
def customer_view_menu(cur, menu_id, allergies_list, excluded_cat_list, top_k):
    invalid_menu_id = { 'error': 'invalid menu id' } # error message
    menu = []
    if len(allergies_list) > 0:
        if 0 in allergies_list:
            allergies_list.remove(0)
        if "0" in allergies_list:
            allergies_list.remove("0")

    query_categories = """
    select id, name, ordering_id from categories where menu_id = %s order by ordering_id;
    """
    
    query_menu_items = None
    if len(allergies_list) == 0:
        query_menu_items = """
            select m.id, m.title, m.description, m.image, m.price, b.ordering_id
            from menu_items m join best_selling_items b on (m.menu_id = b.menu_id and m.id = b.menu_item_id)
            where m.menu_id = %s
            and m.category_id not in %s
            order by b.ordering_id, m.title
            limit %s
            ;
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

            excluded_cat_tuple = tuple(excluded_cat_list)
            if len(allergies_list) == 0:
                cur.execute(query_menu_items, [menu_id, excluded_cat_tuple, top_k])
            else:
                cur.execute(query_menu_items, [menu_id, excluded_cat_tuple, allergies_tuple, top_k])
            menu_items_list = cur.fetchall()
            return_items_list = []
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
    invalid_category_id = { 'error': 'invalid category_id' }
    menu_items = []

    if len(allergies_list) > 0:
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

    best_selling = False
    if categories_list[0][1] == 'Best Selling':
        best_selling = True

    if len(allergies_list) == 0:
        if (best_selling):
            menu_items_query = """
                select m.id, m.title, m.description, m.image, m.price, b.ordering_id
                from menu_items m join best_selling_items b on (m.menu_id = b.menu_id and m.id = b.menu_item_id)
                where m.menu_id = %s
                and m.category_id not in %s
                order by b.ordering_id, m.title
                limit %s
                ;
            """
            excluded_cat_tuple = tuple(excluded_cat_list)
            cur.execute(menu_items_query, [categories_list[0][2], excluded_cat_tuple, top_k])
        else:
            menu_items_query = """
                select id, title, description, image, price, ordering_id
                from menu_items
                where category_id = %s
                order by ordering_id
                limit %s
                ;
            """
            cur.execute(menu_items_query, [category_id, top_k])
    else:
        allergies_tuple = tuple(allergies_list)
        if (best_selling):
            menu_items_query = """
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
                limit %s
                ;
            """
            excluded_cat_tuple = tuple(excluded_cat_list)
            cur.execute(menu_items_query, [categories_list[0][2], excluded_cat_tuple, allergies_tuple, top_k])
        else:
            menu_items_query = """
                select id, title, description, image, price, ordering_id
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

    menu_items_list = cur.fetchall()

    for tup in menu_items_list:
        
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


def customer_view_menu_item(cur, menu_item_id):
    invalid_id = { 'error': 'invalid menu_item_id' } # error message
    food = {}
    
    menu_items_query = """
    select title, description, image, price, category_id, ordering_id from menu_items where id = %s;
    """ 
    
    cur.execute(menu_items_query, [menu_item_id])
    
    menu_items_list = cur.fetchall()
    
    if len(menu_items_list) == 0:
        # No menu or something went wrong with the id
        return invalid_id
    else: 
        # shows the food item
        tup = menu_items_list[0]

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
    regex = '.*' + query + '.*'

    restaurant_query = """
    select id, restaurant_name, restaurant_loc
    from menus
    where restaurant_name ~* %s
    or restaurant_loc ~* %s
    ;
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
