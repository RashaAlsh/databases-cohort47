# Exercise 1 : SQL Normalization

## 1. What columns violate 1NF?

Columns food_code and food_description
 violate the rule about no multiple values, each cell should contain only atomic values.

## 2. What entities do you recognize that could be extracted?

The following entities could be extracted and the creation of separate tables for each of them is recommended, as well as the possible relationships between them.

- Member: member-id and member_name
- Dinner: dinner_id and dinner_date
- Venue: venue_code and venue_description
- Food: food_code and food_description

## 3. Name all the tables and columns that would make a 3NF compliant solution.

To make sure the tables are 3NF compliant, each of them needs to have a primary key and each column needs to be dependent only on the primary key of its respective table, like so:

- Members table:

* member_id (PK)
* member_name
* member_address

- Dinners table:

* dinner_id (PK)
* dinner_date

Venues table:

- venue_code (PK)
- venue_description

Foods table:

- food_code (PK)
- food_description

Attendance table:

- attendance_id (PK)
- member_id (FK - reference Members table)
- dinner_id (FK - reference Dinners table)

Dinners-foods table:

- dinner_id (FK - reference Dinners table)
- food_code (FK - reference Foods table)