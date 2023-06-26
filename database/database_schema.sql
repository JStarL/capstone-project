create domain StaffType as char(1) check (value in ('M', 'K', 'W'));
-- 'M' = Manager
-- 'K' = Kitchen Staff
-- 'W' = Wait Staff

create table menus (
    id          serial,
    restaurant_name     text not null,
    restaurant_loc      text not null,
    
    primary key (id)
);

create table staff (
    id          serial,
    email       text not null unique check (email ~ '.*@.*'),
    name        text not null, -- Add an alphanumeric check?
    password    text not null,
    menu_id     integer not null,
    staff_type  StaffType not null,

    primary key (id),
    foreign key (menu_id) references menus(id)

);

create or replace view staff_with_menu(staff_id, staff_email, staff_name, staff_type, menu_id, restaurant_name, restaurant_loc) as
select s.id, s.email, s.name, s.staff_type, m.id, m.restaurant_name, m.restaurant_loc
from staff s join menus m on (s.menu_id = m.id)
;


create table categories (
    id          serial,
    name        text not null,
    menu_id     integer not null, 
    
    primary key (id),
    foreign key (menu_id) references menus(id)

);

create table menu_items (
    id                  serial,
    title               text not null,
    description         text, -- optional
    image               text, -- also optional
    price               float not null,
    ingredients         text array,

    category_id         integer not null,
    menu_id             integer not null,

    primary key (id),
    foreign key (category_id) references categories(id),
    foreign key (menu_id) references menus(id)
);

create or replace view menu_items_and_categories(food_id, food_title, food_description, food_image, food_price, food_ingredients, category_id, category_name, menu_id) as
select f.id, f.title, f.description, f.image, f.price, f.ingredients, c.id, c.name, c.menu_id
from food_items f join categories c on (f.category_id = c.id)
;
