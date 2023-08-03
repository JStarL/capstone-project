# The following assumptions are made throughout the project

- All menu items of a given customer are served by the waiter when *all* menu items are prepared by the kitchen staff, so the entire order is served as a whole, at once

- The 'Best Selling' category is completely automated and not editable by the manager. This means that:
    - Items cannot be added or removed manually by the manager from this category
    - The ordering of menu items within this category cannot be manually changed
    - The 'Best Selling' category is always the first category in the categories panel, its order cannot be changed
    - The 'Best Selling' category dynamically updates based on internally maintained statistics
    - Best Selling Category for a newly created menu is empty, until the manager creates some menu items and
      someone places an order for menu items for the first time

- We consider general use cases where the user does not try to intentionally break the system, however we stop unwanted
    behaviours as much as possible regardless

- Persona names are unique

- Assume category names input by a manager are unique, for a given menu (only when adding a new category, afterwards
    category_id is used)

- Assume menu item names input by a manager are unique, for a given menu (for adding a new menu_item, afterwards
    menu_item_id is used)
