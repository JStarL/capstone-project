create table menus (
    id          serial,
    restaurant_name     text not null,
    restaurant_loc      text not null,
    
    primary key (id)
);

create table managers (
    id          serial,
    email       text not null unique check (email ~ '.*@.*'),
    name        text not null, -- Add an alphanumeric check?
    password    text not null,
    menu_id     integer not null unique,

    primary key (id),
    foreign key (menu_id) references menus(id)

);



create table staff (
    id          serial,
    email       text not null unique check (email ~ '.*@.*'),
    name        text not null,
    password    text not null,

    primary key (id)
);