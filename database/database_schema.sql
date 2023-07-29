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
    total_ratings       integer default 0,
    num_ratings         integer default 0,
    avg_rating          float default 0.0,
    points_percentage   float default 0.0,
    rank                float default 0.0,


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
    _current_total  integer;
    _total_points   integer;
begin
    
    if (new.total_ratings = old.total_ratings or new.points = old.points) then
        return new;
    end if;


    -- Update num_ratings
    select num_ratings into _current_total
    from menu_items
    where id = new.id;

    if (new.total_ratings > old.total_ratings) then
        _current_total = _current_total + 1;
    else
        _current_total = _current_total - 1;
    end if;

    update menu_items
    set num_ratings = _current_total
    where id = new.id;

    -- update avg rating (as a percentage)
    update menu_items
    set avg_rating = new.total_ratings::float * 20 / num_ratings
    where id = new.id;


    -- calculate points_percentage
    select sum(points) into _total_points
    from menu_items
    where menu_id = new.menu_id;

    if (_total_points > 0) then
        update menu_items
        set points_percentage = new.points::float * 100 / _total_points
        where id = new.id;
    end if;

    -- calculate rank
    update menu_items
    set rank = 0.5 * avg_rating + 0.5 * points_percentage
    where id = new.id;


    -- re-order all best selling menu items in the best selling list

    delete from best_selling_items
    where menu_id=new.menu_id;
    
    for _menu_item in
        select id, menu_id
        from menu_items m
        where m.menu_id = new.menu_id
        order by rank desc, title asc
    loop
        insert into best_selling_items(menu_id, menu_item_id, ordering_id)
        values (_menu_item.menu_id, _menu_item.id, _ordering_id);
        _ordering_id := _ordering_id + 1;
    end loop;
    
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
