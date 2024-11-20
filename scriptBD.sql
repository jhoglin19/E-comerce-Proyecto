-- Migrations will appear here as you chat with AI
 
create table customers (
  id bigint primary key auto_increment,
  name text not null,
  email text not null unique,
  password text not null,
  address text
);
 
create table products (
  id bigint primary key auto_increment,
  name text not null,
  description text,
  price decimal(10, 2) not null,
  stock int not null
);
 
create table orders (
  id bigint primary key auto_increment,
  customer_id bigint not null,
  order_date timestamp default current_timestamp,
  status text not null,
  foreign key (customer_id) references customers(id)
);
 
create table order_items (
  id bigint primary key auto_increment,
  order_id bigint not null,
  product_id bigint not null,
  quantity int not null,
  price decimal(10, 2) not null,
  foreign key (order_id) references orders(id),
  foreign key (product_id) references products(id)
);
 
create table reviews (
  id bigint primary key auto_increment,
  product_id bigint not null,
  customer_id bigint not null,
  rating int not null check (
    rating >= 1 and rating <= 5
  ),
  comment text,
  review_date timestamp default current_timestamp,
  foreign key (product_id) references products(id),
  foreign key (customer_id) references customers(id)
);
 
alter table products
add column image text;
 
create table suppliers (
  id bigint primary key auto_increment,
  name text not null,
  contact_info text
);
 
alter table products
add column supplier_id bigint,
add foreign key (supplier_id) references suppliers(id);
 
alter table suppliers
add column email text not null unique;
 
alter table suppliers
add column password text not null;