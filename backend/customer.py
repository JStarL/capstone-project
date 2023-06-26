
def customer_view_menu(cur, menu_id):
    invalid_menu_id = { 'error': 'invalid menu id' } # error message
    menu = []

    query_categories = """
    select id, name from categories where menu_id = %s order by id;
    """
    
    query_menu_items = """
    select id, title, description, image, price from menu_items where category_id = %s order by title;
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
                menu_items_list.append(tmp)
            menu.append({'Best Selling': menu_items_list})
        else:
            menu.append({categ[1]: []})
        
    return menu

def customer_view_category(cur, category_id):
    invalid_category_id = { 'error': 'invalid category_id' }
    menu_items = []

    query1 = """
    select id, title, description, image, price from menu_items where category_id = %s order by title;
    """

    cur.execute(query1, [category_id])
    list1 = cur.fetchall()

    if len(list1) == 0:
        return invalid_category_id
    
    for tup in list1:
        tmp = {}
        tmp.update({'food_id': tup[0]})
        tmp.update({'food_name': tup[1]})
        tmp.update({'food_description': tup[2]})
        tmp.update({'food_image': tup[3]})
        tmp.update({'food_price': tup[4]})
        menu_items.append(tmp)

    return menu_items


def customer_view_menu_item(cur, menu_item_id):
    invalid_id = { 'error': 'invalid menu_item_id' } # error message
    food = { 'success': 'Show food' } # supposed to show the food lol
    
    query1 = """
    select title, description, image, price, ingredients, category_id from menu_items where id = %s;
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
        food.update({'food_ingredients': tup[4]})
        food.update({'category_id': tup[5]})
        return food
