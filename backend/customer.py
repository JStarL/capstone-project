
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
