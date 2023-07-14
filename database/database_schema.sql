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
    ordering_id serial not null,
    
    primary key (id),
    foreign key (menu_id) references menus(id)

);

create table menu_items (
    id                  serial,
    title               text not null,
    description         text, -- optional
    image               text, -- also optional
    price               float not null,
    ordering_id         serial not null,
    category_id         integer not null,
    menu_id             integer not null,
    points              integer default 0,

    primary key (id),
    foreign key (category_id) references categories(id) on delete cascade,
    foreign key (menu_id) references menus(id)
);

create or replace function update_best_selling_function()
returns trigger
as $$
declare
    _menu_item      record;
    _ordering_id    integer := 1;
begin

    if (new.points <> old.points) then
    
        delete from best_selling_items
        where menu_id=old.menu_id;
        
        for _menu_item in
            select id, menu_id
            from menu_items m
            where m.menu_id = old.menu_id
            order by points desc, title asc
        loop
            insert into best_selling_items(menu_id, menu_item_id, ordering_id)
            values (_menu_item.menu_id, _menu_item.id, _ordering_id);
            _ordering_id := _ordering_id + 1;
        end loop;

    end if;
    return new;

end;
$$ language plpgsql;

create trigger update_best_selling_trigger
after update on menu_items
for each row
execute procedure update_best_selling_function();

create or replace view menu_items_and_categories(menu_item_id, title, description, image, price, category_id, category_name, menu_id) as
select m.id, m.title, m.description, m.image, m.price, c.id, c.name, c.menu_id
from menu_items m join categories c on (m.category_id = c.id)
;

create table allergies (
    id                  serial,
    name                text not null unique,
    description         text,

    primary key (id)
);

create table ingredients (
    menu_item_id        integer not null,
    name                text not null,
    allergy_id          integer null,

    primary key (menu_item_id, name),
    foreign key (menu_item_id) references menu_items(id),
    foreign key (allergy_id) references allergies(id)
);

create table best_selling_items (
    menu_id             integer not null,
    menu_item_id        integer not null,
    ordering_id         serial not null,

    primary key (menu_id, menu_item_id),
    foreign key (menu_id) references menus(id),
    foreign key (menu_item_id) references menu_items(id)

);
